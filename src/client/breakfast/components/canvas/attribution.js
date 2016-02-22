'use strict';

import { TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT } from '../../actions/corner';

/**
 * Draw the background based on the current background options
 *
 * @param {Object} context - Canvas context https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 * @param {Object} canvasStyle - Height/width of the current canvas so we know where
 *  we need to draw stuff
 * @param {Object} attributionOptions - current attribution options (state.Attribution
 *  for more details)
 * @param {Object} fontOptions - current font options (see state.Font)
 *
 */
export default function updateAttribution(context, canvasStyle, attributionOptions, fontOptions) {
  let attribution = attributionOptions.attribution;

  if (!attribution) return;

  let canvasPadding = canvasStyle.padding;
  let canvasWidth = canvasStyle.width;
  let canvasHeight = canvasStyle.height;
  let fontFace = fontOptions.fontFace;
  let fontSize = canvasStyle.height / 25;
  let lineHeight = fontSize;
  let textWidth = canvasStyle.width;

  context.font = `${fontSize}px ${fontFace}`;
  context.fillStyle = attributionOptions.attributionColor;
  let textMetrics = context.measureText(attribution);

  let x, y;
  switch (attributionOptions.attributionLocation) {
    case TOP_LEFT:
      x = canvasPadding;
      y = canvasPadding;
      break;
    case TOP_RIGHT:
      x = canvasWidth - canvasPadding - textMetrics.width;
      y = canvasPadding;
      break;
    case BOTTOM_RIGHT:
      x = canvasWidth - canvasPadding - textMetrics.width;
      y = canvasHeight - canvasPadding;
      break;
    case BOTTOM_LEFT:
      x = canvasPadding;
      y = canvasHeight - canvasPadding;
      break;
  }

  context.fillText(attribution, x, y);
}
