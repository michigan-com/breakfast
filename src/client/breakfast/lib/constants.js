/* Action constants */

// Content Actions
let quoteChange = 'quoteChange';
let sourceChange = 'sourceChange';

let headlineChange = 'headlineChange';
let listItemAdd = 'listItemAdd';
let listItemChange = 'listItemChange';
let listItemRemove = 'listItemRemove';

let photographerChange = 'photographerChange';
let copyrightChange = 'copyrightChange';

let contentTypeChange = 'contentTypeChange';

let filenameChange = 'filenameChange';
let optionsChange = 'optionsChange';

// Option Actions
let fontSizeChange = 'fontSizeChange';
let fontColorChange = 'fontColorChange';
let fontFaceChange = 'fontFaceChange';

let textWidthChange = 'textWidthChange';

let backgroundColorChange = 'backgroundColorChange';
let backgroundImageChange = 'backgroundImageChange';
let backgroundImageLoading = 'backgroundImageLoading';
let backgroundTypeChange = 'backgroundTypeChange';

let aspectRatioChange = 'aspectRatioChange';

let logoChange = 'logoChange';
let logoColorChange = 'logoColorChange';
let logoLocationChange = 'logoLocationChange';

module.exports = {
  // Aspect ratios
  SIXTEEN_NINE: '16:9',
  SQUARE: 'Instagram',
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
    content: {
      // Quote
      quoteChange,
      sourceChange,

      // List
      headlineChange,
      listItemAdd,
      listItemRemove,
      listItemChange,

      // Watermark
      photographerChange,
      copyrightChange,

      contentTypeChange,

      filenameChange,

      optionsChange,
    },

    options: {
      // Font
      fontSizeChange,
      fontColorChange,
      fontFaceChange,

      textWidthChange,

      // Background
      backgroundColorChange,
      backgroundImageChange,
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

