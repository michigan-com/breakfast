'use strict';

import { DEFAULT_STATE, UPLOAD_IMAGE, UPDATE_IMAGE, REMOVE_IMAGE, ACTIVATE_SINGLE_IMAGE,
  DEACTIVATE_SINGLE_IMAGE, ACTIVATE_SECOND_IMAGE, DEACTIVATE_SECOND_IMAGE } from '../../actions/uploads';

export default function uploadsReducer(state = DEFAULT_STATE, action) {
  var { images, activeImageIndices } = { ...state };
  const newIndices = [ ...activeImageIndices];
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

      for (var i = 0; i < newIndices.length; i++) {
        if (i === action.value) newIndices[i] = -1;
      }

      return { ...state, images: newImages, activeImageIndices: newIndices };
    case ACTIVATE_SINGLE_IMAGE:
      newIndices[0] = action.value;
      return { ...state, activeImageIndices: newIndices };
    case ACTIVATE_SECOND_IMAGE:
      newIndices[1] = action.value;
      return { ...state, activeImageIndices: newIndices };
    case DEACTIVATE_SINGLE_IMAGE:
      newIndices[0] = -1;
      return { ...state, activeImageIndices: newIndices };
    case DEACTIVATE_SECOND_IMAGE:
      newIndices[1] = -1;
      return { ...state, activeImageIndices: newIndices };
    default:
      return state;
  }

  return state;
}
