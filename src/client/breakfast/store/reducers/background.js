'use strict';

import assign from 'object-assign';

import { BACKGROUND_COLOR_CHANGE, BACKGROUND_IMAGE_CHANGE, BACKGROUND_IMAGE_LOADING,
  REMOVE_BACKGROUND_IMAGE, BACKGROUND_TYPE_CHANGE, DEFAULT_BACKGROUND_IMAGE,
  BACKGROUND_TYPES, BACKGROUND_COLOR, BACKGROUND_IMAGE, BACKGROUND_LOADING,
  DEFAULT_BACKGROUND, BACKGROUND_IMAGE_UPLOAD } from '../../actions/background';
import { ASPECT_RATIO_CHANGE, ASPECT_RATIOS, getAspectRatioValue,
  DEFAULT_ASPECT_RATIO, getCanvasMetrics } from '../../actions/aspect-ratio';

const DEFAULT_STATE = assign({}, DEFAULT_BACKGROUND, DEFAULT_ASPECT_RATIO);

export default function backgroundReducer(state=DEFAULT_STATE, action) {
  switch (action.type) {
    case BACKGROUND_COLOR_CHANGE:
      let backgroundColor = action.value;
      return assign({}, state, { backgroundColor, backgroundType: BACKGROUND_COLOR });
    case BACKGROUND_IMAGE_CHANGE:
      return assign({}, state, { backgroundImg: action.value, backgroundType: BACKGROUND_IMAGE });
    case BACKGROUND_IMAGE_UPLOAD:
    case BACKGROUND_IMAGE_LOADING:
      return assign({}, state, { backgroundType: BACKGROUND_LOADING });
    case REMOVE_BACKGROUND_IMAGE:
      return assign({}, state, { backgroundImg: assign({}, DEFAULT_BACKGROUND_IMAGE) });
    case BACKGROUND_TYPE_CHANGE:
      if (BACKGROUND_TYPES.indexOf(action.value) >= 0) {
        return assign({}, state, { backgroundType: action.value });
      }
    case ASPECT_RATIO_CHANGE:
      let aspectRatio = action.value;
      let aspectRatioValue = getAspectRatioValue(state, aspectRatio);
      if (ASPECT_RATIOS.indexOf(aspectRatio) >= 0) {
        let canvas = getCanvasMetrics(state, aspectRatio);
        return assign({}, state, { aspectRatio, aspectRatioValue, canvas });
      }
  }
  return state;
}

