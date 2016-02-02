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

export function textPoschange(pos) {
  return {
    type: TEXT_POS_CHANGE,
    value: assign({}, pos)
  }
}
