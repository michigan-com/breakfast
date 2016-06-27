'use strict';

export const FONT_SIZE_CHANGE = 'FONT_SIZE_CHANGE';
export const FONT_COLOR_CHANGE = 'FONT_COLOR_CHANGE';
export const FONT_FACE_CHANGE = 'FONT_FACE_CHANGE';
export const FONTS_LOADED = 'FONTS_LOADED';

// Based on the font size multiplier, change the font size
export function generateStyleMetrics(fontMultiplier = 1) {
  function generateStyle(initFontSize) {
    const fontSize = initFontSize * fontMultiplier;
    const lineHeight = fontSize * 1.05;
    const marginBottom = fontSize * 0.65;
    return { fontSize, lineHeight, marginBottom };
  }

  // Scale up
  const pFontSize = 17 * 2;
  const h1FontSize = 32 * 2;
  const h2FontSize = 24 * 2;

  return {
    p: generateStyle(pFontSize),
    h1: generateStyle(h1FontSize),
    h2: generateStyle(h2FontSize),
    li: generateStyle(pFontSize),
    span: generateStyle(pFontSize),
  };
}

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
  styleMetrics: generateStyleMetrics(),
};
