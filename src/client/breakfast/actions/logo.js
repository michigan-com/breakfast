'use strict';

import assign from 'object-assign';

import { CORNER_OPTIONS } from './corner';

export const LOGO_CHANGE = 'LOGO_CHANGE';
export const LOGO_COLOR_CHANGE = 'LOGO_COLOR_CHANGE';
export const LOGO_LOCATION_CHANGE = 'LOGO_LOCATION_CHANGE';
export const LOGO_LOADING = 'LOGO_LOADING';
export const LOGOS_LOADED = 'LOGOS_LOADED';
export const LOGO_ASPECT_RATIO_FOUND = 'LOGO_ASPECT_RATIO_FOUND';

export const DEFAULT_LOGO = {
  name: '',
  aspectRatio: null, // Get aspect ratio downstream
  noColor: true,
  filename: ''
}

export function logoChange(logoIndex) {
  return {
    type: LOGO_CHANGE,
    value: logoIndex
  }
}

export function logoColorChange(color) {
  return {
    type: LOGO_CHANGE,
    value: color
  }
}

export function logoLocationChange(location) {
  return {
    type: LOGO_LOCATION_CHANGE,
    value: location
  }
}

export function logosLoaded(logos) {
  return {
    type: LOGOS_LOADED,
    value: logos
  }
}

export function logoAspectRatioFound(logoIndex, logoAspectRatio) {
  return {
    type: LOGO_ASPECT_RATIO_FOUND,
    value: { logoIndex, logoAspectRatio }
  }
}

export const DEFAULT_LOGO_STATE = {
  logo: DEFAULT_LOGO,
  logoIndex: null,
  logoOptions: [],
  logoColor: '#000',
  logoLocation: CORNER_OPTIONS[CORNER_OPTIONS.length - 1]
}