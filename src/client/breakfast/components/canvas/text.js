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
function fillAllText(context, text, x, startY, textWidth, fontSize, textAlign) {
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

/* eslint-disable no-param-reassign */
export default function updateText(context, canvasStyle, fontOptions,
    blockTypeStyle, textContainer) {
  const { editorState, textPos, fontFace, fontColor, textWidth, textAlign } = textContainer;
  const canvasPadding = canvasStyle.padding;
  const blocks = editorState.getCurrentContent().getBlocksAsArray();
  const canvasTextWidth = canvasStyle.maxTextWidth * (textWidth / 100);

  // Scale up for real drawing
  let y = canvasPadding + (textPos.top * 2);
  const x = canvasPadding + (textPos.left * 2);
  const listPadding = 40 * 2;

  context.fillStyle = fontColor;
  context.textBaseline = 'top';

  let listCount = 0;
  for (const block of blocks) {
    const blockType = block.getType();
    const styleMetrics = getStyleMetrics(blockType, blockTypeStyle);

    // These have to be adjusted slightly to make html and canvas work the same
    const fontSize = styleMetrics.fontSize;

    const font = `${styleMetrics.fontWeight} ${fontSize}px ${fontFace}`;
    context.font = font;

    if (/(unordered|ordered)-list-item/.test(blockType)) {
      const bullet = /unordered/.test(blockType) ? '•' : `${listCount + 1}.`;
      const bulletLength = measureWord(context, bullet);
      const bulletX = x + (listPadding * 0.75) - bulletLength;
      const textX = x + listPadding;
      const bulletTextWidth = canvasTextWidth - listPadding;

      context.fillText(bullet, bulletX, y);
      y = fillAllText(context, block.getText(), textX, y, bulletTextWidth, fontSize, textAlign);
      y += styleMetrics.marginBottom * 0.93; // idk!
      listCount += 1;
    } else {
      y = fillAllText(context, block.getText(), x, y, canvasTextWidth, fontSize, textAlign);

      if (/header-/.test(blockType)) {
        y += styleMetrics.marginBottom;
      }
    }
  }
}
