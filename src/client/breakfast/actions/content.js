import Dispatcher from '../dispatcher';
import { actions } from '../lib/constants';

let Actions = actions.content;

/**
 * Wrapper around the Dispatcher singleton.
 */
export default class ContentActions {

  /* Quote Actions */
  quoteChange(text) {
    Dispatcher.dispatch({
      type: Actions.quoteChange,
      text,
    })
  }

  sourceChange(text) {
    Dispatcher.dispatch({
      type: Actions.sourceChange,
      text
    })
  }

  /* List Actions */
  headlineChange(text) {
    Dispatcher.dispatch({
      type: Actions.headlineChange,
      text
    })
  }

  listItemAdd() {
    Dispatcher.dispatch({
      type: Actions.listItemAdd
    })
  }

  listItemRemove(index) {
    Dispatcher.dispatch({
      type: Actions.listItemRemove,
      index
    })
  }

  listItemChange(index, text) {
    Dispatcher.dispatch({
      type: Actions.listItemChange,
      index,
      text
    })
  }

  /* Watermark Actions */
  photographerChange(text) {
    Dispatcher.dispatch({
      type: Actions.photographerChange,
      text,
    })
  }

  copyrightChange(text) {
    Dispatcher.dispatch({
      type: Actions.copyrightChange,
      text
    })
  }

  contentTypeChange(type) {
    Dispatcher.dispatch({
      type: Actions.contentTypeChange,
      value: type
    })
  }

  filenameChange(name) {
    Dispatcher.dispatch({
      type: Actions.filenameChange,
      value: name
    })
  }
}
