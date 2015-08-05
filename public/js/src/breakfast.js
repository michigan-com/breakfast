import $ from 'jquery';
import factList from './factlist';
import quotable from './quotable';
import waterbug from './waterbug';
import React from 'react';
import Editor from 'react-medium-editor';
import html2canvas from 'html2canvas';

// TODO look into why html2canvas doesnt work unless this is here
window.html2canvas = {};

class PicEditor extends React.Component {
  constructor(args) {
    super(args);

    this.contentTypes = ['quote', 'list', 'picture'];
    this.state = {
      contentType: this.contentTypes[0],

      // Quote stuff
      quote: {
        quote: 'Test quote',
        source: 'Test source'
      },
      list: {
        headline: 'This is a headline',
        items: ['this is an item in the ist']
      }
    }

  }

  contentTypeChange(contentType) {
    if (this.contentTypes.indexOf(contentType) === -1) {
      console.log('Invalid conent type ' + type);
      return;
    }

    this.setState({
      contentType
    });
  }

  quoteChanged() {
    let source = this.state.quote.source;
    this.setState({
      quote: {
        quote: React.findDOMNode(this.refs.quote).value,
        source
      }
    });
  }

  listItemChanged(ref, index) {
    if (index >= this.state.list.items.length) {
      console.log('Index out of range');
      return;
    } else if (!(ref in this.refs)) {
      console.log(`Ref ${ref} not found`);
      return;
    }

    let headline = this.state.list.headline;
    let items = this.state.list.items;
    items[index] = React.findDOMNode(this.refs[ref]).value;
    this.setState({
      items
    });
  }

  renderImageText() {
    function renderListItem(item, index) {
      return (
        <li className='item'>{ item }</li>
      )
    }

    if (this.state.contentType === 'quote') {
      return (
        <div className='quote'>
          <div className='quote-text'>
            { this.state.quote.quote }
          </div>
          <div className='source'>
            { this.state.quote.source }
          </div>
        </div>
      )
    } else if (this.state.contentType === 'list') {
      return (
        <div className='list'>
          <div className='headline'>
          </div>
          <ul className='list-items'>
            { this.state.list.items.map(renderListItem) }
          </ul>
        </div>
      )
    }
    else {
      return (
        <div>Haven't implemented this yet</div>
      )
    }
  }

  renderTextInput() {

    function renderListItemInput(item, index) {
      let ref = 'list-item-' + index;
      return (
        <input type='text' ref={ ref } value={ item } onChange={ this.listItemChanged.bind(this, ref, index) }/>
      )
    }

    if (this.state.contentType === 'quote') {
      return (
        <div className='inputs'>
          <input type='text' ref='quote' placeholder={ this.state.quote.quote } onChange={ this.quoteChanged.bind(this) }/>
        </div>
      )
    } else if (this.state.contentType === 'list') {
      return (
        <div className='inputs'>
          { this.state.list.items.map(renderListItemInput.bind(this)) }
          <div className='add-item'>Add item</div>
        </div>
      )
    }
  }

  saveImage() {
    let img = React.findDOMNode(this.refs.image);
    html2canvas(img).then(function(canvas) {
      let el = document.body.appendChild(canvas);
      let dataUri = el.toDataURL();

      let $a = $('<a>').attr('href', dataUri).attr('download', 'pic.png').appendTo('body');
      $a[0].click();
      $a.remove();
    });
  }

  render() {
    return(
      <div className='pic-editor'>
        <div className='image-container'>
          <div className='image' ref='image'>
            <div className='text-content'>
              { this.renderImageText() }
            </div>
          </div>
        </div>
        <div className='controls-container'>
          <div className='content-type-selector'>
            <div className='content-type' onClick={ this.contentTypeChange.bind(this, 'quote') }>Quote</div>
            <div className='content-type' onClick={ this.contentTypeChange.bind(this, 'list') }>Fact List</div>
            <div className='content-type' onClick={ this.contentTypeChange.bind(this, 'image') }>Water Mark</div>
          </div>
          <div className='text-rendering'>
            { this.renderTextInput() }
          </div>
          <div className='save'>
            <button className='save' onClick={ this.saveImage.bind(this) }>Save</button>
          </div>
        </div>
      </div>
    )
  }
}

(function(){

  React.render(
    <PicEditor/>,
    document.getElementById('editor')
  )
  factList.init();
})();


