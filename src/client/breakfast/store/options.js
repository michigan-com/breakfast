import xr from 'xr';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import Dispatcher from '../dispatcher';
import { actions, SQUARE, SIXTEEN_NINE, FACEBOOK, TWO_ONE, FIT_IMAGE, CHANGE_EVENT,
  BACKGROUND_LOADING, BACKGROUND_COLOR, BACKGROUND_IMAGE } from '../lib/constants';

let Actions = actions.options;

let aspectRatios = [TWO_ONE, FACEBOOK, SQUARE, SIXTEEN_NINE, FIT_IMAGE];
let backgroundTypes = [BACKGROUND_COLOR, BACKGROUND_IMAGE];
let cornerOptions = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

// Info that gets ajaxed in bc a login is needed
let logoInfo = {};
let fonts = [];
xr.get('/logos/getLogos/')
  .then((data) => {
    logoInfo = data;
    OptionStore.logosLoaded();
  });

xr.get('/fonts/getFonts/')
  .then((data) => {
    fonts = data.fonts;
    OptionStore.fontsLoaded();
  })

function generateDefaultOptions() {
  return  {
    fontSize: 40,
    fontColor: '#000000',
    fontFace: 'Helvetica',
    fontOptions: [],

    backgroundType: BACKGROUND_COLOR,
    backgroundColor: '#ffffff',
    backgroundImg: {
      src: '',
      height: 0,
      width: 0
    },

    // Aspect ratio for the canvas
    aspectRatio: aspectRatios[0],

    logo: {},
    logoOptions: [],
    logoColor: '#000000',
    logoLocation: cornerOptions[cornerOptions.length - 1]
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
    return options.logoOptions;
  },

  getLogoInfo() {
    return logoInfo;
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
   * @param {Number} index - index into logoInfo array for logo to display
   */
  logoChange(index) {
    if (index < 0 || index >= options.logoOptions.length) return;

    let filename = options.logoOptions[index].filename;
    let logo = logoInfo[filename];

    if (logo.isSvg) {
      options.logo = { filename, aspectRatio: logo.aspectRatio };
      this.emitChange();
    } else {
      // If we couldnt find an aspect ratio, it's likely because it's a .png and we
      // couldnt read it from the file contents. Load the image in the browser and
      // read the aspect ratio from that

      var i = new Image();
      i.onload = () => {
        let aspectRatio = i.width / i.height;
        options.logo = { filename, aspectRatio};
        this.emitChange();
      }
      i.src = `${window.location.origin}/logos/${filename}`;
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

  logosLoaded() {
    let logos = [];
    for (let filename in logoInfo) {
      logos.push({
        name: logoInfo[filename].name,
        filename
      });
    }
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
      OptionStore.logoChange(action.value);
      break;
    case Actions.logoColorChange:
      OptionStore.logoColorChange(action.value);
      break;
    case Actions.logoLocationChange:
      OptionStore.logoLocationChange(action.value);
      break;
  }
});

module.exports = OptionStore;
