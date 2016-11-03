
export const USER_DATA_LOADED = 'USER_DATA_LOADED';
export const SHOW_PROFILE = 'SHOW_PROFILE';
export const HIDE_PROFILE = 'HIDE_PROFILE';

export function userDataLoaded(data) {
  return {
    type: USER_DATA_LOADED,
    value: data,
  };
}

export function showProfile() {
  return { type: SHOW_PROFILE };
}

export function hideProfile() {
  return { type: HIDE_PROFILE };
}

export const DEFAULT_STATE = {
  user: null,
  userPhotos: [],
  orgPhotoCount: 0,
  showProfile: false,
};
