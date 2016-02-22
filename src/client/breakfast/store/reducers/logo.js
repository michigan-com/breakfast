'use strict';

import assign from 'object-assign';

import { LOGO_CHANGE, LOGO_COLOR_CHANGE, LOGO_LOCATION_CHANGE,
  LOGO_LOADING, LOGOS_LOADED, DEFAULT_LOGO, DEFAULT_LOGO_STATE,
  LOGO_ASPECT_RATIO_FOUND } from '../../actions/logo';

export default function logoReducer(state=DEFAULT_LOGO_STATE, action) {
  let logoIndex, aspectRatio, logoOptions, logo;
  switch (action.type) {
    case LOGO_COLOR_CHANGE:
      let logoColor = action.value.logoColor;
      let logo = action.value.logo;
      return assign({}, state, { logo, logoColor });
    case LOGO_LOCATION_CHANGE:
      let logoLocation = action.value;
      return assign({}, state, { logoLocation });
    case LOGO_CHANGE:
      logo = action.value.logo;
      logoIndex = action.value.logoIndex;
      return assign({}, state, { logo, logoIndex });
    case LOGO_ASPECT_RATIO_FOUND:
      logoIndex = action.value.logoIndex;
      aspectRatio = action.value.logoAspectRatio
      if (logoIndex < 0 || logoIndex >= state.logoOptions.length) return state;

      logoOptions = assign({}, state).logoOptions;
      logoOptions[logoIndex].aspectRatio = aspectRatio;
      return assign({}, state, { logoOptions });

    case LOGOS_LOADED:
      logoOptions = [];
      let logoOptions = action.value.logos;
      logo = action.value.logo;
      let logoIndex = null;

      if (logoOptions.length) logoIndex = 0;
      return assign({}, state, { logo, logoIndex, logoOptions })
  }

  return state;
}
