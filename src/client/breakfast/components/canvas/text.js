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

/**
 * Draw the background based on the current background options
 *
 * @param {Object} context - Canvas context https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 * @param {Object} canvasStyle - Height/width of the current canvas so we know where
 *  we need to draw stuff
 * @param {Object} fontOptions - current font options (see state.Font)
 * @param {Object} textOptions - current text options (state.Text);
 * @param {String} textContext - Context from the medium toolbar serialize() function
 *
 */
function _updateText(context, canvasStyle, fontOptions, textOptions, textContent) {
  const $textContext = $(textContent);
  const canvasPadding = canvasStyle.padding;
  const textPos = textOptions.textPos;
  const textWidth = canvasStyle.maxTextWidth * (textOptions.textWidth / 100);
  const fontFace = fontOptions.fontFace;


  $textContext.forEach((el) => {
    const tagName = el.tagName.toLowerCase();
    if (possibleTags.indexOf(tagName) < 0) return;

    // Set context font
    const styleMetrics = getFontStyle(fontOptions, tagName);
    if (!styleMetrics) return;
    context.font = `${styleMetrics.fontWeight} ${styleMetrics.fontSize}px ${fontFace}`;

    if (tagName === 'ul' || tagName === 'ol') {
      let listCount = 0;
      const bulletType = tagName === 'ul' ? 'bullet' : 'number';

      $(el).children('li').forEach((element) => {
        const bullet = bulletType === 'bullet' ? '•' : `${listCount + 1}.`;
        const bulletLength = measureWord(context, bullet);
        const bulletX = x + (listPadding * 0.75) - bulletLength;
        const textX = x + listPadding;
        const bulletTextWidth = textWidth - listPadding;

        context.fillText(bullet, bulletX, y);
        y = fillAllText(context, element, textX, y, bulletTextWidth, styleMetrics.lineHeight);
        y += styleMetrics.marginBottom * 0.93; // idk!
        listCount += 1;
      });
    } else {
      y = fillAllText(context, el, x, y, textWidth, styleMetrics.fontSize);
      y += styleMetrics.marginBottom;
    }
  });
}

export default function updateText(context, canvasStyle, fontOptions,
    blockTypeStyle, textContainer) {
  const { editorState, textPos, fontFace, fontColor, textWidth } = textContainer;
  const canvasPadding = canvasStyle.padding;
  const blocks = editorState.getCurrentContent().getBlocksAsArray();
  const canvasTextWidth = canvasStyle.maxTextWidth * (textWidth / 100);

  // Scale up for real drawing
  let y = canvasPadding + (textPos.top * 2);
  const x = canvasPadding + (textPos.left * 2);
  const listPadding = 40 * 2;

  context.fillStyle = fontColor;
  context.textBaseline = 'top';

  for (const block of blocks) {
    // TODO style metrics
    const styleMetrics = getStyleMetrics(block.getType(), blockTypeStyle);
    const font = `${styleMetrics.fontWeight} ${styleMetrics.fontSize}px ${fontFace}`;
    console.log(font);
    context.font = font;
    y = fillAllText(context, block.getText(), x, y, canvasTextWidth, styleMetrics.fontSize);
    y += styleMetrics.marginBottom;
  }
}
