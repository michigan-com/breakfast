'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import objectAssign from 'object-assign';

import { SIXTEEN_NINE, SQUARE } from './util/constants';
import { OptionStore } from './store';
import EditingCanvas from './components/editing-canvas.js';
import AspectRatioPicker from './components/aspect-ratio-picker';
import DownloadCanvas from './components/download-canvas';
import LogoOptions from './components/logo-options';
import BackgroundOptions from './components/background-options';

class PicEditor extends React.Component {
  constructor(args) {
    super(args);

    this.logoAspectRatios = {};
    this.aspectRatios = OptionStore.getAspectRatioOptions();
    this.aspectRatioValues = [];

    for (let aspectRatio of this.aspectRatios) {
      this.aspectRatioValues.push(OptionStore.getAspectRatioValue(aspectRatio));
    }

    this.state = {
      downloading: false,
      optionsLoaded: false, // used to re-render when we get new options
      textContent: null
    }
  }

  componentDidMount() {
    OptionStore.addChangeListener(() => {
      this.setState({ optionsLoaded: true });
    }.bind(this));
  }

  getImageName() {
    let fileName = ReactDOM.findDOMNode(this.refs['file-name']).value;
    return fileName ? fileName : 'pic';
  }

  saveImage = () => {
    if (this.state.downloading) return;

    let textContent = this.refs.canvas.getTextContent();
    this.setState({ downloading: true });

    let doneDownloading = () => {
      document.getElementById('download-canvas').innerHTML = null;
      this.setState({ downloading: false });
    }

    let filename = ReactDOM.findDOMNode(this.refs['file-name']).value;

    let element = ReactDOM.render(
      <DownloadCanvas fontSize={ this.state.fontSize }
          options={ OptionStore.getOptions() }
          textContent={ textContent }
          fileName={ filename || 'pic' }
          downloadCallback={ doneDownloading }/>,
      document.getElementById('download-canvas')
    )
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
        <div className='image-container'>
          <AspectRatioPicker
              currentRatio={ options.aspectRatio }
              aspectRatios={ this.aspectRatios }
              aspectRatioValues = { this.aspectRatioValues }/>
          <EditingCanvas  options={ options } ref='canvas'/>
        </div>
        <div className='options-container'>
          <LogoOptions options={ options }/>
          <BackgroundOptions options={ options }/>
          <div className='save-container'>
            <input placeholder='pic' type='text' ref='file-name' id='file-name' onChange={ this.updateFileName }/>
            <div className={ buttonClass } onClick={ this.saveImage.bind(this) }>{ saveButtonContent }</div>
          </div>
        </div>
      </div>
    )
  }
}

(function(){
  ReactDOM.render(
    <PicEditor/>,
    document.getElementById('editor')
  )
})();

