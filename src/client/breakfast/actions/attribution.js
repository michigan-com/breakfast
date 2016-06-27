'use strict';

import { BOTTOM_RIGHT } from './corner';

export const ATTRIBUTION_CHANGE = 'ATTRIBUTION_CHANGE';
export const ATTRIBUTION_COLOR_CHANGE = 'ATTRIBUTION_COLOR_CHANGE';
export const ATTRIBUTION_LOCATION_CHANGE = 'ATTRIBUTION_LOCATION_CHANGE';
export const DEFAULT_ATTRIBUTION = {
  attribution: '',
  attributionColor: 'black',
  attributionLocation: BOTTOM_RIGHT,
};

export function attributionChange(attribution = '') {
  return {
    type: ATTRIBUTION_CHANGE,
    value: attribution,
  };
}

export function attributionColorChange(color = 'black') {
  return {
    type: ATTRIBUTION_COLOR_CHANGE,
    value: color,
  };
}

export function attributionLocationChange(location = BOTTOM_RIGHT) {
  return {
    type: ATTRIBUTION_LOCATION_CHANGE,
    value: location,
  };
}
