import { EventEmitter } from 'events';
import assign from 'object-assign';
import Dispatcher from '../dispatcher';
import { actions, SQUARE, SIXTEEN_NINE, TWO_ONE, CHANGE_EVENT } from '../lib/constants';
import logoInfo from '../lib/logoInfo.json';

let Actions = actions.options;

let aspectRatios = [SQUARE, SIXTEEN_NINE, TWO_ONE];
let backgroundTypes = ['color', 'image'];
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

    backgroundType: 'color',
    backgroundColor: '#000000',
    backgroundSrc: 'http://localhost:3000/img/default_image.jpg',

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
    options.backgroundType = 'color';
    options.backgroundColor = color;

    this.emitChange();
  },

  /**
   * Change the background to be an image
   *
   * @param {String} src - Data from FileReader for an uploaded file image
   */
  backgroundImageChange(src) {
    options.backgroundType = 'image';
    options.backgroundSrc = src;

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
    options.backgroundType = 'loading image';

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
