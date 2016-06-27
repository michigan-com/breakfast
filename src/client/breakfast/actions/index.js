'use strict';

import { DEFAULT_BACKGROUND } from './background';
import { DEFAULT_ASPECT_RATIO } from './aspect-ratio';
import { DEFAULT_ATTRIBUTION } from '../actions/attribution';
import { DEFAULT_FONT } from './font';
import { DEFAULT_LOGO_STATE } from './logo';
import { DEFAULT_TEXT } from './text';

export const DEFAULT_STORE = {
  ...DEFAULT_ASPECT_RATIO,
  ...DEFAULT_ATTRIBUTION,
  ...DEFAULT_BACKGROUND,
  ...DEFAULT_FONT,
  ...DEFAULT_LOGO_STATE,
  ...DEFAULT_TEXT,
};
