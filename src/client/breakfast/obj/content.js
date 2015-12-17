import React from 'react';
import ContentActions from '../actions/content';
import { Select } from '../../util/components';

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
   * callback for when an option triggers a content option change
   */
  contentOptionChange(contentType, optionName, value) {
    this.changeEvent(actions.optionChange, () => { return [contentType, optionName, value]; } );
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
    let defaults = this.props.defaultContent;
    let content = this.props.content;
    let isDefault = content.quote.options.isDefault;
    return (
      <div className='inputs quote-inputs'>
        <div className='input-title'>Quote</div>
        <input type='text' ref='quote'
            placeholder={ defaults.quote.quote }
            onChange={ this.changeEvent.bind(
                this,
                actions.quoteChange,
                this.getInputVal.bind(this, 'quote')) }
            value={ isDefault ? '' : content.quote.quote }/>

        <div className='input-title'>Source</div>
        <input type='text' ref='source'
            placeholder={ defaults.quote.source }
            onChange={ this.changeEvent.bind(
                this,
                actions.sourceChange,
                this.getInputVal.bind(this, 'source')) }
            value={ isDefault ? '' : content.quote.source }/>
      </div>
    )
  }

  renderListInputs() {
    let defaults = this.props.defaultContent;
    let content = this.props.content;
    let isDefault = content.list.options.isDefault;
    function renderListItemInput(item, index) {
      let ref = this.formatListItemRef(index);
      let defaultList = defaults.list.items ;
      return (

        <div className='list-input' key={ `list-item-${index}` }>
          <input type='text' ref={ ref }
              placeholder={ index <= defaultList.length ? defaultList[index] : '' }
              value={ isDefault ? '' : item }
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
            value={ isDefault ? '' : content.list.headline }/>

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
    let defaults = this.props.defaultContent;
    let content = this.props.content;
    let isDefault = content.watermark.options.isDefault;
    return (
      <div className='inputs picture-inputs'>
        <div className='input-title'>Photographer</div>
        <input type='text' ref='photographer'
            placeholder={ defaults.watermark.photographer }
            onChange={ this.changeEvent.bind(
              this,
              actions.photographerChange,
              this.getInputVal.bind(this, 'photographer'))}
            value={ isDefault ? '' : content.watermark.photographer }/>
        <div className='input-title'>Copyright holder</div>
        <input type='text' ref='copyright'
            placeholder={ defaults.watermark.copyright }
            onChange={ this.changeEvent.bind(
              this,
              actions.copyrightChange,
              this.getInputVal.bind(this, 'copyright')) }
            value={ isDefault ? '' : content.watermark.copyright }/>
      </div>
    )
  }

  renderContentOptions() {
    let contentType = this.props.content.type;
    let content = this.props.content[contentType];

    if (!content.options) return null;

    let configItems = [];
    if (contentType === 'list') {
      let bulletTypes = ['number', 'bullet'];

      let bullets = [];
      for (let type of bulletTypes) {
        bullets.push(
            <input type='radio'
                  name='number'
                  checked={ 'number' === content.options.bulletType }
                  onClick={
                    ((bulletType) => {
                      return () => {
                        this.contentOptionChange('list', 'bulletType', bulletType);
                      }
                    })(type)
                  }/>
        )
      }
      configItems.push(
        <div className='list-bullet-type'>
          { bullets }
        </div>
      )
    }

    if (typeof content.options.width !== 'undefined') {
      configItems.push(
        <div className='text-width'>
          <input type='range' min={ 10 } max={ 100 } value={ content.options.width }/>
        </div>
      )
    }

    return (
      <div className='content-options'>
        { configItems }
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
        { this.renderContentOptions() }
      </div>
    )
  }
}

class ContentTypeSelect extends Select {
  getDisplayValue(option, index) {
    return option;
  }
}
