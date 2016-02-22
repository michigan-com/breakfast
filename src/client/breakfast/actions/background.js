'use strict';

import assign from 'object-assign';

export const BACKGROUND_COLOR_CHANGE = 'BACKGROUND_COLOR_CHANGE';
export const BACKGROUND_IMAGE_UPLOAD = 'BACKGROUND_IMAGE_UPLOAD';
export const REMOVE_BACKGROUND_IMAGE = 'REMOVE_BACKGROUND_IMAGE';
export const BACKGROUND_TYPE_CHANGE = 'BACKGROUND_TYPE_CHANGE';
export const BACKGROUND_IMAGE_CHANGE = 'BACKGROUND_IMAGE_CHANGE';
export const BACKGROUND_IMAGE_LOADING = 'BACKGROUND_IMAGE_LOADING';

export const BACKGROUND_COLOR = 'color';
export const BACKGROUND_IMAGE = 'image';
export const BACKGROUND_LOADING = 'loading';
export const DEFAULT_BACKGROUND_IMAGE = {
  src: '',
  height: 0,
  width: 0
}

export const BACKGROUND_TYPES = [ BACKGROUND_COLOR, BACKGROUND_IMAGE, BACKGROUND_LOADING];

export function backgroundColorChange(color) {
  return {
    type: BACKGROUND_COLOR_CHANGE,
    value: color
  }
}

/**
 * Given the current aspect ratio of the canvas, and a background image, calculate
 * metrics that will be used in the context.drawImage() api
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
 *
 * @param {Object} canvas - current canvas state from reducer/background.js
 * @param {Object} img - HTML Image object, uploaded by user
 *
 * @return {Object} Contains sx, sy, sWidth, and sHeight for the drawImage canvas api
 */
export function getDrawImageMetrics(canvas, img) {
  let imgAspectRatio = img.width / img.height;
  let canvasAspectRatio = canvas.aspectRatio;

  // the canvas is twice as big as it looks on the screen
  let canvasHeight = canvas.canvasHeight * 2;
  let canvasWidth = canvas.canvasWidth * 2;

  let dx, dy, dWidth, dHeight;

  // The image is wider than the canvas, so fix the height
  if (imgAspectRatio > canvasAspectRatio) {

    // Center the canvas on the image
    let remainingWidth = canvasWidth - (canvasWidth * canvasAspectRatio / imgAspectRatio);
    dx = remainingWidth / -2;
    dy = 0;
    dHeight = canvasHeight;
    //dWidth = canvasHeight * imgAspectRatio;
    dWidth = canvasWidth;
  }

  // The image is taller than the canvas, so fix the width
  else {

    // Center the canvas on the image
    let remainingHeight = canvasHeight - (canvasHeight * imgAspectRatio / canvasAspectRatio);
    dy = remainingHeight / -2;
    dx = 0;
    //dHeight = canvasWidth / imgAspectRatio;
    dHeight = canvasHeight;
    dWidth = canvasWidth;
  }

  dy = 0, dx = 0;
  return { dx, dy, dWidth, dHeight };
}

/**
 * Read a file using FileReader, and pass it along to the dispatcher
 *
 * @param {Object} file - File object from an <input type='file'
 */
export function backgroundImageUpload(file) {
  return dispatch => {
    dispatch(backgroundImageLoading());

    let reader = new FileReader();
    reader.onload = e => {
      var img = new Image();
      img.onload = () => {
        dispatch(backgroundImageChange({
          img,
          width: img.width,
          height: img.height
        }));
      }

      img.src = reader.result;

    }
    reader.readAsDataURL(file);
  }
}

function backgroundImageChange(backgroundImage=DEFAULT_BACKGROUND_IMAGE) {
  return {
    type: BACKGROUND_IMAGE_CHANGE,
    value: backgroundImage
  }
}

function backgroundImageLoading() {
  return {
    type: BACKGROUND_IMAGE_LOADING
  }
}

export function removeBackgroundImage() {
  return {
    type: REMOVE_BACKGROUND_IMAGE
  }
}

export function backgroundTypeChange(backgroundType) {
  return {
    type: BACKGROUND_TYPE_CHANGE,
    value: backgroundType
  }
}

export const DEFAULT_BACKGROUND = {
  backgroundType: BACKGROUND_COLOR,
  backgroundColor: '#fff',
  backgroundImg: assign({}, DEFAULT_BACKGROUND_IMAGE),
  drawImageMetrics: null,

}
