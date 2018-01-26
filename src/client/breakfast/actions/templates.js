'use strict';

const TEMPLATES_NAMES = [
  'layout',
  'search',
  'corner'
]

export function startDownloading() {
  return { type: START_DOWNLOADING };
}

export const DEFAULT_STATE = {
  "templates" : TEMPLATES_NAMES
};

