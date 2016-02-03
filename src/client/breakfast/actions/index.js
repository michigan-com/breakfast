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

// export const DEFAULT_STORE = {
//   fontSizeMultiplier: 1,
//   fontColor: 'black',
//   fontFace: 'Helvetica',
//   fontOptions: [],

//   styleMetrics: generateStyleMetrics(1),

//   backgroundType: BACKGROUND_COLOR,
//   backgroundColor: '#fff',
//   backgroundImg: assign({}, DEFAULT_BACKGROUND_IMAGE),

//   attribution: DEFAULT_ATTRIBUTION,

//   canvas: assign({}, getDefaultCanvasMetrics()),
//   textPos: {
//     left: 0,
//     top: 0
//   },

//   // Aspect ratio for the canvas
//   aspectRatio: ASPECT_RATIOS[0],
//   aspectRatioValue: getDefaultAspectRatioValue(),

//   logo: {},
//   logoOptions: [],
//   logoColor: '#000',
//   logoLocation: CORNER_OPTIONS[CORNER_OPTIONS.length - 1]
// }
