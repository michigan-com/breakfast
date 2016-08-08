'use strict';

export const SHOW_REPOSITIONING = 'SHOW_REPOSITIONING';
export const HIDE_REPOSITIONING = 'HIDE_REPOSITIONING';

export function showRepositioning() {
  return { type: SHOW_REPOSITIONING };
}

export function hideRepositioning() {
  return { type: HIDE_REPOSITIONING };
}

export const DEFAULT_STATE = {
  showRepositioning: false,
};
