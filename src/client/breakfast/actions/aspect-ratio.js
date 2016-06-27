'use strict';

export const ASPECT_RATIO_CHANGE = 'ASPECT_RATIO_CHANGE';

export const SIXTEEN_NINE = '16:9';
export const SQUARE = 'Square';
export const TWO_ONE = '2:1 (Twitter)';
export const FACEBOOK = '1.9:1 (Facebook)';
export const FACEBOOK_COVER = 'Facebook Cover Photo';
export const FIT_IMAGE = 'Fit Image';

export const ASPECT_RATIOS = [TWO_ONE, FACEBOOK, SQUARE, FACEBOOK_COVER, SIXTEEN_NINE, FIT_IMAGE];

export function getAspectRatioValue(backgroundState, ratio) {
  switch (ratio) {
    case SIXTEEN_NINE:
      // return 9/16;
      return 16 / 9;
    case TWO_ONE:
      // return 1/2;
      return 2 / 1;
    case FACEBOOK:
      // return 1/1.911;
      return 1.911 / 1;
    case FACEBOOK_COVER:
      // return 0.370153;
      return 1 / 0.370153;
    case FIT_IMAGE: {
      // Only deal with this aspect ratio if we've loaded an image up
      const backgroundImg = backgroundState.backgroundImg;
      if (backgroundImg.img != null) {
        return backgroundImg.width / backgroundImg.height;
      }
      break;
    }
    default:
      return 1;
  }
  return 1;
}

export function getCanvasMetrics(state, ratio = '') {
  // Defaults
  // Scale up by 2
  let canvasWidth = 650;
  if (ratio === SQUARE) {
    canvasWidth = 400;
  } else if (ratio === FIT_IMAGE) {
    const backgroundRatio = state.backgroundImg.width / state.backgroundImg.height;

    if (backgroundRatio < 0.25) {
      canvasWidth = 300;
    } else if (backgroundRatio <= 1) {
      canvasWidth = 400;
    }
  }

  canvasWidth *= 2; // higher res canvas for better image quality

  if (window.innerWidth <= canvasWidth) {
    canvasWidth = window.innerWidth * 0.9;
  }

  const canvasPadding = canvasWidth / 26;
  const maxTextWidth = Math.round(canvasWidth - (canvasPadding * 2));
  const aspectRatioVal = getAspectRatioValue(state, ratio);
  const canvasHeight = canvasWidth / aspectRatioVal;

  return {
    canvasWidth,
    canvasHeight,
    canvasPadding,
    aspectRatio: aspectRatioVal,
    maxTextWidth,
  };
}

export const getDefaultAspectRatioValue = () => {
  const defaultAspectRatio = ASPECT_RATIOS[0];
  return getAspectRatioValue({}, defaultAspectRatio);
};

export const getDefaultCanvasMetrics = () => {
  const defaultAspectRatio = ASPECT_RATIOS[0];
  return getCanvasMetrics({}, defaultAspectRatio);
};

export function aspectRatio(ratio) {
  return {
    type: ASPECT_RATIO_CHANGE,
    value: ratio,
  };
}

export const DEFAULT_ASPECT_RATIO = {
  aspectRatio: ASPECT_RATIOS[0],
  aspectRatioValue: getDefaultAspectRatioValue(),
  canvas: getDefaultCanvasMetrics(),
};
