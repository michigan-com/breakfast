'use strict';

import 'assign' from 'object-assign';

import { BACKGROUND_COLOR_CHANGE, BACKGROUND_IMAGE_CHANGE, BACKGROUND_IMAGE_LOADING,
  REMOVE_BACKGROUND_IMAGE, BACKGROUND_TYPE_CHANGE, DEFAULT_BACKGROUND_IMAGE,
  BACKGROUND_TYPES, BACKGROUND_COLOR, BACKGROUND_IMAGE, BACKGROUND_LOADING } from '../../actions/background';


export default backgroundReducer(state, action) {
  switch (action.type) {
    case BACKGROUND_COLOR_CHANGE:
      let color = action.value;
      let backgroundType = BACKGROUND_COLOR;
      return assign({}, state, { color, backgroundType });
    case BACKGROUND_IMAGE_CHANGE:
      let backgroundImg = action.value;
      let backgroundType = BACKGROUND_IMAGE;
      return assign({}, state, { backgroundImg, backgroundType });
    case BACKGROUND_IMAGE_UPLOAD:
    case BACKGROUND_IMAGE_LOADING:
      let backgroundType = BACKGROUND_
      return assign({}, state, { backgroundType });
    case REMOVE_BACKGROUND_IMAGE:
      let backgroundImg = DEFAULT_BACKGROUND_IMAGE;
      return assign({}, state, { backgroundImg });
    case BACKGROUND_TYPE_CHANGE:
      if (BACKGROUND_TYPES.indexOf(action.value) >= 0) {
        let backgroundType = action.value;
        return assign({}, state, { backgroundType });
      }
    case default:
      return state;
  }
}

