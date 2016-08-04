'use strict';

import $ from '../../util/$';

const possibleTags = ['p', 'ol', 'ul', 'h1', 'h2', 'h3', 'br', 'span'];

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
 * @return {Number} the x coordinate of the next line
 */
function fillAllText(context, text, x, startY, textWidth, fontSize) {
  let y = startY;
  let line = '';
  let lineWidth = 0;
  const currentText = text.split(' ');

  for (const word of currentText) {
    const append = !line ? word : ` ${word}`;
    const newLineWidth = lineWidth + Math.round(measureWord(context, append));
    if (newLineWidth >= textWidth) {
      if (!line) line = word;
      context.fillText(line, x, y);
      y += fontSize;

      line = word;
      lineWidth = measureWord(context, word);
    } else {
      line += append;
      lineWidth = newLineWidth;
    }
  }

  // Fill the remainder, if any
  context.fillText(line, x, y);
  y += fontSize;
  return y;
}

/**
 * Get the canvas context font given different HTML tags.
 * Accounts for the fact that we're actually doubling the canvas size
 *
 * @param {Object} fontOptions - state.Font
 * @param {String} tagName - must be in possibleTags array
 *
 * @return {Object} contains font metrics, or null on failure
 */
function getFontStyle(fontOptions, tagName) {
  const lookupTagName = tagName === 'ul' || tagName === 'ol' || tagName === 'br' ? 'p' : tagName;
  if (!(lookupTagName in fontOptions.styleMetrics)) return null;

  const styleMetrics = fontOptions.styleMetrics[lookupTagName];
  const fontWeight = tagName === 'h1' || tagName === 'h2' ? 'bold' : 'normal';

  return {
    fontSize: styleMetrics.fontSize,
    marginBottom: styleMetrics.marginBottom,
    lineHeight: styleMetrics.lineHeight,
    fontWeight,
  };
}

export default function updateText(context, canvasStyle, fontOptions,
    blockTypeStyle, textContainer) {
  const { editorState, textPos, fontFace, fontColor, textWidth } = textContainer;
  const canvasPadding = canvasStyle.padding;
  const blocks = editorState.getCurrentContent().getBlocksAsArray();
  const canvasTextWidth = canvasStyle.maxTextWidth * (textWidth / 100);
  console.log(canvasTextWidth, textWidth);

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
    const lineHeight = styleMetrics.lineHeight;
    const marginBottom = styleMetrics.marginBottom;

    const font = `${styleMetrics.fontWeight} ${fontSize}px ${fontFace}`;
    context.font = font;

    if (/(unordered|ordered)-list-item/.test(blockType)) {
      const bullet = /unordered/.test(blockType) ? '•' : `${listCount + 1}.`;
      const bulletLength = measureWord(context, bullet);
      const bulletX = x + (listPadding * 0.75) - bulletLength;
      const textX = x + listPadding;
      const bulletTextWidth = canvasTextWidth - listPadding;

      context.fillText(bullet, bulletX, y);
      y = fillAllText(context, block.getText(), textX, y, bulletTextWidth, fontSize);
      y += styleMetrics.marginBottom * 0.93; // idk!
      listCount += 1;
    } else {
      y = fillAllText(context, block.getText(), x, y, canvasTextWidth, fontSize);

      if (/header-/.test(blockType)) {
        y += styleMetrics.marginBottom;
      }
    }
  }
}
