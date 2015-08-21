import { EventEmitter } from 'events';
import assign from 'object-assign';
import Dispatcher from '../dispatcher';
import { actions, SQUARE, SIXTEEN_NINE, CHANGE_EVENT } from '../lib/constants';

let Actions = actions.options;

let aspectRatios = [SQUARE, SIXTEEN_NINE];

let options = {
  fontSize: 20,
  fontColor: '#ffffff',
  background: {
    type: 'color',
    color: '#000000'
  },
  backgroundColor: '#ffffff',

  // Aspect ratio for the canvas
  aspectRatio: aspectRatios[0],

  logo: {}
}

let OptionStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  getOptions: function() {
    return options;
  }
})

Dispatcher.register(function(action) {
  switch(action.type) {

  }
});

module.exports = OptionStore;
