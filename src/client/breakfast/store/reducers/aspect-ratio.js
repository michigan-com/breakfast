'use strict';

import assign from 'object-assign';

import { ASPECT_RATIO_CHANGE, ASPECT_RATIOS, getAspectRatioValue,
  getCanvasMetrics } from '../../actions/aspect-ratio';

export default aspectRatioReducer(state, action) {
  switch (action.type) {
    case ASPECT_RATIO_CHANGE:
      let aspectRatio = action.value;
      let aspectRatioValue = getAspectRatioValue(state, aspectRatio);
      if (ASPECT_RATIOS.indexOf(aspectRatio) >= 0) {
        let canvas = options.canvas = getCanvasMetrics(state, aspectRatio);
        return assign({}, state, { aspectRatio, aspectRatioValue, canvas });
      }
    case default:
      return state;
  }
}
