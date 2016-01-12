/* Action constants */

// Option Actions
let fontSizeChange = 'fontSizeChange';
let fontColorChange = 'fontColorChange';
let fontFaceChange = 'fontFaceChange';

let textWidthChange = 'textWidthChange';
let textPosChange = 'textPosChange';

let backgroundColorChange = 'backgroundColorChange';
let backgroundImageChange = 'backgroundImageChange';
let removeBackgroundImage = 'removeBackgroundImage';
let backgroundImageLoading = 'backgroundImageLoading';
let backgroundTypeChange = 'backgroundTypeChange';

let aspectRatioChange = 'aspectRatioChange';

let logoChange = 'logoChange';
let logoColorChange = 'logoColorChange';
let logoLocationChange = 'logoLocationChange';

module.exports = {
  // Aspect ratios
  SIXTEEN_NINE: '16:9',
  SQUARE: 'Square',
  TWO_ONE: '2:1 (Twitter)',
  FACEBOOK: '1.9:1 (Facebook)',
  FACEBOOK_COVER: 'Facebook Cover Photo',
  FIT_IMAGE: 'Fit Image',

  CHANGE_EVENT: 'change',

  // Background type states
  BACKGROUND_LOADING: 'background loading',
  BACKGROUND_IMAGE : 'image',
  BACKGROUND_COLOR: 'color',

  actions: {

    options: {
      // Font
      fontSizeChange,
      fontColorChange,
      fontFaceChange,

      textWidthChange,
      textPosChange,

      // Background
      backgroundColorChange,
      backgroundImageChange,
      removeBackgroundImage,
      backgroundImageLoading,
      backgroundTypeChange,

      // Canvas aspect ratio
      aspectRatioChange,

      // Logo
      logoChange,
      logoColorChange,
      logoLocationChange
    }
  }
}

