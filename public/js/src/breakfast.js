import React from 'react';
import ReactCanvas from 'react-canvas';
import objectAssign from 'object-assign';
import { toTitleCase, clone } from './lib/parse';
import Canvas from './obj/canvas.js';
import Options from './obj/options';
import Content from './obj/content';
import { SIXTEEN_NINE, SQUARE } from './lib/constants';
import { ContentStore, OptionStore } from './store';

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
    this.logos = OptionStore.getLogoOptions();
    this.fonts = OptionStore.getFontOptions();
    this.logoAspectRatios = {};
    this.previousBackground; // used for when we switch back and forth from watermark

    this.state = {
      contentType: this.contentTypes[0],
    }

    objectAssign(this.state, ContentStore.getContent());
    objectAssign(this.state, OptionStore.getOptions());
  }

  componentDidMount() {
    ContentStore.addChangeListener(this._contentChange.bind(this));
    OptionStore.addChangeListener(this._optionChange.bind(this));
  }

  _contentChange() {
    this.setState(ContentStore.getContent());
  }

  _optionChange() {
    this.setState(OptionStore.getOptions());
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
    let contentDefaults = ContentStore.getDefaults();
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
                options={ OptionStore.getOptions() }
                ref='canvas'/>
          </div>
        </div>
        <div className='options-container'>
          <div className='section-title'>Content</div>
          <div className='text-rendering'>
            <Content contentType={ this.state.contentType }
                defaults={ contentDefaults }
                content={ ContentStore.getContent() }/>
          </div>
          <Options fonts={ this.fonts }
              logos={ this.logos }
              aspectRatios={ this.aspectRatios }
              contentType={ this.state.contentType }
              options={ OptionStore.getOptions() }/>
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

