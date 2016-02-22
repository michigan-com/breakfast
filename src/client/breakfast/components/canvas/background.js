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
  switch (backgroundOptions.backgroundType) {
    case BACKGROUND_COLOR:
      context.fillStyle = backgroundOptions.backgroundColor;
      context.fillRect(0, 0, canvasOptions.width, canvasOptions.height);
      break
    case BACKGROUND_IMAGE:
      let img = backgroundOptions.backgroundImg.img;
      let metrics = backgroundOptions.drawImageMetrics;
      context.drawImage(img,
                        metrics.sx, metrics.sy, metrics.sWidth, metrics.sHeight,
                        0, 0, canvasOptions.width, canvasOptions.height);
      break;
  }
}
