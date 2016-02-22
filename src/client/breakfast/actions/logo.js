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
  filename: '',
  imgObj: null
}

/**
 * Given a logo from store.Logo.logoOptions, load the Image object and return it
 *
 * @param {Object} imgObj - see DEFAULT_LOGO for attributes
 * @param {String} color - color of the logo we want
 */
function loadLogoImage(logoObj, logoColor='#000') {
  return new Promise((resolve, reject) => {
    let imgObj = new Image();
    imgObj.onload = () => {
      resolve(imgObj);
    }

    let logoUrl = `${window.location.origin}/logos/${logoObj.filename}`;
    let goodLogoCheck = /\.svg$/;
    if (goodLogoCheck.test(logoObj.filename) && !logoObj.noColor) {
      let color = logoColor.replace('#', '');
      logoUrl += `?color=${color}`;
    }
    imgObj.src = logoUrl;
  });
}

/**
 * New logo to assign. Load the Image object for this logo
 *
 * @param {Object} logo, see DEFAULT_LOGO for props
 *
 */
export function logoChange(logo, logoIndex, logoColor='#000') {
  return async (dispatch) => {
    let imgObj = await loadLogoImage(logo, logoColor);
    return dispatch({
      type: LOGO_CHANGE,
      value: {
        logo: assign({}, logo, { imgObj }),
        logoIndex
      }
    });
  }
}

export function logoColorChange(logo, logoColor) {
  return async (dispatch) => {
    let imgObj = await loadLogoImage(logo, logoColor);
    return dispatch({
      type: LOGO_COLOR_CHANGE,
      value: {
        logoColor,
        logo: assign({}, logo, { imgObj })
      }
    })
  }
}

export function logoLocationChange(location) {
  return {
    type: LOGO_LOCATION_CHANGE,
    value: location
  }
}

export function logosLoaded(logoInfo=[]) {
  // No logos? Load the defaults

  // Load the first logo image for drawing
  return async (dispatch) => {

    let logos = [];
    for (let filename in logoInfo) {
      let logo = logoInfo[filename];
      logos.push(assign({}, DEFAULT_LOGO, {
        name: logo.name,
        aspectRatio: logo.aspectRatio || null, // Get aspect ratio downstream
        noColor: logo.isSvg ? logo.noColor : true,
        filename
      }));
    }

    // Sort alphabetically, except put AP last
    logos.sort((a, b) => {
      if (a.name === 'AP.png' || a.name > b.name) return 1;
      else if (b.name === 'AP.png' || a.name < b.name) return -1;
      return 0;
    });

    if (!logos.length) {
      return dispatch({
        type: LOGOS_LOADED,
        value: {
          logos,
          logo: assign({}, DEFAULT_LOGO)
        }
      })
    }

    let imgObj = await loadLogoImage(logos[0]);
    return dispatch({
      type: LOGOS_LOADED,
      value: {
        logos,
        logo: assign({}, logos[0], { imgObj })
      }
    })
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
  logoColor: '#000',
  logoIndex: null,
  logoOptions: [],
  logoLocation: CORNER_OPTIONS[CORNER_OPTIONS.length - 1]
}
