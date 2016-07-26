'use strict';

export const BACKGROUND_COLOR_CHANGE = 'BACKGROUND_COLOR_CHANGE';
export const BACKGROUND_IMAGE_UPLOAD = 'BACKGROUND_IMAGE_UPLOAD';
export const REMOVE_BACKGROUND_IMAGE = 'REMOVE_BACKGROUND_IMAGE';
export const BACKGROUND_TYPE_CHANGE = 'BACKGROUND_TYPE_CHANGE';
export const BACKGROUND_IMAGE_CHANGE = 'BACKGROUND_IMAGE_CHANGE';
export const BACKGROUND_IMAGE_LOADING = 'BACKGROUND_IMAGE_LOADING';
export const BACKGROUND_DRAW_LOCATION_CHANGE = 'BACKGROUND_DRAW_LOCATION_CHANGE';

export const BACKGROUND_COLOR = 'color';
export const BACKGROUND_IMAGE = 'image';
export const BACKGROUND_LOADING = 'loading';
export const DEFAULT_BACKGROUND_IMAGE = {
  img: null,
  height: 0,
  width: 0,
};

export const BACKGROUND_TYPES = [BACKGROUND_COLOR, BACKGROUND_IMAGE, BACKGROUND_LOADING];

export function backgroundColorChange(color) {
  return {
    type: BACKGROUND_COLOR_CHANGE,
    value: color,
  };
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
  const imgAspectRatio = img.width / img.height;
  const canvasAspectRatio = canvas.aspectRatio;

  // the canvas is twice as big as it looks on the screen
  const canvasHeight = canvas.canvasHeight;
  const canvasWidth = canvas.canvasWidth;

  const maxDx = canvasWidth;
  const maxDy = canvasHeight;
  const dx = 0;
  const dy = 0;
  let dWidth;
  let dHeight;
  let minDx;
  let minDy;


  // Image is wider than the canvas, so fix the height
  if (imgAspectRatio > canvasAspectRatio) {
    dHeight = canvasHeight;
    dWidth = canvasHeight * imgAspectRatio;
    minDx = dWidth * -1;
    minDy = canvasHeight * -1;
  } else { // Image is skinnier than the canvas, so fix the width
    dWidth = canvasWidth;
    dHeight = canvasWidth / imgAspectRatio;
    minDy = dHeight * -1;
    minDx = canvasWidth * -1;
  }

  return { dx, dy, dWidth, dHeight, maxDx, maxDy, minDx, minDy };
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

export const DEFAULT_BACKGROUND = {
  backgroundColor: '#fff',
  backgroundImg: { ...DEFAULT_BACKGROUND_IMAGE },
  drawImageMetrics: null,
};
