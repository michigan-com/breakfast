'use strict';

import { LOGO_CHANGE, LOGO_COLOR_CHANGE, LOGO_LOCATION_CHANGE,
  LOGOS_LOADED, DEFAULT_LOGO_STATE, LOGO_ASPECT_RATIO_FOUND } from '../../actions/logo';

export default function logoReducer(state = DEFAULT_LOGO_STATE, action) {
  let { logoColor, logo, logoIndex, aspectRatio, logoOptions, logoLocation } = state;
  switch (action.type) {
    case LOGO_COLOR_CHANGE:
      logoColor = action.value.logoColor;
      logo = action.value.logo;
      return { ...state, logo, logoColor };
    case LOGO_LOCATION_CHANGE:
      logoLocation = action.value;
      return { ...state, logoLocation };
    case LOGO_CHANGE:
      logo = action.value.logo;
      logoIndex = action.value.logoIndex;
      return { ...state, logo, logoIndex };
    case LOGO_ASPECT_RATIO_FOUND:
      logoIndex = action.value.logoIndex;
      aspectRatio = action.value.logoAspectRatio;
      if (logoIndex < 0 || logoIndex >= state.logoOptions.length) return state;

      logoOptions = { ...state }.logoOptions;
      logoOptions[logoIndex].aspectRatio = aspectRatio;
      return { ...state, logoOptions };

    case LOGOS_LOADED:
      logoOptions = [];
      logoOptions = action.value.logos;
      logo = action.value.logo;
      logoIndex = null;

      if (logoOptions.length) logoIndex = 0;
      return { ...state, logo, logoIndex, logoOptions };
    default:
      return { ...state };
  }
}
