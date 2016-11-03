
import { PHOTOS_LOADED, DEFAULT_STATE } from '../../actions/photos';

export default function photoReducer(state = DEFAULT_STATE, action) {
  let { photos } = state;
  switch (action.type) {
    case PHOTOS_LOADED:
      photos = action.value;
      return { ...state, photos };
    default:
      return { ...state };
  }
}
