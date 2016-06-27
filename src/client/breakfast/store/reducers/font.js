'use strict';

import { FONT_SIZE_CHANGE, FONT_COLOR_CHANGE, FONT_FACE_CHANGE,
  FONTS_LOADED, generateStyleMetrics, DEFAULT_FONT } from '../../actions/font';

export default function fontReducer(state = DEFAULT_FONT, action) {
  let { fontSizeMultiplier, styleMetrics, fontColor, fontFace, fontOptions } = state;
  switch (action.type) {
    case FONT_SIZE_CHANGE:
      fontSizeMultiplier = action.value / 11;
      styleMetrics = generateStyleMetrics(fontSizeMultiplier);
      return { ...state, fontSizeMultiplier, styleMetrics };
    case FONT_COLOR_CHANGE:
      fontColor = action.value;
      return { ...state, fontColor };
    case FONT_FACE_CHANGE:
      fontFace = action.value;
      return { ...state, fontFace };
    case FONTS_LOADED:
      fontOptions = action.value;
      return { ...state, fontOptions };
    default:
      return { ...state };
  }
}
