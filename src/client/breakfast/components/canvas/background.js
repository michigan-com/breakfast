'use strict';

/**
 * Draw the background based on the current background options
 *
 * @param {Object} context - Canvas context https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 * @param {Object} canvasStyle - Height/width of the current canvas so we know where
 *  we need to draw stuff
 * @param {Object} backgroundOptions - current background options (state.Background
 *  for more details)
 * @param {Object} drawImageMetrics - metrics from drawImageMetricsSelector in selectors/background
 *
 */
 /* eslint-disable no-param-resassign*/
export default function updateBackground(context, canvasOptions,
    backgroundOptions, drawImageMetrics) {
  context.fillStyle = backgroundOptions.backgroundColor;
  context.fillRect(0, 0, canvasOptions.width, canvasOptions.height);
  if (backgroundOptions.backgroundImg.img != null) {
    const img = backgroundOptions.backgroundImg.img;
    console.log(canvasOptions, drawImageMetrics);
    context.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      drawImageMetrics.dx,
      drawImageMetrics.dy,
      drawImageMetrics.dWidth,
      drawImageMetrics.dHeight);
  }
}
