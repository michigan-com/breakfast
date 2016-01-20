import xr from 'xr';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import Dispatcher from '../dispatcher';
import { actions, SQUARE, SIXTEEN_NINE, FACEBOOK, FACEBOOK_COVER, TWO_ONE, FIT_IMAGE,
  CHANGE_EVENT, BACKGROUND_LOADING, BACKGROUND_COLOR, BACKGROUND_IMAGE } from '../lib/constants';

let Actions = actions.options;

let aspectRatios = [TWO_ONE, FACEBOOK, SQUARE, FACEBOOK_COVER, SIXTEEN_NINE, FIT_IMAGE];
let backgroundTypes = [BACKGROUND_COLOR, BACKGROUND_IMAGE];
let cornerOptions = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];


// Info that gets ajaxed in bc a login is needed
let logoInfo = {};
let fonts = [];
let prevAspectRatio = aspectRatios[0];
xr.get('/logos/getLogos/')
  .then((data) => {
    logoInfo = data;
    OptionStore.logosLoaded();
  });

xr.get('/fonts/getFonts/')
  .then((data) => {
    fonts = data.fonts;
    OptionStore.fontsLoaded();
  });

function defaultBackgroundImage() {
  return {
    src: '',
    height: 0,
    width: 0,
    attribution: '',
    attributionLocation: 'bottom-right'
  }
}

function generateDefaultOptions() {
  return  {
    fontSizeMultiplier: 1,
    fontColor: 'black',
    fontFace: 'Helvetica',
    fontOptions: [],

    styleMetrics: generateStyleMetrics(1),

    backgroundType: BACKGROUND_COLOR,
    backgroundColor: '#fff',
    backgroundImg: assign({}, defaultBackgroundImage()),

    canvas: assign({}, getCanvasMetrics()),
    textPos: {
      left: 0,
      top: 0
    },

    // Aspect ratio for the canvas
    aspectRatio: aspectRatios[0],
    aspectRatioValue: getAspectRatioValue(aspectRatios[0]),

    logo: {},
    logoOptions: [],
    logoColor: '#000',
    logoLocation: cornerOptions[cornerOptions.length - 1]
  }
}

function getAspectRatioValue(aspectRatio) {
  switch (aspectRatio) {
    case SIXTEEN_NINE:
      return 9/16;
    case TWO_ONE:
      return 1/2;
    case FACEBOOK:
      return 1/1.911;
    case FACEBOOK_COVER:
      return 0.370153;
    case FIT_IMAGE:
      // Only deal with this aspect ratio if we've loaded an image up
      if (options.backgroundType !== BACKGROUND_IMAGE) {
        break;
      }
      let backgroundImg = options.backgroundImg;
      return (backgroundImg.height / backgroundImg.width);
  }

  return 1;
}

function getCanvasMetrics(aspectRatio='') {
  // Defaults
  let canvasWidth = 650;
  if (aspectRatio === SQUARE) {
    canvasWidth = 400;
  } else if (aspectRatio === FIT_IMAGE && (typeof OptionStore !== 'undefined')) {
    let options = OptionStore.getOptions();

    if (options.backgroundType === BACKGROUND_IMAGE) {
      let ratio = options.backgroundImg.width / options.backgroundImg.height;

      if (ratio < .25) {
        canvasWidth = 300;
      } else if (ratio <= 1) {
        canvasWidth = 400;
      }
    }
  }

  if (window.innerWidth <= canvasWidth) {
    canvasWidth = window.innerWidth * .9;
  }

  let canvasPadding = canvasWidth / 26; // === 25, a nice round number
  let textWidth = canvasWidth - (canvasPadding * 2);

  return {
    canvasWidth,
    canvasPadding,
    textWidth
  }

}

function generateStyleMetrics(fontMultiplier=1) {
  let generateStyle = (initFontSize) => {
    let fontSize = initFontSize * fontMultiplier;
    let lineHeight = fontSize * 1.05;
    let marginBottom = fontSize * .65;
    return { fontSize, lineHeight, marginBottom }
  }

  let pFontSize = 17;
  let h1FontSize = 32;
  let h2FontSize = 24;

  return {
    p: generateStyle(pFontSize),
    h1: generateStyle(h1FontSize),
    h2: generateStyle(h2FontSize),
    li: generateStyle(pFontSize)
  }

}

let options = generateDefaultOptions();

let OptionStore = assign({}, EventEmitter.prototype, {
  windowResize() {
    options.canvas = getCanvasMetrics();
    this.emitChange();
  },

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

  getAspectRatioValue(aspectRatio) {
    return getAspectRatioValue(aspectRatio);
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
    case Actions.removeBackgroundImage:
      OptionStore.removeBackgroundImage();
      break;
    case Actions.backgroundImageLoading:
      OptionStore.backgroundImageLoading();
      break;
    case Actions.backgroundTypeChange:
      OptionStore.backgroundTypeChange(action.value);
      break;
    case Actions.attributionChange:
      OptionStore.attributionChange(action.value);
      break;
    case Actions.attributionLocationChange:
      OptionStore.attributionLocationChange(action.value);
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
    case Actions.textWidthChange:
      OptionStore.textWidthChange(action.value);
      break;
    case Actions.textPosChange:
      OptionStore.textPosChange(action.value);
      break;
  }
});

window.onresize = OptionStore.windowResize.bind(OptionStore);

module.exports = OptionStore;
