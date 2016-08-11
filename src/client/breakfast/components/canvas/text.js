'use strict';


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
  return { y, x };
}

function fillTextBlock(context, block, x, startY, textWidth, fontInfo, textAlign) {
  const { fontWeight, fontFace, fontSize } = fontInfo;
  const text = block.getText();
  const characterList = block.getCharacterList();

  let stringToWrite = '';
  let italics = false;
  let currentInlineStyle = '';
  for (let i = 0; i < text.length; i++) {
    currentInlineStyle = `${fontWeight}`;
    if (italics) currentInlineStyle += ' italic';

    const style = characterList.get(i).getStyle();
    let inlineItalics = false;
    let inlineFontWeight = fontWeight;
    style.forEach((value) => {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'italic') {
        inlineItalics = true;
      } else {
        inlineFontWeight = 'fontWeight';
      }
    });

    let inlineStyle = `${inlineFontWeight}`;
    if (inlineItalics) inlineStyle += ' italic';

    if (inlineStyle !== currentInlineStyle) {
      const font = `${currentInlineStyle || fontWeight} ${fontSize}px ${fontFace}`;
      context.font = font;
      fillAllText(context, stringToWrite, x, startY, textWidth, fontSize, textAlign);

      stringToWrite = '';
      italics = false;
    } else {
      italics = inlineItalics;
    }

    currentInlineStyle = inlineStyle;
    stringToWrite = stringToWrite + text[i];
  }
  const font = `${currentInlineStyle || fontWeight} ${fontSize}px ${fontFace}`;
  console.log(font);
  context.font = font;
  return fillAllText(context, text, x, startY, textWidth, fontSize, textAlign);
}

/* eslint-disable no-param-reassign */
export default function updateText(context, canvasStyle, fontOptions,
    blockTypeStyle, textContainer) {
  const { editorState, textPos, fontFace, fontColor, textWidth, textAlign } = textContainer;
  const canvasPadding = canvasStyle.padding;
  const blocks = editorState.getCurrentContent().getBlocksAsArray();
  const canvasTextWidth = canvasStyle.maxTextWidth * (textWidth / 100);

  // Scale up for real drawing
  let y = canvasPadding + (textPos.top * 2);
  let x = canvasPadding + (textPos.left * 2);
  const listPadding = 40 * 2;

  context.fillStyle = fontColor;
  context.textBaseline = 'top';

  let listCount = 0;
  for (const block of blocks) {
    const blockType = block.getType();
    const styleMetrics = getStyleMetrics(blockType, blockTypeStyle);

    const fontInfo = {
      fontWeight: styleMetrics.fontWeight,
      fontSize: styleMetrics.fontSize,
      fontFace,
    };

    if (/(unordered|ordered)-list-item/.test(blockType)) {
      const bullet = /unordered/.test(blockType) ? '•' : `${listCount + 1}.`;
      const bulletLength = measureWord(context, bullet);
      const bulletX = x + (listPadding * 0.75) - bulletLength;
      const textX = x + listPadding;
      const bulletTextWidth = canvasTextWidth - listPadding;

      context.fillText(bullet, bulletX, y);
      const newPos = fillTextBlock(context, block, textX, y, bulletTextWidth, fontInfo, textAlign);
      y = newPos.y;
      x = newPos.x;

      y += styleMetrics.marginBottom * 0.93; // idk!
      listCount += 1;
    } else {
      const newPos = fillTextBlock(context, block, x, y, canvasTextWidth, fontInfo, textAlign);

      y = newPos.y;
      x = newPos.x;

      if (/header-/.test(blockType)) {
        y += styleMetrics.marginBottom;
      }
    }
  }
}
