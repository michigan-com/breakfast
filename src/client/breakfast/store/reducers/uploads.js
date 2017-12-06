'use strict';

import { DEFAULT_STATE, UPLOAD_IMAGE, UPDATE_IMAGE, REMOVE_IMAGE, ACTIVATE_IMAGE } from '../../actions/uploads';

export default function uploads(state = DEFAULT_STATE, action) {
  var { images, activeImageIndex } = { ...state };
  switch (action.type) {
    case UPLOAD_IMAGE:
      const img = action.value;
      images.push(img);
      return { ...state, images };
    case UPDATE_IMAGE:
      const { imageIndex, image } = action.value;
      images[imageIndex] = image;
      return { ...state, images };
    case REMOVE_IMAGE:
      const newImages = [];
      for (var i = 0; i < images.length; i++) {
        if (i === action.value) continue;
        newImages.push(images[i]);
      }
      return { ...state, images: newImages };
    case ACTIVATE_IMAGE:
      activeImageIndex = action.value;
      return { ...state, activeImageIndex };
    default:
      return state;
  }
}
