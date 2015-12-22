'use strict';

import React from 'react';
import ReactCanvas from 'react-canvas';
import objectAssign from 'object-assign';
import xr from 'xr';

import { toTitleCase, clone } from './lib/parse';
import Canvas from './obj/canvas.js';
import Options from './obj/options';
import Content from './obj/content';
import { SIXTEEN_NINE, SQUARE } from './lib/constants';
import { ContentStore, OptionStore } from './store';
import ContentActions from './actions/content';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var measureText = ReactCanvas.measureText;

var contentActions = new ContentActions();

class PicEditor extends React.Component {
  constructor(args) {
    super(args);

    this.defaultImageSrc = `${window.location.origin}/img/default_image.jpg`;
    this.contentTypes = ContentStore.getContentTypes();
    this.aspectRatios = OptionStore.getAspectRatioOptions();
    this.logoAspectRatios = {};
    this.defaultOptions = OptionStore.getDefaults();

    this.state = objectAssign({}, ContentStore.getContent());
    this.state = objectAssign({}, this.state, OptionStore.getOptions());

    this.previousBackground = this.state.backgroundType;
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

  getImageName() {
    let fileName = React.findDOMNode(this.refs['file-name']).value;
    return fileName ? fileName : 'pic';
  }

  saveImage = () => {
    let canvas = this.refs.canvas.getCanvasNode();
    let dataUri = canvas.toDataURL();

    xr.post('/save-image/', { imageData: dataUri })
      .then(() => {
        let a = document.createElement('a');
        a.setAttribute('href',  dataUri);
        a.setAttribute('download', `${this.getImageName()}.png`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, () => {
        alert('failed to save image');
      });

  }

  updateFileName(e) {
    contentActions.filenameChange(e.target.value);
  }

  render() {
    let content = ContentStore.getContent();
    let options = OptionStore.getOptions();
    let canvasData = this.state[content.type];
    return(
      <div className='pic-editor'>

        <div className='image-container'>
          <Canvas canvasData={ canvasData }
              fontSize={ this.state.fontSize }
              options={ options }
              content={ content }
              ref='canvas'/>
          <div className='save-container'>
            <input type='text' ref='file-name' id='file-name' onChange={ this.updateFileName } value={ content.filename }/>
            <div className='save-image' onClick={ this.saveImage.bind(this) }>Save</div>
          </div>
        </div>
        <div className='options-container'>
          <Content contentTypes={ this.contentTypes }
              defaultContent={ ContentStore.getDefaultContent() }
              content={ ContentStore.getContent() }/>
          <Options fonts={ options.fontOptions }
              logos={ this.state.logoOptions }
              aspectRatios={ this.aspectRatios }
              contentType={ content.type }
              options={ OptionStore.getOptions() }/>
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

