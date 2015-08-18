import React from 'react';
import ReactCanvas from 'react-canvas';
import { wrapText, clone } from './lib/parse';
import Canvas from './obj/canvas.js';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var measureText = ReactCanvas.measureText;

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
      },

      fontSize: 20
    }
  }

  contentTypeChange(contentType) {
    if (this.contentTypes.indexOf(contentType) === -1) {
      console.log('Invalid conent type ' + contentType);
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

  quoteSourceChanged() {
    let quote = this.state.quote.quote;
    this.setState({
      quote: {
        quote,
        source: React.findDOMNode(this.refs.source).value
      }
    })
  }

  addListItem() {
    let list = clone(this.state.list);
    list.items.push('');
    this.setState({ list });
  }

  removeListItem(index) {
    let newItems = [];
    let list = this.state.list;
    for (let i = 0; i < list.items.length; i++) {
      if (i != index) newItems.push(list.items[i]);
    }

    this.setState({
      list: {
        headline: list.headline,
        items: newItems
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

  setFontSize(e) {
    this.setState({ fontSize: parseInt(e.target.value) });
  }

  renderTextInput() {

    function renderListItemInput(item, index) {
      let ref = 'list-item-' + index;
      return (

        <div className='list-input'>
          <input type='text' ref={ ref } value={ item } onChange={ this.listItemChanged.bind(this, ref, index) }/>
          <div className='remove-list-item' onClick={ this.removeListItem.bind(this,index) }>X</div>
        </div>
      )
    }

    if (this.state.contentType === 'quote') {
      return (
        <div className='inputs quote-inputs'>
          <div className='input-title'>Quote</div>
          <input type='text' ref='quote' placeholder={ this.state.quote.quote } onChange={ this.quoteChanged.bind(this) }/>
          <div className='input-title'>Source</div>
          <input type='text' ref='source' placeholder={ this.state.quote.source } onChange={ this.quoteSourceChanged.bind(this) }/>
        </div>
      )
    } else if (this.state.contentType === 'list') {
      return (
        <div className='inputs list-inputs'>
          { this.state.list.items.map(renderListItemInput.bind(this)) }
          <div className='add-item' onClick={ this.addListItem.bind(this) }>Add item</div>
        </div>
      )
    } else if (this.state.contentType === 'picture') {
      return (
        <div> This hasn't been implemented yet</div>
      )
    }
  }

  saveImage() {
    let canvas = React.findDOMNode(this.refs.canvas);
    let dataUri = canvas.toDataURL();

    var a = document.createElement('a');
    a.setAttribute('href',  dataUri);
    a.setAttribute('download', 'pic.png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  render() {

    let canvasData = this.state[this.state.contentType];
    console.log(canvasData, this.state.contentType);
    return(
      <div className='pic-editor'>
        <div className='image-container'>
          <div className='image' ref='image'>
            <Surface className='quote' width={650} height={650} left={0} top={0} fillStyle={'white'} ref='canvas'>
              <Canvas type={ this.state.contentType } canvasData={ canvasData } fontSize={ this.state.fontSize }/>
            </Surface>
          </div>
        </div>
        <div className='controls-container'>
          <div className='content-type-selector'>
            <div className='content-type' onClick={ this.contentTypeChange.bind(this, 'quote') }>Quote</div>
            <div className='content-type' onClick={ this.contentTypeChange.bind(this, 'list') }>Fact List</div>
            <div className='content-type' onClick={ this.contentTypeChange.bind(this, 'picture') }>Water Mark</div>
          </div>
          <div className='text-rendering'>
            { this.renderTextInput() }
          </div>
          <div className='options'>
            <input type='range' min='10' max='60' value={ this.state.fontSize } onChange={ this.setFontSize.bind(this) }/>
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
})();

