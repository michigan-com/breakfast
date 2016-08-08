'use strict';

export const ASPECT_RATIO_CHANGE = 'ASPECT_RATIO_CHANGE';
export const BACKGROUND_COLOR_CHANGE = 'BACKGROUND_COLOR_CHANGE';
export const BACKGROUND_IMAGE_UPLOAD = 'BACKGROUND_IMAGE_UPLOAD';
export const REMOVE_BACKGROUND_IMAGE = 'REMOVE_BACKGROUND_IMAGE';
export const BACKGROUND_TYPE_CHANGE = 'BACKGROUND_TYPE_CHANGE';
export const BACKGROUND_IMAGE_CHANGE = 'BACKGROUND_IMAGE_CHANGE';
export const BACKGROUND_IMAGE_LOADING = 'BACKGROUND_IMAGE_LOADING';
export const BACKGROUND_DRAW_LOCATION_CHANGE = 'BACKGROUND_DRAW_LOCATION_CHANGE';
export const WINDOW_RESIZE = 'WINDOW_RESIZE';
export const UPDATE_BACKGROUND_ZOOM = 'UPDATE_BACKGROUND_ZOOM';

export const BACKGROUND_COLOR = 'color';
export const BACKGROUND_IMAGE = 'image';
export const BACKGROUND_LOADING = 'loading';
export const DEFAULT_BACKGROUND_IMAGE = {
  img: null,
  height: 0,
  width: 0,
};
export const DEFAULT_BACKGROUND_OFFSET = {
  dx: 0,
  dy: 0,
};

export const SIXTEEN_NINE = '16x9';
export const SQUARE = 'square';
export const TWO_ONE = '2:1';
export const FACEBOOK_COVER = 'cover';
export const FIT_IMAGE = 'fit';

export const BACKGROUND_TYPES = [BACKGROUND_COLOR, BACKGROUND_IMAGE, BACKGROUND_LOADING];

export function getAspectRatioValue(backgroundState = {}, ratio) {
  switch (ratio) {
    case SIXTEEN_NINE:
      // return 9/16;
      return 16 / 9;
    case TWO_ONE:
      // return 1/2;
      return 2 / 1;
    case FACEBOOK_COVER:
      // return 0.370153;
      return 1 / 0.370153;
    case FIT_IMAGE: {
      // Only deal with this aspect ratio if we've loaded an image up
      const backgroundImg = backgroundState.backgroundImg;
      if (backgroundImg && backgroundImg.img != null) {
        return backgroundImg.width / backgroundImg.height;
      }
      break;
    }
    default:
      return 1;
  }
  return 1;
}

export const ASPECT_RATIOS = [{
  name: TWO_ONE,
  value: getAspectRatioValue({}, TWO_ONE),
}, {
  name: SQUARE,
  value: getAspectRatioValue({}, SQUARE),
}, {
  name: SIXTEEN_NINE,
  value: getAspectRatioValue({}, SIXTEEN_NINE),
}, {
  name: FACEBOOK_COVER,
  value: getAspectRatioValue({}, FACEBOOK_COVER),
}, {
  name: FIT_IMAGE,
  value: getAspectRatioValue({}, FIT_IMAGE),
}];


export const getDefaultAspectRatioValue = () => {
  const defaultAspectRatio = ASPECT_RATIOS[0];
  return getAspectRatioValue({}, defaultAspectRatio);
};

export function backgroundColorChange(color) {
  return {
    type: BACKGROUND_COLOR_CHANGE,
    value: color,
  };
}

function backgroundImageChange(backgroundImage = DEFAULT_BACKGROUND_IMAGE) {
  return {
    type: BACKGROUND_IMAGE_CHANGE,
    value: backgroundImage,
  };
}

function backgroundImageLoading() {
  return {
    type: BACKGROUND_IMAGE_LOADING,
  };
}

// TODO remove attribution
export function removeBackgroundImage() {
  return {
    type: REMOVE_BACKGROUND_IMAGE,
  };
}

/**
 * New dx/dy values to draw image at
 */
export function updateDrawLocation(dx, dy) {
  return {
    type: BACKGROUND_DRAW_LOCATION_CHANGE,
    value: { dx, dy },
  };
}

/**
 * Read a file using FileReader, and pass it along to the dispatcher
 *
 * @param {Object} file - File object from an <input type='file'
 */
export function backgroundImageUpload(file) {
  return dispatch => {
    dispatch(backgroundImageLoading());

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.addEventListener('load', () => {
        dispatch(backgroundImageChange({
          img,
          width: img.width,
          height: img.height,
        }));
      });

      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
}

export function aspectRatioChange(ratio) {
  return {
    type: ASPECT_RATIO_CHANGE,
    value: ratio,
  };
}

export function windowResize() {
  return { type: WINDOW_RESIZE };
}

export function updateBackgroundZoom(zoom) {
  return {
    type: UPDATE_BACKGROUND_ZOOM,
    value: zoom,
  };
}

export const DEFAULT_STATE = {
  backgroundColor: '#fff',
  backgroundImg: { ...DEFAULT_BACKGROUND_IMAGE },
  aspectRatioIndex: 0,
  aspectRatioOptions: ASPECT_RATIOS,
  backgroundOffset: { ...DEFAULT_BACKGROUND_OFFSET },
  backgroundZoom: 0,
};
