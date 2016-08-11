'use strict';

/* eslint-disable no-param-reassign */

function measureWord(context, word) {
  const metrics = context.measureText(word);
  return metrics.width;
}

function getStyleMetrics(blockType, blockTypeStyle) {
  for (const style of blockTypeStyle) {
    if (style.blockType.style === blockType) return style;
  }

  return blockTypeStyle[0];
}

/**
 * Draw an entire element's textContext to the canvas, accounting for text wrapping
 * Assumes font, fillStyle, and other cnavas context settings are previously set
 *
 * @param {Object} context - canvas 2d context
 * @param {Object} $el - DOMtastic element to draw
 * @param {Number} x - x value to draw text at
 * @param {Number} startY - starting top
 * @param {Number} textWidth - maximum allowable width the text can span
 * @param {Number} fontSize - so we know where to put the next line of text
 * @param {String} textAlign - how to align the text, will affect what x is drawn to
 * @return {Number} the x coordinate of the next line
 */
export function fillAllText(context, text, x, startY, textWidth, fontSize, textAlign) {
  let y = startY;
  let line = '';
  let lineWidth = 0;
  const currentText = text.split(' ');

  function getDrawX(lineToDraw) {
    if (textAlign === 'left') return x;

    const lineLength = measureWord(context, lineToDraw);
    let lineDelta = textWidth - lineLength;
    if (textAlign === 'center') lineDelta /= 2;

    return (x + lineDelta) + 5; // +5, idk
  }

  for (const word of currentText) {
    const append = !line ? word : ` ${word}`;
    const newLineWidth = lineWidth + Math.round(measureWord(context, append));
    if (newLineWidth >= textWidth) {
      if (!line) line = word;
      const drawX = getDrawX(line);
      context.fillText(line, drawX, y);
      y += fontSize;

      line = word;
      lineWidth = measureWord(context, word);
    } else {
      line += append;
      lineWidth = newLineWidth;
    }
  }

  // Fill the remainder, if any
  const drawX = getDrawX(line);
  context.fillText(line, drawX, y);
  y += fontSize;
  return y;
}

function fillTextBlock(context, block, x, startY, textWidth, fontInfo, textAlign) {
  const { fontWeight, fontFace, fontSize } = fontInfo;
  const text = block.getText();
  const characterList = block.getCharacterList();
  const textChunks = [];
  const makeFont = (contextFontWeight, italic) => {
    let fontStyle = `${contextFontWeight}`;
    if (italic) fontStyle += ' italic';
    return `${fontStyle} ${fontSize}px ${fontFace}`;
  };

  // A "chunk" is definited by a block of text that needs to be drawn.
  // Each chunk has an x, y, font, and text, so that we can write it to the canvsa
  const makeChunk = (stringToWrite, stringX, stringY, font) => (
    { text: stringToWrite, x: stringX, y: stringY, font }
  );

  let currentString = '';
  let currentItalic = false;
  let currentFontWeight = fontWeight;
  let currentX = x;
  let currentY = startY;
  let currentWord = '';
  let currentFont = makeFont(currentFontWeight, currentItalic);
  for (let i = 0; i < text.length; i++) {
    let currentChar = text[i];
    let inlineItalic = false;
    let inlineFontWeight = fontWeight;
    const style = characterList.get(i).getStyle();
    style.forEach((value) => {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'italic') {
        inlineItalic = true;
      } else {
        inlineFontWeight = lowerValue;
      }
    });

    const inlineFont = makeFont(inlineFontWeight, inlineItalic);
    let shouldMakeChunk = false;
    let newLineChunk = false;

    // This is a chunk
    if (inlineFont !== currentFont) {
      if (currentWord) currentString += `${currentWord}`;
      if (currentChar === ' ') {
        currentString += ' ';
        currentChar = '';
      }
      shouldMakeChunk = true;
    } else {
      // Only test chunk widths on line breaks
      if (currentChar === ' ') {
        const testString = currentString ? `${currentString} ${currentWord}` : currentWord;
        const contextFont = context.font;
        context.font = currentFont;
        const newLineWidth = Math.round(measureWord(context, testString));
        if (newLineWidth + currentX >= textWidth) {
          shouldMakeChunk = true;
          newLineChunk = true;
        } else {
          currentString += `${currentWord} `;
          currentWord = '';
        }
        context.font = contextFont;
      } else {
        currentWord += currentChar;
      }
    }

    if (shouldMakeChunk) {
      const contextFont = context.font;
      context.font = currentFont;
      const newLineWidth = Math.round(measureWord(context, currentString));
      context.font = contextFont;
      textChunks.push(makeChunk(currentString, currentX, currentY, currentFont));

      if (newLineChunk) {
        currentX = x;
        currentY += fontSize;
      } else {
        currentX += newLineWidth;
      }
      currentString = '';
      currentWord = `${currentChar}`;
    }

    currentItalic = inlineItalic;
    currentFontWeight = inlineFontWeight;
    currentFont = makeFont(currentFontWeight, currentItalic);
  }

  // push any reamining chunk
  if (currentWord) currentString += `${currentWord} `;
  textChunks.push(makeChunk(currentString, currentX, currentY, currentFont));
  for (const chunk of textChunks) {
    context.font = chunk.font;
    context.fillText(chunk.text, chunk.x, chunk.y);
  }

  return currentY + fontSize;
}

export default function updateText(context, canvasStyle, fontOptions,
    blockTypeStyle, textContainer) {
  const { editorState, textPos, fontFace, fontColor, textWidth, textAlign } = textContainer;
  const canvasPadding = canvasStyle.padding;
  const blocks = editorState.getCurrentContent().getBlocksAsArray();
  const canvasTextWidth = canvasStyle.maxTextWidth * (textWidth / 100);

  const textPosPx = {
    top: textPos.top * (canvasStyle.height / 2),
    left: textPos.left * (canvasStyle.width / 2),
  };

  // Scale up for real drawing
  let y = canvasPadding + (textPosPx.top * 2);
  let x = canvasPadding + (textPosPx.left * 2);
  const listPadding = 40 * 2;

  context.fillStyle = fontColor;
  context.textBaseline = 'top';

  let listCount = 0;
  for (const block of blocks) {
    const blockType = block.getType();
    const styleMetrics = getStyleMetrics(blockType, blockTypeStyle);

    const fontInfo = {
      fontWeight: styleMetrics.fontWeight === 'normal' ? '' : styleMetrics.fontWeight,
      fontSize: styleMetrics.fontSize,
      fontFace,
    };

    if (/(unordered|ordered)-list-item/.test(blockType)) {
      const bullet = /unordered/.test(blockType) ? '•' : `${++listCount}.`;
      const bulletLength = measureWord(context, bullet);
      const bulletX = x + (listPadding * 0.75) - bulletLength;
      const textX = x + listPadding;
      const bulletTextWidth = canvasTextWidth - listPadding;

      context.fillText(bullet, bulletX, y);
      y = fillTextBlock(context, block, textX, y, bulletTextWidth, fontInfo, textAlign);

      y += styleMetrics.marginBottom * 0.93; // idk!
    } else {
      y = fillTextBlock(context, block, x, y, canvasTextWidth, fontInfo, textAlign);

      if (/header-/.test(blockType)) {
        y += styleMetrics.marginBottom;
      }
    }
  }
}
