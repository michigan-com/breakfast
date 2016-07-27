'use strict';

export const START_DOWNLOADING = 'START_DOWNLOADING';
export const DONE_DOWNLOADING = 'DONE_DOWNLOADING';
export const UPDATE_FILENAME = 'UPDATE_FILENAME';

export function startDownloading() {
  return { type: START_DOWNLOADING };
}

export function doneDownloading() {
  return { type: DONE_DOWNLOADING };
}

export function updateFilename(filename = '') {
  return {
    type: UPDATE_FILENAME,
    value: filename,
  };
}

export const DEFAULT_STATE = {
  downloadingImage: false,
  filename: '',
};
