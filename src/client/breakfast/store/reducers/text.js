'use strict';

import { TEXT_WIDTH_CHANGE, TEXT_POS_CHANGE, DEFAULT_TEXT } from '../../actions/text';

export default function textReducer(state = DEFAULT_TEXT, action) {
  let { textWidth, textPos } = state;
  switch (action.type) {
    case TEXT_WIDTH_CHANGE:
      textWidth = action.value;
      if (!(textWidth >= 0 && textWidth <= 100)) return state;
      return { ...state, textWidth };
    case TEXT_POS_CHANGE:
      textPos = action.value;
      return { ...state, textPos };
    default:
      return { ...state };
  }
}
