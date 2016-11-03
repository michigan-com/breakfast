
import { USER_DATA_LOADED, SHOW_PROFILE, HIDE_PROFILE,
    DEFAULT_STATE } from '../../actions/user';

export default function userReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case USER_DATA_LOADED:
      return { ...state, ...action.value };
    case SHOW_PROFILE:
      return { ...state, showProfile: true };
    case HIDE_PROFILE:
      return { ...state, showProfile: false };
    default:
      return { ...state };
  }
}
