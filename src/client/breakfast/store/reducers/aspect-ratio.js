'use strict';

import assign from 'object-assign';

import { ASPECT_RATIO_CHANGE, ASPECT_RATIOS, getAspectRatioValue,
  DEFAULT_ASPECT_RATIO, getCanvasMetrics } from '../../actions/aspect-ratio';

export default function aspectRatioReducer(state=DEFAULT_ASPECT_RATIO, action) {
  switch (action.type) {
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
