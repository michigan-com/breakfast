import { EventEmitter } from 'events';
import assign from 'object-assign';
import Dispatcher from '../dispatcher';
import { actions, CHANGE_EVENT } from '../lib/constants';

let Actions = actions.content;

let contentTypes = ['quote', 'list', 'watermark'];

let defaultFilename = 'pic';

// TODO make this more random
function getRandomDefaults() {
  return {
    quote: {
      quote: 'Test Quote',
      source: 'Test Source'
    },
    list: {
      headline: 'This is a headline',
      items: ['This is an item in the list']
    },
    watermark: {
      photographer: 'Peter Parker',
      copyright: 'Daily Bugle'
    }
  }
}

let content = {
  type: contentTypes[0],
  quote: {
    quote: '',
    source: '',
  },
  list: {
    headline: '',
    items: [''],
  },
  watermark: {
    photographer: '',
    copyright: ''
  },

  // Filename
  filename: defaultFilename,
  manualFilenameInput: false
};

let ContentStore = assign({}, EventEmitter.prototype, {

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  getContent() {
    return content;
  },

  getDefaults() {
    return getRandomDefaults();
  },

  getContentTypes() {
    return contentTypes;
  },

  /**
   * Update text of a given value in the store based on an action type
   *
   * @param {String} actionType - Content-based action. Used to figure out
   *  what in the store to change
   * @param {String} text - The new value to be stored
   */
  textChange(actionType, text) {
    switch(actionType) {
      case Actions.quoteChange:
        content.quote.quote = text;
        break;
      case Actions.sourceChange:
        content.quote.source = text;
        break;
      case Actions.headlineChange:
        content.list.headline = text;
        break;
      case Actions.photographerChange:
        content.watermark.photographer = text;
        break;
      case Actions.copyrightChange:
        content.watermark.copyright = text;
        break;
    }

    this._updateFilenameToContent();
    this.emitChange();
  },

  /**
   * Adds a blank item to the list
   */
  listItemAdd() {
    content.list.items.push('');
    this.emitChange();
  },

  /**
   * Remove an item from the list
   *
   * @param {Number} index - Index of the list item to be removed
   */
  listItemRemove(index) {
    let newItems = [];
    for (let i = 0; i < content.list.items.length; i++) {
      if (i != index) newItems.push(content.list.items[i]);
    }
    content.list.items = newItems;
    this._updateFilenameToContent();
    this.emitChange();
  },

  /**
   * Update a list item
   *
   * @param {Number} index - Index of the list item to be changed
   * @param {String} text - Text to be displayed for the list item
   */
  listItemChange(index, text) {
    if (index < 0 || index >= content.list.items.length) return;

    content.list.items[index] = text;
    this._updateFilenameToContent();
    this.emitChange();
  },

  /**
   * Update the content type
   *
   * @param {String} type - Content type to be updated to
   */
  contentTypeChange(type) {
    if (contentTypes.indexOf(type) < 0) return;

    content.type = type;
    this._updateFilenameToContent();
    this.emitChange();
  },

  _updateFilenameToContent() {
    if (content.manualFilenameInput && content.filename) return;

    let makeFilename = (str) => { return str.replace(/\"\'/g, '').split(' ').join('-'); }
    let filename = 'pic';
    switch (content.type) {
      case 'quote':
        if (content.quote.quote) {
          filename = makeFilename(content.quote.quote)
        }
        break;
      case 'list':
        if (content.list.headline) {
          filename = makeFilename(content.list.headline);
        } else if (content.list.items.length && content.list.items[0]) {
          filename = makeFilename(content.list.items[0])
        }
        break;
      case 'watermark':
        if (content.watermark.photographer) {
          filename = makeFilename(`${content.watermark.photographer} ${content.watermark.copyright}`);
        }
        break;
    }

    content.manualFilenameInput = false;
    content.filename = filename.slice(0, 20);
  },

  filenameChange(value) {
    content.filename = value;
    content.manualFilenameInput = true;
    this.emitChange();
  }
});

Dispatcher.register(function(action) {

  switch(action.type) {
    // All these actions just change text on the canvas
    case Actions.quoteChange:
    case Actions.sourceChange:
    case Actions.headlineChange:
    case Actions.photographerChange:
    case Actions.copyrightChange:
      ContentStore.textChange(action.type, action.text);
      break;

    // List item actions are a little more complicated
    case Actions.listItemAdd:
      ContentStore.listItemAdd();
      break;
    case Actions.listItemRemove:
      ContentStore.listItemRemove(action.index);
      break;
    case Actions.listItemChange:
      ContentStore.listItemChange(action.index, action.text);
      break;

    case Actions.contentTypeChange:
      ContentStore.contentTypeChange(action.value);
      break;
    case Actions.filenameChange:
      ContentStore.filenameChange(action.value);
      break;
  }
});

module.exports = ContentStore;
