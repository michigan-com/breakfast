'use strict';

import { ATTRIBUTION_CHANGE, ATTRIBUTION_COLOR_CHANGE,
  ATTRIBUTION_LOCATION_CHANGE, DEFAULT_ATTRIBUTION } from '../../actions/attribution';
import { CORNER_OPTIONS } from '../../actions/corner';

export default function attributionReducer(state = DEFAULT_ATTRIBUTION, action) {
  let { attribution, attributionColor, attributionLocation } = state;
  switch (action.type) {
    case ATTRIBUTION_CHANGE:
      attribution = action.value;
      return { ...state, attribution };
    case ATTRIBUTION_COLOR_CHANGE:
      attributionColor = action.value;
      return { ...state, attributionColor };
    case ATTRIBUTION_LOCATION_CHANGE:
      attributionLocation = action.value;
      if (CORNER_OPTIONS.indexOf(attributionLocation) >= 0) {
        return { ...state, attributionLocation };
      }
      break;
    default:
      return state;
  }
  return state;
}
