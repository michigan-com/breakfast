'use strict';

import assign from 'object-assign';

import { ATTRIBUTION_CHANGE, ATTIRBUTION_COLOR_CHANGE,
  ATTRIBUTION_LOCATION_CHANGE, DEFAULT_ATTRIBUTION } from '../../actions/attribution';
import { CORNER_OPTIONS } from '../../actions/corner';

export default function attributionReducer(state=DEFAULT_ATTRIBUTION, action) {
  switch (action.type) {
    case ATTRIBUTION_CHANGE:
      let attribution = action.value;
      return assign({}, state, {
        attribution: assign({}, state.attribution, { attribution })
      });
    case ATTIRBUTION_COLOR_CHANGE:
      let attributionColor = action.value;
      return assign({}, state, {
        attribution: assign({}, state.attribution, { attributionColor })
      });
    case ATTRIBUTION_LOCATION_CHANGE:
      let attributionLocation = action.value;
      if (CORNER_OPTIONS.indexOf(attributionLocation) < 0) {
        return assign({}, state, {
          attribution: assign({}, state.attribution, { attributionLocation })
        })
      }
  }
  return state;
}
