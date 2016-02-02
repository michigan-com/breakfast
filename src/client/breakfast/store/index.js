'use strict';

import xr from 'xr';
import assign from 'object-assign';
import { createStore, combineReducers} from 'react-redux';

import { DEFAULT_STORE } from '../actions';
import * as reducers from './reducers';

const Reducers = combineReducers(reducers);

export default store = createStore(Reducers, DEFAULT_STORE);

// Info that gets ajaxed in bc a login is needed
let logoInfo = {};
let fonts = [];

let OptionStore = assign({}, EventEmitter.prototype, {
  windowResize() {
    options.canvas = getCanvasMetrics();
    this.emitChange();
  },
  /**
   * Update the font size
   *
   * @param {Number} size - New font size. Min: 1, max: 33. Will normalize to be [1-3];
   */
  fontSizeChange(size) {
    options.fontSizeMultiplier = size / 11; // Range from 1 - 33, but really only want a multiplier from 1-3
    options.styleMetrics = generateStyleMetrics(options.fontSizeMultiplier);

    this.emitChange();
  },

  /**
   * Update font color
   * * @param {String} color - Hex version of the new font color
   */
  fontColorChange(color) {
    options.fontColor = color;

    this.emitChange();
  },

  fontFaceChange(fontFace) {
    options.fontFace = fontFace;

    this.emitChange();
  },

  backgroundColorChange(color) {
    options.backgroundType = BACKGROUND_COLOR;
    options.backgroundColor = color;

    this.emitChange();
  },

  /**
   * Change the background to be an image
   *
   * @param {Object} backgroundImg - Object containing image information:
   *  {
   *    src: // image src,
   *    width: // image width,
   *    height: //image height
   *  }
   */
  backgroundImageChange(backgroundImg) {
    options.backgroundType = BACKGROUND_IMAGE;
    options.backgroundImg = assign({}, defaultBackgroundImage(), backgroundImg);

    this.emitChange();
  },

  removeBackgroundImage() {
    options.backgroundType = BACKGROUND_COLOR;
    options.backgroundImg = defaultBackgroundImage();

    if (options.aspectRatio === FIT_IMAGE) {
      this.aspectRatioChange(TWO_ONE)
    } else {
      this.emitChange();
    }
  },

  /**
   * Hacky function to get around image cache. Called when loading a new background
   * image
   */
  backgroundImageLoading() {
    options.backgroundType = BACKGROUND_LOADING;

    this.emitChange();
  },

  backgroundTypeChange(type) {
    options.backgroundType = type;

    if (options.aspectRatio === FIT_IMAGE) {
      this.aspectRatioChange(TWO_ONE);
    } else {
      this.emitChange();
    }
  },

  attributionChange(text) {
    options.backgroundImg.attribution = text;
    this.emitChange();
  },

  attributionLocationChange(corner) {
    if (cornerOptions.indexOf(corner) < 0) return;

    options.backgroundImg.attributionLocation = corner;
    this.emitChange();
  },

  attributionColorChange(color) {
    options.backgroundImg.attributionColor = color;
    this.emitChange();
  },

  /**
   * Update the aspect ratio of the canvas. Only accept valid ratios (i.e. the
   * ratios in the aspectRatios array)
   *
   * @param {String} newRatio - New ratio, must be in aspectRatios array
   */
  aspectRatioChange(newRatio) {
    if (aspectRatios.indexOf(newRatio) < 0) return;

    prevAspectRatio = options.aspectRatio;
    options.aspectRatio = newRatio;
    options.aspectRatioValue = getAspectRatioValue(newRatio);

    options.canvas = getCanvasMetrics(options.aspectRatio);
    this.emitChange();
  },

  /**
   * Update the logo. TODO make it so we can pull aspectRatio from a json file
   *
   * @param {Number} index - index into logoInfo array for logo to display
   */
  logoChange(index) {
    if (index < 0 || index >= options.logoOptions.length) return;

    let filename = options.logoOptions[index].filename;
    let logo = logoInfo[filename];

    if (logo.isSvg) {
      options.logo = { filename, aspectRatio: logo.aspectRatio, noColor: logo.noColor };
      this.emitChange();
    } else {
    }
  },

  logoColorChange(color) {
    options.logoColor = color;
    this.emitChange();
  },

  logoLocationChange(corner) {
    if (cornerOptions.indexOf(corner) < 0) return;

    options.logoLocation = corner;
    this.emitChange();
  },

  textWidthChange(width) {
    if (!(width >= 0 && width <= 100)) return;

    let maxTextWidth = options.canvas.canvasWidth - (options.canvas.canvasPadding * 2);
    options.canvas.textWidth = maxTextWidth * (width / 100);
    this.emitChange();
  },

  textPosChange(newPos) {
    options.textPos = assign({}, newPos);

    this.emitChange();
  },

  logosLoaded() {
    let logos = [];
    for (let filename in logoInfo) {
      logos.push({
        name: logoInfo[filename].name,
        filename
      });
    }

    // Sort alphabetically, except put AP last
    logos.sort((a, b) => {
      if (a.name === 'AP.png' || a.name > b.name) return 1;
      else if (b.name === 'AP.png' || a.name < b.name) return -1;

      return 0;
    });

    options.logoOptions = logos;

    if (logos.length) {
      this.logoChange(0);
    }
  },

  fontsLoaded() {
    options.fontOptions = fonts.slice(); // copy
    this.emitChange();
  }
});

window.onresize = OptionStore.windowResize.bind(OptionStore);
