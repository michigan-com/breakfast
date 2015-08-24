import { EventEmitter } from 'events';
import assign from 'object-assign';
import Dispatcher from '../dispatcher';
import { actions, CHANGE_EVENT } from '../lib/constants';

let Actions = actions.content;

let contentTypes = ['quote', 'list', 'watermark'];
let contentType = contentTypes[0];
let content = {
  quote: {
    quote: '',
    source: ''
  },
  list: {
    headline: '',
    items: []
  },
  watermark: {
    photographer: '',
    copyright: ''
  }
}

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
      if (i != index) newItems.push(content.list.items[index]);
    }
    content.list.items = newItems;

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

    this.emitChange();
  },

  /**
   * Update the content type
   *
   * @param {String} type - Content type to be updated to
   */
  contentTypeUpdate(type) {
    if (contentTypes.indexOf(type) < 0) return;

    contentType = type;
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
  }
});

module.exports = ContentStore;
