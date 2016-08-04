'use strict';

import { FIT_IMAGE, SQUARE } from '../actions/background';

import { createSelector } from 'reselect';

/**
 * ensure min <= value <= max
 */
function fixValue(value, min, max) {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
}


const backgroundSelector = (state) => state.Background.present;

export const canvasMetricsSelector = createSelector(
  backgroundSelector,
  (Background) => {
    const aspectRatio = Background.aspectRatioOptions[Background.aspectRatioIndex];
    const { backgroundImg } = Background;
    const { name, value } = aspectRatio;

    // Defaults
    // Scale up by 2
    let canvasWidth = 650;
    if (name === SQUARE) {
      canvasWidth = 400;
    } else if (name === FIT_IMAGE) {
      const backgroundRatio = backgroundImg.width / backgroundImg.height;

      if (backgroundRatio < 0.25) {
        canvasWidth = 300;
      } else if (backgroundRatio <= 1) {
        canvasWidth = 400;
      }
    }

    canvasWidth *= 2; // higher res canvas for better image quality

    if (window.innerWidth <= 768) {
      canvasWidth = window.innerWidth * 1.9;
    } else if (window.innerWidth <= canvasWidth) {
      canvasWidth = window.innerWidth * 0.9;
    }

    const canvasPadding = canvasWidth / 26;
    const textEditorPadding = 10;
    const totalPadding = canvasPadding + textEditorPadding;
    const maxTextWidth = Math.round(canvasWidth - (totalPadding * 2));
    const canvasHeight = canvasWidth / value;

    return {
      canvasWidth,
      canvasHeight,
      canvasPadding,
      aspectRatio: value,
      maxTextWidth,
      textEditorPadding,
      totalPadding,
    };
  }
);

export const drawImageMetricsSelector = createSelector(
  backgroundSelector,
  canvasMetricsSelector,
  (Background, canvasMetrics) => {
    const { backgroundImg } = Background;
    if (backgroundImg.img === null) return null;

    const imgAspectRatio = backgroundImg.width / backgroundImg.height;
    const canvasAspectRatio = canvasMetrics.aspectRatio;

    // the canvas is twice as big as it looks on the screen
    const canvasHeight = canvasMetrics.canvasHeight;
    const canvasWidth = canvasMetrics.canvasWidth;

    const maxDx = canvasWidth;
    const maxDy = canvasHeight;
    let dWidth;
    let dHeight;
    let minDx;
    let minDy;

    // Image is wider than the canvas, so fix the height
    if (imgAspectRatio > canvasAspectRatio) {
      dHeight = canvasHeight;
      dWidth = canvasHeight * imgAspectRatio;
      minDx = dWidth * -1;
      minDy = canvasHeight * -1;
    } else { // Image is skinnier than the canvas, so fix the width
      dWidth = canvasWidth;
      dHeight = canvasWidth / imgAspectRatio;
      minDy = dHeight * -1;
      minDx = canvasWidth * -1;
    }

    let { dx, dy } = Background.backgroundOffset;
    dx = fixValue(dx, minDx, maxDx);
    dy = fixValue(dy, minDy, maxDy);

    return { dx, dy, dWidth, dHeight };
  }
);
