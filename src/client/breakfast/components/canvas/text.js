'use strict';

import $ from '../../util/$';

const possibleTags = ['p', 'ol', 'ul', 'h1', 'h2', 'h3', 'br', 'span'];

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
export default function updateText(context, canvasStyle, fontOptions, textOptions, textContent) {

  let $textContext = $(textContent);
  let canvasPadding = canvasStyle.padding;
  let textPos = textOptions.textPos;
  let textWidth = (canvasStyle.width * (textOptions.textWidth / 100)) - (canvasPadding * 2);
  let fontFace = fontOptions.fontFace;

  // Scale up for real drawing
  let y = canvasPadding + (textPos.top * 2);
  let x = canvasPadding + (textPos.left * 2);
  let listPadding = 40 * 2;

  context.fillStyle = fontOptions.fontColor;
  context.textBaseline = 'top';

  $textContext.forEach((el) => {
    let tagName = el.tagName.toLowerCase();
    if (possibleTags.indexOf(tagName) < 0) return;

    // Set context font
    let styleMetrics = getFontStyle(fontOptions, tagName);
    if (!styleMetrics) return;
    context.font = `${styleMetrics.fontWeight} ${styleMetrics.fontSize}px ${fontFace}`;

    if (tagName === 'ul' || tagName === 'ol') {
      let listCount = 0;
      let bulletType = tagName === 'ul' ? 'bullet' : 'number';

      $(el).children('li').forEach((el) => {
        let bullet = bulletType === 'bullet' ? '•' : `${listCount + 1}.`;
        let bulletLength = measureWord(context, bullet);
        let bulletX = x + (listPadding * .75) - bulletLength;
        let textX = x + listPadding;
        let bulletTextWidth = textWidth - listPadding;

        context.fillText(bullet, bulletX, y);
        y = fillAllText(context, el, textX, y, bulletTextWidth, styleMetrics.lineHeight);
        y += styleMetrics.marginBottom * .93; // idk!
        listCount += 1;
      });
    } else {
      y = fillAllText(context, el, x, y, textWidth, styleMetrics.fontSize);
      y += styleMetrics.marginBottom;
    }

  });
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
function fillAllText(context, $el, x, startY, textWidth, fontSize) {
  let y = startY;
  let currentText = $el.textContent.split(' ');
  let line = '';
  let lineWidth = 0;

  for (let word of currentText) {
    let append = !line ? word : ` ${word}`;
    let newLineWidth = lineWidth + measureWord(context, append);
    if (newLineWidth >= textWidth) {
      if (!line) line = word;
      context.fillText(line, x, y);
      y += fontSize;

      line = word;
      lineWidth = measureWord(context, append);
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

function measureWord(context, word) {
  let metrics = context.measureText(word);
  return metrics.width;
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
  let lookupTagName = tagName === 'ul' || tagName === 'ol' || tagName === 'br' ? 'p' : tagName;
  if (!(lookupTagName in fontOptions.styleMetrics)) return null;

  let styleMetrics = fontOptions.styleMetrics[lookupTagName];
  let fontWeight = tagName === 'h1' || tagName === 'h2' ? 'bold' : 'normal';

  return {
    fontSize: styleMetrics.fontSize,
    marginBottom: styleMetrics.marginBottom,
    lineHeight: styleMetrics.lineHeight,
    fontWeight,
  }
}
