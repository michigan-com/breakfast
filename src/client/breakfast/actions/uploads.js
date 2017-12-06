'use strict';

import { canvasMetricsSelector } from '../selectors/background';

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
export const UPDATE_IMAGE = 'UPDATE_IMAGE';
export const REMOVE_IMAGE = 'REMOVE_IMAGE';
export const ACTIVATE_IMAGE = 'ACTIVATE_IMAGE';

const UPLOAD = {
  img: {},
  dx: 0,
  dy: 0,
  height: 0,
  width: 0,

  layerIndex: 0,
};

export function updateImage(imageIndex = -1, updateValues = {}) {
  return (dispatch, getState) => {
    const { Uploads } = getState();
    const { images } = Uploads;
    if (imageIndex < 0 || imageIndex >= images.length) return;

    const image = { ...images[imageIndex], ...updateValues };
    dispatch({
      type: UPDATE_IMAGE,
      value: {
        image,
        imageIndex,
      },
    });
  };
}

export function removeImage(imageIndex = -1) {
  return {
    type: REMOVE_IMAGE,
    value: imageIndex,
  };
}

export function activateImage(imageIndex = -1) {
  return {
    type: ACTIVATE_IMAGE,
    value: imageIndex,
  };
}

/**
 * After reading an image file, add it to the `images` array.
 *
 * @param img {Object} - `Image` object, e.g. `img = new Image()`. Will read width and height for aspect ratio
 */
export function uploadImage(img) {
  return (dispatch, getState) => {
    const aspectRatio = img.width / img.height;
    const height = aspectRatio > 1 ? 0.2 : 0.4;
    const width = aspectRatio * height;

    const value = { ...UPLOAD, img, height, width };
    dispatch({
      type: UPLOAD_IMAGE,
      value,
    });
  };
}

export const DEFAULT_STATE = {
  images: [],
  activeImageIndex: -1,
};
