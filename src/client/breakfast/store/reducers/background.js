'use strict';

import { BACKGROUND_COLOR_CHANGE, BACKGROUND_IMAGE_CHANGE,
  REMOVE_BACKGROUND_IMAGE, DEFAULT_BACKGROUND_IMAGE, DEFAULT_STATE,
  BACKGROUND_DRAW_LOCATION_CHANGE, getDrawImageMetrics, ASPECT_RATIO_CHANGE,
  FIT_IMAGE, ASPECT_RATIOS, getAspectRatioValue, getCanvasMetrics } from '../../actions/background';

/**
 * ensure min <= value <= max
 */
function fixValue(value, min, max) {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
}

export default function backgroundReducer(state = DEFAULT_STATE, action) {
  let { drawImageMetrics, backgroundColor, aspectRatioIndex, canvas } = state;
  let dx;
  let dy;
  let newState = null;
  const { aspectRatioOptions } = state;
  const newAspectRatioOptions = [];
  const currentAspectRatio = aspectRatioOptions[aspectRatioIndex];
  switch (action.type) {
    case BACKGROUND_COLOR_CHANGE:
      backgroundColor = action.value;
      return { ...state, backgroundColor };
    case BACKGROUND_IMAGE_CHANGE:
      newState = { backgroundImg: action.value };
      drawImageMetrics = getDrawImageMetrics(state.canvas, action.value);
      for (const ratio of aspectRatioOptions) {
        if (ratio.name === FIT_IMAGE) {
          ratio.value = getAspectRatioValue(newState, FIT_IMAGE);
        }
        newAspectRatioOptions.push(ratio);
      }

      if (currentAspectRatio.name === FIT_IMAGE) {
        canvas = getCanvasMetrics(newState, FIT_IMAGE);
      }

      return { ...state,
        ...newState,
        canvas,
        aspectRatioOptions: newAspectRatioOptions,
        drawImageMetrics,
      };
    case REMOVE_BACKGROUND_IMAGE:
      // TODO remove attribution
      console.log(currentAspectRatio.name);
      if (currentAspectRatio.name === FIT_IMAGE) {
        aspectRatioIndex = 0;
        canvas = getCanvasMetrics({}, aspectRatioOptions[aspectRatioIndex]);
      }
      return { ...state,
        backgroundImg: { ...DEFAULT_BACKGROUND_IMAGE },
        drawImageMetrics: {},
        aspectRatioIndex,
        canvas,
      };
    case ASPECT_RATIO_CHANGE:
      aspectRatioIndex = action.value;
      if (aspectRatioIndex >= 0 && aspectRatioIndex < ASPECT_RATIOS.length) {
        const aspectRatio = ASPECT_RATIOS[aspectRatioIndex];
        canvas = getCanvasMetrics(state, aspectRatio);
        drawImageMetrics = getDrawImageMetrics(canvas, state.backgroundImg);
        return { ...state,
          aspectRatioIndex,
          canvas,
          drawImageMetrics,
        };
      }
      break;
    case BACKGROUND_DRAW_LOCATION_CHANGE:
      dx = action.value.dx;
      dy = action.value.dy;

      dx = fixValue(dx, state.drawImageMetrics.minDx, state.drawImageMetrics.maxDx);
      dy = fixValue(dy, state.drawImageMetrics.minDy, state.drawImageMetrics.maxDy);
      drawImageMetrics = { ...state.drawImageMetrics, dx, dy };
      return { ...state, drawImageMetrics };
    default:
      return { ...state };
  }
  return { ...state };
}
