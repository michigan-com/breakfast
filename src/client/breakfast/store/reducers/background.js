'use strict';

import assign from 'object-assign';

import { BACKGROUND_COLOR_CHANGE, BACKGROUND_IMAGE_CHANGE, BACKGROUND_IMAGE_LOADING,
  REMOVE_BACKGROUND_IMAGE, BACKGROUND_TYPE_CHANGE, DEFAULT_BACKGROUND_IMAGE,
  BACKGROUND_TYPES, BACKGROUND_COLOR, BACKGROUND_IMAGE, BACKGROUND_LOADING,
  DEFAULT_BACKGROUND, BACKGROUND_IMAGE_UPLOAD, BACKGROUND_DRAW_LOCATION_CHANGE,
  getDrawImageMetrics } from '../../actions/background';
import { ASPECT_RATIO_CHANGE, ASPECT_RATIOS, getAspectRatioValue,
  DEFAULT_ASPECT_RATIO, getCanvasMetrics } from '../../actions/aspect-ratio';

const DEFAULT_STATE = assign({}, DEFAULT_BACKGROUND, DEFAULT_ASPECT_RATIO);

/**
 * ensure min <= value <= max
 */
function fixValue(value, min, max) {
  if (value < min) return min;
  else if (value > max) return max;
  else return value;
}

export default function backgroundReducer(state=DEFAULT_STATE, action) {
  let drawImageMetrics;
  switch (action.type) {
    case BACKGROUND_COLOR_CHANGE:
      let backgroundColor = action.value;
      return assign({}, state, { backgroundColor });
    case BACKGROUND_IMAGE_CHANGE:
      drawImageMetrics = getDrawImageMetrics(state.canvas, action.value);
      return assign({}, state, {
        backgroundImg: action.value,
        drawImageMetrics
      });
    case REMOVE_BACKGROUND_IMAGE:
      return assign({}, state, {
        backgroundImg: assign({}, DEFAULT_BACKGROUND_IMAGE),
        drawImageMetrics: {}
      });
    case ASPECT_RATIO_CHANGE:
      let aspectRatio = action.value;
      let aspectRatioValue = getAspectRatioValue(state, aspectRatio);
      if (ASPECT_RATIOS.indexOf(aspectRatio) >= 0) {
        let canvas = getCanvasMetrics(state, aspectRatio);
        let drawImageMetrics = getDrawImageMetrics(canvas, state.backgroundImg);
        return assign({}, state, {
          aspectRatio,
          aspectRatioValue,
          canvas,
          drawImageMetrics
        });
      }
      break;
    case BACKGROUND_DRAW_LOCATION_CHANGE:
      let { dx, dy } = action.value;

      dx = fixValue(dx, state.drawImageMetrics.minDx, state.drawImageMetrics.maxDx);
      dy = fixValue(dy, state.drawImageMetrics.minDy, state.drawImageMetrics.maxDy);
      drawImageMetrics = assign({}, state.drawImageMetrics, { dx, dy });
      return assign({}, state, { drawImageMetrics });
  }
  return state;
}

