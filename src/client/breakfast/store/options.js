import { EventEmitter } from 'events';
import assign from 'object-assign';
import Dispatcher from '../dispatcher';
import { actions, SQUARE, SIXTEEN_NINE, FACEBOOK, TWO_ONE, FIT_IMAGE, CHANGE_EVENT,
  BACKGROUND_LOADING, BACKGROUND_COLOR, BACKGROUND_IMAGE } from '../lib/constants';
import logoInfo from '../lib/logoInfo.json';

let Actions = actions.options;

let aspectRatios = [TWO_ONE, FACEBOOK, SQUARE, SIXTEEN_NINE, FIT_IMAGE];
let backgroundTypes = [BACKGROUND_COLOR, BACKGROUND_IMAGE];
let fonts = [
  'Helvetica',
  'Impact',
  'Georgia'
];

function generateDefaultOptions() {
  return  {
    fontSize: 20,
    fontColor: '#ffffff',
    fontFace: fonts[0],

    backgroundType: BACKGROUND_COLOR,
    backgroundColor: '#000000',
    backgroundImg: {
      src: '',
      height: 0,
      width: 0
    },

    // Aspect ratio for the canvas
    aspectRatio: aspectRatios[0],

    logo: {}
  }
}

let options = generateDefaultOptions();

let OptionStore = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  getOptions() {
    return options;
  },

  getDefaults() {
    return generateDefaultOptions();
  },

  getLogoOptions() {
    let logos = [];
    for (let filename in logoInfo) {
      logos.push({
        name: logoInfo[filename].name,
        filename
      });
    }
    return logos;
  },

  getFontOptions() {
    return fonts;
  },

  getBackgroundTypeOptions() {
    return backgroundTypes;
  },

  getAspectRatioOptions() {
    return aspectRatios;
  },

  /**
   * Update the font size
   *
   * @param {Number} size - New font size
   */
  fontSizeChange(size) {
    options.fontSize = size;

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
    options.backgroundImg = backgroundImg;
    options.aspectRatio = FIT_IMAGE;

    this.emitChange();
  },

  backgroundTypeChange(type) {
    options.backgroundType = type;

    this.emitChange();
  },

  /**
   * Hacky function to get around image cache. Called when loading a new background
   * image
   */
  backgroundImageLoading() {
    options.backgroundType = BACKGROUND_LOADING;

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

    options.aspectRatio = newRatio;
    this.emitChange();
  },

  /**
   * Update the logo. TODO make it so we can pull aspectRatio from a json file
   *
   * @param {String} filename - URL for the logo in question
   * @param {Number} aspectRatio - used to calculate where the logo should
   *  go on the image
   */
  logoChange(filename, aspectRatio) {
    options.logo = { filename, aspectRatio };
    this.emitChange();
  }
});

Dispatcher.register(function(action) {
  switch(action.type) {
    case Actions.fontSizeChange:
      OptionStore.fontSizeChange(action.value);
      break;
    case Actions.fontColorChange:
      OptionStore.fontColorChange(action.value);
      break;
    case Actions.fontFaceChange:
      OptionStore.fontFaceChange(action.value);
      break;
    case Actions.backgroundColorChange:
      OptionStore.backgroundColorChange(action.value);
      break;
    case Actions.backgroundImageChange:
      OptionStore.backgroundImageChange(action.value);
      break;
    case Actions.backgroundImageLoading:
      OptionStore.backgroundImageLoading();
      break;
    case Actions.backgroundTypeChange:
      OptionStore.backgroundTypeChange(action.value);
      break;
    case Actions.aspectRatioChange:
      OptionStore.aspectRatioChange(action.value);
      break;
    case Actions.logoChange:
      OptionStore.logoChange(action.filename, action.aspectRatio);
      break;
  }
});

module.exports = OptionStore;
