'use strict';

export const USERNAME_UPDATE = 'USERNAME_UPDATE';
export const INPUT_ERROR = 'INPUT_ERROR';
export const INPUT_FEEDBACK = 'INPUT_FEEDBACK';

export const SENDING_EMAIL = 'SENDING_EMAIL';
export const DONE_SENDING_EMAIL = 'DONE_SENDING_EMAIL';

export function usernameUpdate(username = '') {
  return {
    type: USERNAME_UPDATE,
    value: username,
  };
}

export function inputError(error = '') {
  return {
    type: INPUT_ERROR,
    value: error,
  };
}

export function usernameFeedback(feedback = '') {
  return {
    type: INPUT_FEEDBACK,
    value: feedback,
  };
}

export function sendingEmail() {
  return { type: SENDING_EMAIL };
}

export function doneSendingEmail() {
  return { type: DONE_SENDING_EMAIL };
}

export const DEFAULT_STATE = {
  username: '',
  inputError: '',
  inputFeedback: '',
  sendingEmail: false,
  emailSent: false,
};
