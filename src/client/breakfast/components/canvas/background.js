'use strict';

import { BACKGROUND_COLOR, BACKGROUND_IMAGE, BACKGROUND_LOADING } from '../../actions/background';

/**
 * Draw the background based on the current background options
 *
 * @param {Object} context - Canvas context https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 * @param {Object} canvasStyle - Height/width of the current canvas so we know where
 *  we need to draw stuff
 * @param {Object} backgroundOptions - current background options (state.Background
 *  for more details)
 *
 */
export default function updateBackground(context, canvasOptions, backgroundOptions) {
  context.fillStyle = backgroundOptions.backgroundColor;
  context.fillRect(0, 0, canvasOptions.width, canvasOptions.height);
  if (backgroundOptions.backgroundImg.img != null) {
    let img = backgroundOptions.backgroundImg.img;
    let metrics = backgroundOptions.drawImageMetrics;
    context.drawImage(img, 0, 0, img.width, img.height, metrics.dx, metrics.dy, metrics.dWidth, metrics.dHeight);
  }
}
