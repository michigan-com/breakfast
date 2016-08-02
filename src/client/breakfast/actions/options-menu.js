'use strict';

const OPTION_CHOICES = [
  'aspect-ratio',
  'background',
  'logo',
];

export const OPTION_SELECT = 'OPTION_SELECT';
export const OPTION_DESELECT = 'OPTION_DESELECT';

export function optionSelect(index = 0) {
  return {
    type: OPTION_SELECT,
    value: index,
  };
}

export function optionDeselect() {
  return { type: OPTION_DESELECT };
}

export const DEFAULT_STATE = {
  options: OPTION_CHOICES,
  selectedIndex: -1,
};
