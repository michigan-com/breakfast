'use strict';

import { DEFAULT_STATE, SENDING_EMAIL, DONE_SENDING_EMAIL, USERNAME_UPDATE,
  INPUT_ERROR, INPUT_FEEDBACK } from '../../actions/input';

export default function reducer(state = DEFAULT_STATE, action) {
  let { sendingEmail, username, inputError, inputFeedback, emailSent } = DEFAULT_STATE;
  switch (action.type) {
    case SENDING_EMAIL:
      sendingEmail = true;
      return { ...state, sendingEmail };
    case DONE_SENDING_EMAIL:
      sendingEmail = false;
      emailSent = true;
      inputFeedback = 'Thanks for registering! Please check your email for confirmation.';
      return { ...state, emailSent, sendingEmail, inputFeedback };
    case USERNAME_UPDATE:
      username = action.value;
      return { ...state, username };
    case INPUT_ERROR:
      inputError = action.value;
      sendingEmail = false;
      return { ...state, inputError, sendingEmail };
    case INPUT_FEEDBACK:
      inputFeedback = action.value;
      return { ...state, inputFeedback };
    default:
      return { ...state };
  }
}
