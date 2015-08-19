import React from 'react';
import ReactCanvas from 'react-canvas';
import { toTitleCase, clone } from './lib/parse';
import Canvas from './obj/canvas.js';
import Controls from './obj/controls';
import { SIXTEEN_NINE, SQUARE } from './lib/constants';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var measureText = ReactCanvas.measureText;

class PicEditor extends React.Component {
  constructor(args) {
    super(args);

    this.contentTypes = ['quote', 'list', 'picture'];
    this.aspectRatios = [SQUARE, SIXTEEN_NINE];
    this.logos = [{
      name: 'Detroit Free Press',
      filename: 'dfp_white.svg'
    }, {
      name: 'Detroit News',
      filename: 'dn_white.svg'
    }];

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

      fontSize: 20,
      fontColor: '#000000',
      background: {
        type: 'color',
        color: '#ffffff'
      },
      backgroundColor: '#ffffff',

      // Aspect ratio for the canvas
      aspectRatio: this.aspectRatios[0],

      logoImg: this.logos[0].filename
    }

    this.logoChanged(0);

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

  aspectRatioChange(newRatio) {
    if (this.aspectRatios.indexOf(newRatio) === -1) {
      console.log(`Ratio ${newRatio} not a valid ratio`);
      return;
    }

    this.setState({
      aspectRatio: newRatio
    })
  }

  fontColorChange(color) {
    this.setState({
      fontColor: `#${color.hex}`
    });
  }

  backgroundColorChange(color) {
    this.setState({
      background: {
        type: 'color',
        color: `#${color.hex}`
      },
      backgroundColor: `#${color.hex}`
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

  logoChanged(index) {
    if (index < 0 || index >= this.logos.length) {
      console.log(`Index ${index} invalid`);
      return;
    }

    //if (typeof this.logos[index].element === 'undefined') {
      //// Load the image into the DOM for usage
      //let i = document.createElement('img');
      //i.src = `/img/${this.logos[index].filename}`;
      //i = document.getElementById('img-cache').appendChild(i);

      //i.onload = function() {
        //console.log(i.scrollHeight, i.scrollWidth);
        //this.logos[index].element = i;
      //}.bind(this)

      //var b = new Blob([`${window.location.origin}/img/${this.logos[index].filename}`]);
      //var f = new FileReader();
      //f.onload = function(e) {
        //console.log(f.result);
      //};
      //f.readAsBinaryString(b);
    //}

    this.setState({
      logoImg: this.logos[index].filename
    });
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

  getFileContents(e, input) {
    // react-canvas does some weird caching stuff with images. This makes
    // it so that we clear out the old image while we're loading the new one
    this.setState({
      background: {
        type: 'loading image'
      }
    });

    let file = input.files[0];

    let reader = new FileReader();
    reader.onload = function(e) {
      this.setState({
        background: {
          type: 'image',
          src: reader.result
        }
      })

      input.files = [];
    }.bind(this)

    reader.readAsDataURL(file);
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
    let canvas = this.refs.canvas.getCanvasNode();
    let dataUri = canvas.toDataURL();

    let a = document.createElement('a');
    a.setAttribute('href',  dataUri);
    a.setAttribute('download', 'pic.png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  renderContentOptions(option, index) {
    return(
      <div className={ `content-type ${ this.state.contentType === option ? 'active': '' }` } onClick={ this.contentTypeChange.bind(this, option) }>{ toTitleCase(option) }</div>
    )
  }
  render() {
    let canvasData = this.state[this.state.contentType];
    return(
      <div className='pic-editor'>
        <div className='image-container'>
          <div className='image' ref='image'>
            <Canvas type={ this.state.contentType }
                canvasData={ canvasData }
                fontSize={ this.state.fontSize }
                fontColor={ this.state.fontColor }
                background={ this.state.background }
                aspectRatio={ this.state.aspectRatio }
                logo={ this.state.logoImg }
                ref='canvas'/>
          </div>
        </div>
        <div className='controls-container'>
          <div className='content-type-selector'>
            { ['quote', 'list', 'picture'].map(this.renderContentOptions.bind(this)) }
          </div>
          <div className='text-rendering'>
            { this.renderTextInput() }
          </div>
          <Controls breakfast={ this } logos={ this.logos }/>
          <div className='save'>
            <button className='save' onClick={ this.saveImage.bind(this) }>Save Image</button>
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

