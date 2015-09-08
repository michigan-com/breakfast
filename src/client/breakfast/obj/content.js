import React from 'react';
import ContentActions from '../actions/content';
import { Select } from './components';

let actions = new ContentActions();

export default class Content extends React.Component {

  /**
   * Used to emit events through the dispatcher. Takes and event callback,
   * and an optional ref to pull the value from
   *
   * @memberof Content
   * @param {Function} action - Action that gets executed to update the store.
   *  See ../actions/content.js for more details on available actions
   * @param {Function} getter - Function used to get the value(s) to be passed
   *  to the action() function. getter() must return a single argument, or an
   *  array of arguments. TODO make this able to be just a value and not a
   *  function
   */
  changeEvent(action, getter) {
    let args;

    if (getter && typeof getter === 'function') {
      args = getter();
    }

    if (Array.isArray(args)) {
      action.apply(action, args);
    } else {
      action(args);
    }
  }

  /**
   * callback for when an option is selected in the content type dropdown
   */
  contentTypeChange(contentType, index) {
    this.changeEvent(actions.contentTypeChange, () => { return contentType; });
  }

  /**
   * Given a ref to an <input> object, get the object and return its .value
   * attribute. Can be used in this.changeEvent() as a getter
   *
   * @memberof Content
   * @param {String} ref - React ref. Will look in this.refs for the ref. NOTE
   *  must refer to an <input> object
   * @return {String} Value of the <input> object defined by ref
   */
  getInputVal(ref) {
    let value;
    if (ref && ref in this.refs) {
      value = React.findDOMNode(this.refs[ref]).value;
    }

    return value;
  }

  /**
   * Given an index into the list of list items, get the value of that list
   * item and return it and the index in an array. Used as a getter for the
   * changeEvent() function for actions.listItemChange
   *
   * @memberof Content
   * @param {Number} index - List item index. Will build a ref string from it
   * and get the value of it's input element
   * @returns {Array} Arguments passed to the listItemChange event
   */
  getListItemVal(index) {
    let ref = this.formatListItemRef(index);
    let value = this.getInputVal(ref);

    return [index, value];
  }

  formatListItemRef(index) {
    return `list-item-${index}`;
  }

  renderQuoteInputs() {
    let defaults = this.props.defaults;
    let content = this.props.content;
    return (
      <div className='inputs quote-inputs'>
        <div className='input-title'>Quote</div>
        <input type='text' ref='quote'
            placeholder={ defaults.quote.quote }
            onChange={ this.changeEvent.bind(
                this,
                actions.quoteChange,
                this.getInputVal.bind(this, 'quote')) }
            value={ content.quote.quote }/>

        <div className='input-title'>Source</div>
        <input type='text' ref='source'
            placeholder={ defaults.quote.source }
            onChange={ this.changeEvent.bind(
                this,
                actions.sourceChange,
                this.getInputVal.bind(this, 'source')) }
            value={ content.quote.source }/>
      </div>
    )
  }

  renderListInputs() {
    let defaults = this.props.defaults;
    let content = this.props.content;
    function renderListItemInput(item, index) {
      let ref = this.formatListItemRef(index);
      return (

        <div className='list-input' key={ `list-item-${index}` }>
          <input type='text' ref={ ref }
              value={ item }
              onChange={ this.changeEvent.bind(
                this,
                actions.listItemChange,
                this.getListItemVal.bind(this, index))}/>
          <div className='remove-list-item'
            onClick={ this.changeEvent.bind(
              this,
              actions.listItemRemove,
              function() { return index })}>
            X
          </div>
        </div>
      )
    }
    return (
      <div className='inputs list-inputs'>

        <div className='input-title'>Headline</div>
        <input type='text' ref='headline'
            placeholder={ defaults.list.headline }
            onChange={ this.changeEvent.bind(
                this,
                actions.headlineChange,
                this.getInputVal.bind(this, 'headline')) }
            value={ content.list.headline }/>

        <div className='input-title'>List Items</div>
        { content.list.items.map(renderListItemInput.bind(this)) }
        <div className='add-item'
           onClick={ this.changeEvent.bind(this, actions.listItemAdd) }>
            Add item
          </div>
      </div>
    )
  }

  renderWatermarkInputs() {
    let defaults = this.props.defaults;
    let content = this.props.content;
    return (
      <div className='inputs picture-inputs'>
        <div className='input-title'>Photographer</div>
        <input type='text' ref='photographer'
            placeholder={ defaults.watermark.photographer }
            onChange={ this.changeEvent.bind(
              this,
              actions.photographerChange,
              this.getInputVal.bind(this, 'photographer'))}
            value={ content.watermark.photographer }/>
        <div className='input-title'>Copyright holder</div>
        <input type='text' ref='copyright'
            placeholder={ defaults.watermark.copyright }
            onChange={ this.changeEvent.bind(
              this,
              actions.copyrightChange,
              this.getInputVal.bind(this, 'copyright')) }
            value={ content.watermark.copyright }/>
      </div>
    )
  }

  render() {
    let contentType = this.props.content.type;
    let contentInput;

    if (contentType === 'quote') {
      contentInput = this.renderQuoteInputs();
    } else if (contentType === 'list') {
      contentInput = this.renderListInputs();
    } else if (contentType === 'watermark') {
      contentInput = this.renderWatermarkInputs();
    }


    return (
      <div className='content'>
        <div className='section-title'>Content</div>
        <ContentTypeSelect htmlClass='content-type-select'
            options={ this.props.contentTypes }
            onSelect={ this.contentTypeChange.bind(this) }/>
        { contentInput }
      </div>
    )
  }
}

class ContentTypeSelect extends Select {
  getDisplayValue(option, index) {
    return option;
  }
}
