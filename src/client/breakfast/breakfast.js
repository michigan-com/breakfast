'use strict';

import React from 'react';
import ReactCanvas from 'react-canvas';
import objectAssign from 'object-assign';
import xr from 'xr';

import { toTitleCase, clone } from './lib/parse';
import EditingCanvas from './obj/editing-canvas.js';
import Options from './obj/options';
import AspectRatioPicker from './obj/aspect-ratio-picker';
import { SIXTEEN_NINE, SQUARE } from './lib/constants';
import { OptionStore } from './store';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var measureText = ReactCanvas.measureText;

class PicEditor extends React.Component {
  constructor(args) {
    super(args);

    this.defaultImageSrc = `${window.location.origin}/img/default_image.jpg`;
    this.logoAspectRatios = {};
    this.defaultOptions = OptionStore.getDefaults();
    this.aspectRatios = OptionStore.getAspectRatioOptions();
    this.aspectRatioValues = [];

    for (let aspectRatio of this.aspectRatios) {
      this.aspectRatioValues.push(OptionStore.getAspectRatioValue(aspectRatio));
    }

    this.state = objectAssign({}, OptionStore.getOptions());
    this.state.downloading = false;
    this.state.textContent = null;

    this.previousBackground = this.state.backgroundType;
  }

  componentDidMount() {
    OptionStore.addChangeListener(this._optionChange.bind(this));
  }


  _optionChange() {
    this.setState(OptionStore.getOptions());
  }

  getImageName() {
    let fileName = React.findDOMNode(this.refs['file-name']).value;
    return fileName ? fileName : 'pic';
  }

  saveImage = () => {
   let textContent = this.refs.canvas.getTextContent();
   this.setState({ textContent })

    //if (this.state.downloading) return;

    //this.setState({ downloading: true });
    //let canvas = this.refs.canvas.getCanvasNode();
    //let dataUri = canvas.toDataURL();

    //let downloadImage = () => {
      //let a = document.createElement('a');
      //a.setAttribute('href',  dataUri);
      //a.setAttribute('download', `${this.getImageName()}.png`);
      //document.body.appendChild(a);
      //a.click();
      //document.body.removeChild(a);
      //this.setState({ downloading: false });
    //}

    //// even if we fail to save to s3, let them download the image
    //xr.put('/save-image/', { imageData: dataUri })
      //.then( downloadImage, downloadImage );

  }

  // TODO
  updateFileName(e) {
    // contentActions.filenameChange(e.target.value);
  }

  render() {
    let options = OptionStore.getOptions();

    let buttonClass = 'save-image';
    let saveButtonContent = 'Save';
    if (this.state.downloading) {
      buttonClass += ' downloading';
      saveButtonContent = 'Saving...';
    }

    return(
      <div className='pic-editor'>
        <div className='options-container'>
          <Options fonts={ options.fontOptions }
              logos={ this.state.logoOptions }
              options={ OptionStore.getOptions() }/>
        </div>
        <div className='image-container'>
          <AspectRatioPicker
              currentRatio={ options.aspectRatio }
              aspectRatios={ this.aspectRatios }
              aspectRatioValues = { this.aspectRatioValues }/>
          <EditingCanvas fontSize={ this.state.fontSize }
              options={ options }
              textContent={ this.state.textContent }
              ref='canvas'/>
          <div className='save-container'>
            <input type='text' ref='file-name' id='file-name' onChange={ this.updateFileName }/>
            <div className={ buttonClass } onClick={ this.saveImage.bind(this) }>{ saveButtonContent }</div>
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

