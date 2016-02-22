'use strict';

import { BACKGROUND_IMAGE } from './background';

export const ASPECT_RATIO_CHANGE = 'ASPECT_RATIO_CHANGE';

export const SIXTEEN_NINE = '16:9'
export const SQUARE = 'Square';
export const TWO_ONE = '2:1 (Twitter)';
export const FACEBOOK = '1.9:1 (Facebook)';
export const FACEBOOK_COVER = 'Facebook Cover Photo';
export const FIT_IMAGE = 'Fit Image';

export const ASPECT_RATIOS = [TWO_ONE, FACEBOOK, SQUARE, FACEBOOK_COVER, SIXTEEN_NINE, FIT_IMAGE];

export const getDefaultAspectRatioValue = () => {
  let defaultAspectRatio = ASPECT_RATIOS[0];
  return getAspectRatioValue({}, defaultAspectRatio);
}

export const getAspectRatioValue = (backgroundState, aspectRatio) => {
  switch (aspectRatio) {
    case SIXTEEN_NINE:
      //return 9/16;
      return 16/9;
    case TWO_ONE:
      //return 1/2;
      return 2/1;
    case FACEBOOK:
      //return 1/1.911;
      return 1.911 / 1;
    case FACEBOOK_COVER:
      //return 0.370153;
      return 1 / 0.370153;
    case FIT_IMAGE:
      // Only deal with this aspect ratio if we've loaded an image up
      if (backgroundState.backgroundType === BACKGROUND_IMAGE) {
        let backgroundImg = backgroundState.backgroundImg;
        return backgroundImg.width / backgroundImg.height;
      }
  }
  return 1;
}

export const getDefaultCanvasMetrics = () => {
  let defaultAspectRatio = ASPECT_RATIOS[0];
  return getCanvasMetrics({}, defaultAspectRatio);
}

export const getCanvasMetrics = (state, aspectRatio='') => {
  // Defaults
  let canvasWidth = 650;
  if (aspectRatio === SQUARE) {
    canvasWidth = 400;
  } else if (aspectRatio === FIT_IMAGE) {
    if (state.backgroundType === BACKGROUND_IMAGE) {
      let ratio = state.backgroundImg.width / state.backgroundImg.height;

      if (ratio < .25) {
        canvasWidth = 300;
      } else if (ratio <= 1) {
        canvasWidth = 400;
      }
    }
  }

  if (window.innerWidth <= canvasWidth) {
    canvasWidth = window.innerWidth * .9;
  }

  let canvasPadding = canvasWidth / 26;
  let maxTextWidth = canvasWidth - (canvasPadding * 2);
  let aspectRatioVal = getAspectRatioValue(state, aspectRatio);
  let canvasHeight = canvasWidth / aspectRatioVal;

  return {
    canvasWidth,
    canvasHeight,
    canvasPadding,
    aspectRatio: aspectRatioVal,
    maxTextWidth
  }
}

export function aspectRatio(ratio) {
  return {
    type: ASPECT_RATIO_CHANGE,
    value: ratio
  }
}

export const DEFAULT_ASPECT_RATIO = {
  aspectRatio: ASPECT_RATIOS,
  aspectRatioValue: getDefaultAspectRatioValue(),
  canvas: getDefaultCanvasMetrics()
}
