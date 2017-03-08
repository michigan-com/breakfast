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
  const attribution = attributionOptions.attribution;

  if (!attribution) return;

  const canvasPadding = canvasStyle.padding;
  const canvasWidth = canvasStyle.width;
  const canvasHeight = canvasStyle.height;
  const fontFace = 'Futura Today';
  const fontSize = canvasStyle.height / 25;

  context.font = `${fontSize}px ${fontFace}`;
  context.fillStyle = attributionOptions.attributionColor;
  const textMetrics = context.measureText(attribution);

  let x;
  let y;
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
    default:
      x = canvasPadding;
      y = canvasHeight - canvasPadding;
      break;
  }

  context.fillText(attribution, x, y);
}
