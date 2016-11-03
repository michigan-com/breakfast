
export const PHOTOS_LOADED = 'PHOTOS_LOADED';

export function photosLoaded(photos = []) {
  return {
    type: PHOTOS_LOADED,
    value: photos,
  };
}

export const DEFAULT_STATE = {
  photos: [],
};
