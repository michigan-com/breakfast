'use strict';

import { FONTS_LOADED, DEFAULT_FONT } from '../../actions/font';

export default function fontReducer(state = DEFAULT_FONT, action) {
  let { fontOptions } = state;
  switch (action.type) {
    case FONTS_LOADED:
      fontOptions = action.value;
      return { ...state, fontOptions };
    default:
      return { ...state };
  }
}
