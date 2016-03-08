'use strict';

import { TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT } from '../../actions/corner';

/**
 * Draw the background based on the current background options
 *
 * @param {Object} context - Canvas context https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 * @param {Object} canvasStyle - Height/width of the current canvas so we know where
 *  we need to draw stuff
 * @param {Object} logoOptions - Options for the logo, see store.Logo
 *
 */
export default function updateLogo(context, canvasOptions, logoOptions) {
  let canvasPadding = canvasOptions.padding;
  let canvasWidth = canvasOptions.width;
  let canvasHeight = canvasOptions.height;
  let maxLogoWidth = canvasWidth * .3;
  let imgObj = logoOptions.logo.imgObj;

  if (imgObj === null) return;

  let logoAspectRatio = imgObj.width / imgObj.height;
  let logoHeight = canvasHeight / 6;
  let logoWidth = logoHeight * logoAspectRatio;

  if (logoWidth > maxLogoWidth) {
    logoWidth = maxLogoWidth;
    logoHeight = logoWidth / logoAspectRatio;
  }

  let dx, dy;
  switch (logoOptions.logoLocation) {
    case TOP_LEFT:
      dx = canvasPadding;
      dy = canvasPadding;
      break;
    case TOP_RIGHT:
      dx = canvasWidth - canvasPadding - logoWidth;
      dy = canvasPadding;
      break;
    case BOTTOM_RIGHT:
      dx = canvasWidth - canvasPadding - logoWidth;
      dy = canvasHeight - canvasPadding - logoHeight;
      break;
    case BOTTOM_LEFT:
      dx = canvasPadding;
      dy = canvasHeight - canvasPadding - logoHeight;
      break;
  }
  context.drawImage(imgObj, dx, dy, logoWidth, logoHeight);
}
