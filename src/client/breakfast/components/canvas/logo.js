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
  const canvasPadding = canvasOptions.padding;
  const canvasWidth = canvasOptions.width;
  const canvasHeight = canvasOptions.height;
  const canvasAspectRatio = canvasOptions.width / canvasOptions.height;
  const imgObj = logoOptions.logo.imgObj;

  let maxLogoWidth = canvasWidth * 0.3;
  if (canvasAspectRatio === 1) maxLogoWidth = canvasWidth * 0.4;
  else if (canvasAspectRatio < 1) maxLogoWidth = canvasWidth * 0.45;

  if (imgObj === null) return;

  const logoAspectRatio = imgObj.width / imgObj.height;
  let logoHeight = canvasHeight / 9;
  if (logoAspectRatio === 1) {
    logoHeight = canvasHeight / 5;
  } else if (logoAspectRatio < 1) {
    logoHeight = canvasHeight / 3;
  } else if (logoAspectRatio > 5) {
    logoHeight = canvasHeight / 7;
  }
  let logoWidth = logoHeight * logoAspectRatio;

  if (logoWidth > maxLogoWidth) {
    logoWidth = maxLogoWidth;
    logoHeight = logoWidth / logoAspectRatio;
  }

  let dx;
  let dy;
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
    default:
      dx = canvasPadding;
      dy = canvasHeight - canvasPadding - logoHeight;
      break;
  }
  context.drawImage(imgObj, dx, dy, logoWidth, logoHeight);
}
