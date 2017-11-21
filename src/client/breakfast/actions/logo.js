'use strict';

import xr from 'xr';
import { CORNER_OPTIONS } from './corner';

export const LOGO_CHANGE = 'LOGO_CHANGE';
export const LOGO_COLOR_CHANGE = 'LOGO_COLOR_CHANGE';
export const LOGO_LOCATION_CHANGE = 'LOGO_LOCATION_CHANGE';
export const LOGO_LOADING = 'LOGO_LOADING';
export const LOGOS_LOADED = 'LOGOS_LOADED';
export const LOGO_ASPECT_RATIO_FOUND = 'LOGO_ASPECT_RATIO_FOUND';

export const DARK_LOGO_COLOR = '#404040';

export const DEFAULT_LOGO = {
  name: '',
  aspectRatio: null, // Get aspect ratio downstream
  noColor: true,
  filename: '',
  imgObj: null,
  favorite: false,
  marketName: '',
  domains: '',
};

/**
 * Given a logo from store.Logo.logoOptions, load the Image object and return it
 *
 * @param {Object} imgObj - see DEFAULT_LOGO for attributes
 * @param {String} color - color of the logo we want
 */
function loadLogoImage(logoObj, logoColor = DARK_LOGO_COLOR) {
  return new Promise((resolve) => {
    const imgObj = new Image();
    imgObj.onload = () => {
      resolve(imgObj);
    };

    let logoUrl = `${window.location.origin}/logos/${logoObj.filename}`;
    const goodLogoCheck = /\.svg$/;
    if (goodLogoCheck.test(logoObj.filename) && !logoObj.noColor) {
      const color = logoColor.replace('#', '');
      logoUrl += `?color=${color}`;
    }
    imgObj.src = logoUrl;
  });
}

async function formatLogos(logoInfo = {}, loadFirstImage = true) {
  const logos = [];
  Object.keys(logoInfo).forEach((filename) => {
    const logo = logoInfo[filename];
    logos.push({ ...DEFAULT_LOGO,
      favorite: logo.favorite ? true : false,
      marketName: logo.marketName,
      name: logo.name,
      domains: logo.domain.join(','),
      aspectRatio: logo.aspectRatio || null, // Get aspect ratio downstream
      noColor: logo.isSvg ? logo.noColor : true,
      filename,
    });
  });

  // Sort alphabetically, except put AP last
  logos.sort((a, b) => {
    if (a.favorite && b.favorite) return a.name - b.name;
    else if (a.favorite) return -1;
    else if (b.favorite) return 1;
    return a.name - b.name;
  });

  if (!logos.length) {
    return {
      type: LOGOS_LOADED,
      value: {
        logos,
        logo: { ...DEFAULT_LOGO },
      },
    };
  }

  const action = {
    type: LOGOS_LOADED,
    value: {
      logos,
    },
  };

  if (loadFirstImage) {
    const imgObj = await loadLogoImage(logos[0]);
    action.value.logo = { ...logos[0], imgObj };
  }

  return action;
}

/**
 * New logo to assign. Load the Image object for this logo
 *
 * @param {Object} logo, see DEFAULT_LOGO for props
 *
 */
export function logoChange(logo, logoIndex, logoColor = DARK_LOGO_COLOR) {
  return async (dispatch) => {
    const imgObj = await loadLogoImage(logo, logoColor);
    return dispatch({
      type: LOGO_CHANGE,
      value: {
        logo: { ...logo, imgObj },
        logoIndex,
      },
    });
  };
}

export function logoColorChange(logo, logoColor) {
  return async (dispatch) => {
    const imgObj = await loadLogoImage(logo, logoColor);
    return dispatch({
      type: LOGO_COLOR_CHANGE,
      value: {
        logoColor,
        logo: { ...logo, imgObj },
      },
    });
  };
}

export function logoLocationChange(location) {
  return {
    type: LOGO_LOCATION_CHANGE,
    value: location,
  };
}

export function logosLoaded(logoInfo = {}, loadFirstImage = true) {
  // No logos? Load the defaults

  // Load the first logo image for drawing
  return async (dispatch) => {
    const action = await formatLogos(logoInfo, loadFirstImage);
    dispatch(action);
  };
}

export function toggleLogoFavorite(logo, add = true) {
  return dispatch => {
    const url = `/logo/favorite/${add ? 'add' : 'remove'}/`;
    const params = { logo };

    xr.get(url, params)
      .then(async (resp) => {
        const action = await formatLogos(resp, false);
        dispatch(action);
      });
  };
}

export function logoAspectRatioFound(logoIndex, logoAspectRatio) {
  return {
    type: LOGO_ASPECT_RATIO_FOUND,
    value: { logoIndex, logoAspectRatio },
  };
}

export const DEFAULT_LOGO_STATE = {
  logo: DEFAULT_LOGO,
  logoColor: DARK_LOGO_COLOR,
  logoIndex: null,
  logoOptions: [],
  logoLocation: CORNER_OPTIONS[CORNER_OPTIONS.length - 1],
};
