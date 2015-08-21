/* Action constants */
let quoteChange = 'quoteChange';
let sourceChange = 'sourceChange';

let headlineChange = 'headlineChange';
let listItemAdd = 'listItemAdd';
let listItemChange = 'listItemChange';
let listItemRemove = 'listItemRemove';

let photographerChange = 'photographerChange';
let copyrightChange = 'copyrightChange';

module.exports = {
  SIXTEEN_NINE: '16:9',
  SQUARE: 'square',
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
    }
  }
}

