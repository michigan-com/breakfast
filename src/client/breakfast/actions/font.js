'use strict';

export const FONT_SIZE_CHANGE = 'FONT_SIZE_CHANGE';
export const FONT_COLOR_CHANGE = 'FONT_COLOR_CHANGE';
export const FONT_FACE_CHANGE = 'FONT_FACE_CHANGE';
export const FONTS_LOADED = 'FONTS_LOADED';

export function fontsLoaded(fonts) {
  return {
    type: FONTS_LOADED,
    value: fonts,
  };
}

export function fontSizeChange(size) {
  return {
    type: FONT_SIZE_CHANGE,
    value: size,
  };
}

export function fontColorChange(color) {
  return {
    type: FONT_COLOR_CHANGE,
    value: color,
  };
}

export function fontFaceChange(face) {
  return {
    type: FONT_FACE_CHANGE,
    value: face,
  };
}

export const DEFAULT_FONT = {
  fontSizeMultiplier: 1,
  fontColor: 'black',
  fontFace: 'Helvetica',
  fontOptions: [],
  // styleMetrics: getStyleMetrics(),
};
