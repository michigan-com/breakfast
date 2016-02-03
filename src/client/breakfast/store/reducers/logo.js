'use strict';

import assign from 'object-assign';

import { LOGO_CHANGE, LOGO_COLOR_CHANGE, LOGO_LOCATION_CHANGE,
  LOGO_LOADING, LOGOS_LOADED, DEFAULT_LOGO, DEFAULT_LOGO_STATE,
  LOGO_ASPECT_RATIO_FOUND } from '../../actions/logo';

export default function logoReducer(state=DEFAULT_LOGO_STATE, action) {
  let logoIndex, aspectRatio, logoOptions;
  switch (action.type) {
    case LOGO_COLOR_CHANGE:
      let color = action.value;
      return assign({}, state, { color });
    case LOGO_LOCATION_CHANGE:
      let location = action.value;
      return assign({}, state, { location });
    case LOGO_CHANGE:
      logoIndex = action.value;
      if (logoIndex < 0 || logoIndex >= state.logoOptions.length) return state;
      return assign({}, state, { logoIndex });
    case LOGO_ASPECT_RATIO_FOUND:
      logoIndex = action.value.logoIndex;
      aspectRatio = action.value.logoAspectRatio
      if (logoIndex < 0 || logoIndex >= state.logoOptions.length) return state;

      logoOptions = assign({}, state).logoOptions;
      logoOptions[logoIndex].aspectRatio = aspectRatio;
      return assign({}, state, { logoOptions });

    case LOGOS_LOADED:
      logoOptions = [];
      let logoInfo = action.value;
      for (let filename in logoInfo) {
        let logo = logoInfo[filename];
        logoOptions.push(assign({}, DEFAULT_LOGO, {
          name: logo.name,
          aspectRatio: logo.aspectRatio || null, // Get aspect ratio downstream
          noColor: logo.isSvg ? logo.noColor : true,
          filename
        }));
      }

      // Sort alphabetically, except put AP last
      logoOptions.sort((a, b) => {
        if (a.name === 'AP.png' || a.name > b.name) return 1;
        else if (b.name === 'AP.png' || a.name < b.name) return -1;

        return 0;
      });

      let logoIndex = null;
      if (logoOptions.length) logoIndex = 0;

      return assign({}, state, { logoIndex, logoOptions })
  }

  return state;
}