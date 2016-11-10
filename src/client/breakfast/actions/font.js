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
export const DEFAULT_FONT = {
  fontOptions: [],
};
