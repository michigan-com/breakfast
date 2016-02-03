'use strict';

import assign from 'object-assign';

import { TEXT_WIDTH_CHANGE, TEXT_POS_CHANGE, DEFAULT_TEXT } from '../../actions/text';
import { DEFAULT_ASPECT_RATIO } from '../../actions/aspect-ratio';

export default function textReducer(state=assign({}, DEFAULT_TEXT, DEFAULT_ASPECT_RATIO), action) {
  switch (action.type) {
    case TEXT_WIDTH_CHANGE:
      let textWidth = action.value;
      if (!(textWidth >= 0 && textWidth <= 100)) return state;
      return assign({}, state, { textWidth });
    case TEXT_POS_CHANGE:
      let textPos = action.value;
      return assign({}, state, { textPos });
  }
  return state;
}
