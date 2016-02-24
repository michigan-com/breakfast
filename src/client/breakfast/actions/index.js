'use strict';

import assign from 'object-assign';

import { generateStyleMetrics } from './font';
import { DEFAULT_BACKGROUND_IMAGE, BACKGROUND_COLOR, DEFAULT_BACKGROUND } from './background';
import { DEFAULT_ASPECT_RATIO, getDefaultCanvasMetrics, ASPECT_RATIOS,
  getDefaultAspectRatioValue } from './aspect-ratio';
import { CORNER_OPTIONS } from './corner';
import { DEFAULT_ATTRIBUTION } from '../actions/attribution';
import { DEFAULT_FONT } from './font';
import { DEFAULT_LOGO_STATE } from './logo';
import { DEFAULT_TEXT } from './text';

export const DEFAULT_STORE = assign({}, DEFAULT_ASPECT_RATIO, DEFAULT_ATTRIBUTION,
  DEFAULT_BACKGROUND, DEFAULT_FONT, DEFAULT_LOGO_STATE, DEFAULT_TEXT)