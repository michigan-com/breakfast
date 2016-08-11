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
  const makeChunk = (stringToWrite, width, font) => (
    { text: stringToWrite, width, font }
  );

  let currentX = x;
  let currentY = startY;
  let currentFont = makeFont(fontWeight, false);
  let lineChunks = [];
  let chunkStringWidth = 0;
  let currentChunkString = '';
  let currentWord = '';
  for (let i = 0; i < text.length; i++) {
    const isLastChar = i === (text.length - 1);
    const currentChar = text[i];
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

    // spaces are always included with the previous string
    const inlineFont = currentChar === ' ' ? currentFont : makeFont(inlineFontWeight, inlineItalic);
    const testWord = currentWord + currentChar;
    const testString = `${currentChunkString}${testWord}`;
    context.font = currentFont;

    const testStringWidth = measureWord(context, testString);
    const stringIsTooLong = testStringWidth + currentX >= textWidth;

    // Make a new chunk
    if (inlineFont !== currentFont || stringIsTooLong || isLastChar) {
      if (isLastChar) {
        chunkStringWidth = testStringWidth;
        currentChunkString = testString;
      }
      lineChunks.push(makeChunk(currentChunkString, chunkStringWidth, currentFont));

      let chunkX = currentX;
      if (textAlign === 'center') chunkX = (textWidth - chunkStringWidth) / 2;
      else if (textAlign === 'right') chunkX = (textWidth - currentChunkString);
      for (const lineChunk of lineChunks) {
        lineChunk.x = chunkX;
        lineChunk.y = currentY;
        textChunks.push({ ...lineChunk });

        chunkX += lineChunk.width;
      }

      currentWord = testWord;
      currentChunkString = '';
      lineChunks = [];
      chunkStringWidth = measureWord(context, currentChunkString);
      if (stringIsTooLong) {
        currentY += fontSize;
        currentX = x;
      } else {
        currentX = chunkX;
      }
    } else {
      if (currentChar === ' ') {
        currentChunkString = `${currentChunkString}${testWord}`;
        chunkStringWidth = measureWord(context, currentChunkString);
        currentWord = '';
      } else {
        currentWord = testWord;
      }
    }

    currentFont = inlineFont;
  }

  // push any reamining chunk
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
      context.font = `${fontInfo.fontWeight} ${fontInfo.fontSize}px ${fontInfo.fontFace}`;
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
