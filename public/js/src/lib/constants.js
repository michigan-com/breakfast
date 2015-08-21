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

// Option Actions
let fontSizeChange = 'fontSizeChange';
let fontColorChange = 'fontColorChange';

let backgroundColorChange = 'backgroundColorChange';
let backgroundImageChange = 'backgroundImageChange';

let aspectRatioChange = 'aspectRatioChange';

let logoChange = 'logoChange';

module.exports = {
  SIXTEEN_NINE: '16:9',
  SQUARE: 'square',
  CHANGE_EVENT: 'change',
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
      copyrightChange
    },

    options: {
      fontSizeChange,
      fontColorChange,

      backgroundColorChange,
      backgroundImageChange,

      aspectRatioChange,

      logoChange
    }
  }
}

