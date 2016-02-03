'use strict';

import { FONT_SIZE_CHANGE, FONT_COLOR_CHANGE, FONT_FACE_CHANGE,
  FONTS_LOADED, generateStyleMetrics, DEFAULT_FONT } from '../../actions/font';
import assign from 'object-assign';

export default function fontReducer(state=DEFAULT_FONT, action) {
  switch (action.type) {
    case FONT_SIZE_CHANGE:
      let fontSizeMultiplier = action.value / 11;
      let styleMetrics = generateStyleMetrics(fontSizeMultiplier);
      return assign({}, state, { fontSizeMultiplier, styleMetrics });
    case FONT_COLOR_CHANGE:
      let fontColor = action.value;
      return assign({}, state, { fontColor });
    case FONT_FACE_CHANGE:
      let fontFace = action.value;
      return assign({}, state, { fontFace });
    case FONTS_LOADED:
      let fontOptions = action.value;
      return assign({}, state, { fontOptions });
  }
  return state
}
