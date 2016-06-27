'use strict';

import { BACKGROUND_COLOR_CHANGE, BACKGROUND_IMAGE_CHANGE,
  REMOVE_BACKGROUND_IMAGE, DEFAULT_BACKGROUND_IMAGE, DEFAULT_BACKGROUND,
  BACKGROUND_DRAW_LOCATION_CHANGE, getDrawImageMetrics } from '../../actions/background';
import { ASPECT_RATIO_CHANGE, ASPECT_RATIOS, getAspectRatioValue,
  DEFAULT_ASPECT_RATIO, getCanvasMetrics } from '../../actions/aspect-ratio';

const DEFAULT_STATE = { ...DEFAULT_BACKGROUND, ...DEFAULT_ASPECT_RATIO };

/**
 * ensure min <= value <= max
 */
function fixValue(value, min, max) {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
}

export default function backgroundReducer(state = DEFAULT_STATE, action) {
  let { drawImageMetrics, backgroundColor, aspectRatio, aspectRatioValue,
    canvas } = state;
  let dx;
  let dy;
  switch (action.type) {
    case BACKGROUND_COLOR_CHANGE:
      backgroundColor = action.value;
      return { ...state, backgroundColor };
    case BACKGROUND_IMAGE_CHANGE:
      drawImageMetrics = getDrawImageMetrics(state.canvas, action.value);
      return { ...state,
        backgroundImg: action.value,
        drawImageMetrics,
      };
    case REMOVE_BACKGROUND_IMAGE:
      return { ...state,
        backgroundImg: { ...DEFAULT_BACKGROUND_IMAGE },
        drawImageMetrics: {},
      };
    case ASPECT_RATIO_CHANGE:
    default:
      aspectRatio = action.value;
      aspectRatioValue = getAspectRatioValue(state, aspectRatio);
      if (ASPECT_RATIOS.indexOf(aspectRatio) >= 0) {
        canvas = getCanvasMetrics(state, aspectRatio);
        drawImageMetrics = getDrawImageMetrics(canvas, state.backgroundImg);
        return { ...state,
          aspectRatio,
          aspectRatioValue,
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
  }
  return state;
}
