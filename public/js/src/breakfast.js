import React from 'react';
import ReactCanvas from 'react-canvas';
import { toTitleCase, clone } from './lib/parse';
import Canvas from './obj/canvas.js';
import Controls from './obj/controls';
import Content from './obj/content';
import { SIXTEEN_NINE, SQUARE } from './lib/constants';
import ContentStore from './store/content';

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

    this.state = {
      contentType: this.contentTypes[0],

      // Quote stuff
      quote: {
        quote: '',
        source: ''
      },
      list: {
        headline: '',
        items: ['This is an item in the list']
      },
      watermark: {
        photographer: '',
        copyright: ''
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

  componentDidMount() {
    ContentStore.addChangeListener(this._contentChange.bind(this));
  }

  _contentChange() {
    this.setState(ContentStore.getContent());
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

  quoteChanged(quote) {
    let source = this.state.quote.source;
    this.setState({
      quote: {
        quote,
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
      <div className={ `content-type ${ this.state.contentType === option ? 'active': '' }` }
          onClick={ this.contentTypeChange.bind(this, option) }>
        { toTitleCase(option) }
      </div>
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
            <Content breakfast={ this }/>
          </div>
          <Controls breakfast={ this } logos={ this.logos }/>
          <div className='save'>
            <div className='save-image' onClick={ this.saveImage.bind(this) }>Download Image</div>
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

