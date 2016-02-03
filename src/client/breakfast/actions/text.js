'use strict';

import assign from 'object-assign';

export const TEXT_WIDTH_CHANGE = 'TEXT_WIDTH_CHANGE';
export const TEXT_POS_CHANGE = 'TEXT_POS_CHANGE';

export function textWidthChange(width) {
  return {
    type: TEXT_WIDTH_CHANGE,
    value: width
  }
}

export function textPosChange(pos) {
  return {
    type: TEXT_POS_CHANGE,
    value: assign({}, pos)
  }
}

export const DEFAULT_TEXT = {
  textPos: {
    left: 0,
    top: 0
  },
  textWidth: 100
}