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

    this.defaultImageSrc = `${window.location.origin}/img/default_image.jpg`;
    this.contentTypes = ['quote', 'list', 'watermark'];
    this.aspectRatios = [SQUARE, SIXTEEN_NINE];
    this.logos = [{
      name: 'Detroit Free Press',
      filename: 'dfp_white.svg'
    }, {
      name: 'Detroit News',
      filename: 'dn_white.svg'
    }];
    this.logoAspectRatios = {};
    this.previousBackground; // used for when we switch back and forth from watermark


    this.defaults = {
      quote: {
        quote: 'Test quote',
        source: 'Test source'
      }
    }

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
      watermark: {
        photographer: 'Peter Parker',
        copyright: 'Daily Bugle'
      },

      fontSize: 20,
      fontColor: '#ffffff',
      background: {
        type: 'color',
        color: '#000000'
      },
      backgroundColor: '#ffffff',

      // Aspect ratio for the canvas
      aspectRatio: this.aspectRatios[0],

      logo: {}
    }

    this.logoChanged(0);

  }

  contentTypeChange(contentType) {
    if (this.contentTypes.indexOf(contentType) === -1) {
      console.log('Invalid conent type ' + contentType);
      return;
    }

    let newState = {
      contentType
    };

    // If we're switching to the watermark and we don't have a background
    // image, load the default one
    if (contentType === 'watermark' && this.state.background.type !== 'image') {
      this.previousBackground = this.state.background;
      newState.background = {
        type: 'image',
        src: this.defaultImageSrc
      }
    } else if (contentType !== 'watermark' && this.state.background.src === this.defaultImageSrc) {
      // If we're switching away from watermark, and we have the default image
      // loaded, change back to the previous background
      newState.background = this.previousBackground;

    }

    this.setState(newState);
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

  photographerChange() {
    let copyright = this.state.watermark.copyright;
    this.setState({
      watermark: {
        photographer: React.findDOMNode(this.refs.photographer).value,
        copyright
      }
    });
  }

  copyrightChange() {
    let photographer = this.state.watermark.photographer;
    this.setState({
      watermark: {
        photographer,
        copyright: React.findDOMNode(this.refs.copyright).value
      }
    })
  }

  logoChanged(index) {
    if (index < 0 || index >= this.logos.length) {
      console.log(`Index ${index} invalid`);
      return;
    }

    let logo = this.logos[index];
    let filename = logo.filename;
    let setNewImage = function(imgFilename, aspectRatio) {
      this.setState({
        logo: {
          filename: imgFilename,
          aspectRatio
        }
      });
    }.bind(this)

    // Clear out the old image
    setNewImage('', 0.0);

    // Load the image into the DOM for usage
    let i = document.createElement('img');
    i.src = `/img/${this.logos[index].filename}`;
    i = document.getElementById('img-cache').appendChild(i);

    i.onload = function() {
      console.log(i.scrollHeight, i.scrollWidth);
      this.logoAspectRatios[filename] = (i.scrollWidth / i.scrollHeight);
      setNewImage(filename, this.logoAspectRatios[filename]);
    }.bind(this)

  }

  headlineChanged() {
    let items = this.state.list.items;
    this.setState({
      list: {
        headline: React.findDOMNode(this.refs.headline).value,
        items
      }
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
          <div className='input-title'>Headline</div>
          <input type='text' ref='headline' placeholder={ this.state.list.headline } onChange={ this.headlineChanged.bind(this) }/>
          <div className='input-title'>List Items</div>
          { this.state.list.items.map(renderListItemInput.bind(this)) }
          <div className='add-item' onClick={ this.addListItem.bind(this) }>Add item</div>
        </div>
      )
    } else if (this.state.contentType === 'watermark') {
      return (
        <div className='inputs picture-inputs'>
          <div className='input-title'>Photographer</div>
          <input type='text' ref='photographer' placeholder={ this.state.watermark.photographer } onChange={ this.photographerChange.bind(this) }/>
          <div className='input-title'>Copyright holder</div>
          <input type='text' ref='copyright' placeholder={ this.state.watermark.copyright } onChange={ this.copyrightChange.bind(this) }/>
        </div>
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
        <div className='content-type-selector'>
          { ['quote', 'list', 'watermark'].map(this.renderContentOptions.bind(this)) }
        </div>
        <div className='image-container'>
          <div className='image' ref='image'>
            <Canvas type={ this.state.contentType }
                canvasData={ canvasData }
                fontSize={ this.state.fontSize }
                fontColor={ this.state.fontColor }
                background={ this.state.background }
                aspectRatio={ this.state.aspectRatio }
                logo={ this.state.logo }
                ref='canvas'/>
          </div>
        </div>
        <div className='controls-container'>
          <div className='section-title'>Content</div>
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

