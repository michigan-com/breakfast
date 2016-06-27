'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import xr from 'xr';

import Store from './store';
import { logosLoaded } from './actions/logo';
import { fontsLoaded } from './actions/font';
import EditingCanvas from './components/editing-canvas.js';
import AspectRatioPicker from './components/aspect-ratio-picker';
import DownloadCanvas from './components/download-canvas';
import LogoOptions from './components/logo-options';
import BackgroundOptions from './components/background-options';

class PicEditor extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      downloading: false,
      textContent: null, // TODO
    };

    this.saveImage = this.saveImage.bind(this);
  }

  getImageName() {
    const fileName = ReactDOM.findDOMNode(this.refs['file-name']).value;
    return fileName !== '' ? fileName : 'pic';
  }

  saveImage() {
    if (this.state.downloading) return;

    let textContent = this.refs.canvas.getTextContent();
    this.setState({ downloading: true });

    let doneDownloading = () => {
      document.getElementById('download-canvas').innerHTML = null;
      this.setState({ downloading: false });
    };

    const filename = ReactDOM.findDOMNode(this.refs['file-name']).value;

    ReactDOM.render(
      <DownloadCanvas
        fontSize={this.state.fontSize}
        options={this.props.options}
        textContent={textContent}
        fileName={filename || 'pic'}
        downloadCallback={doneDownloading}
      />,
      document.getElementById('download-canvas')
    );
  }

  render() {
    let options = this.props.options;

    let buttonClass = 'save-image';
    let saveButtonContent = 'Save';
    if (this.state.downloading) {
      buttonClass += ' downloading';
      saveButtonContent = 'Saving...';
    }

    return (
      <div className="pic-editor">
        <div className="image-container">
          <AspectRatioPicker currentRatio={options.Background.aspectRatio} options={options} />
          <EditingCanvas options={options} options={options} ref="canvas" />
        </div>
        <div className="options-container">
          <LogoOptions options={options} />
          <BackgroundOptions options={options} />
          <div className="save-container">
            <input
              placeholder="pic"
              type="text"
              ref="file-name"
              id="file-name"
              onChange={this.updateFileName}
            />
            <div
              className={buttonClass}
              onClick={this.saveImage}
            >
              {saveButtonContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PicEditor.propTypes = {
  options: React.PropTypes.shape(Store.getState()).isRequired,
};

function renderBreakfast() {
  let state = Store.getState();
  ReactDOM.render(
    <PicEditor options={state} />,
    document.getElementById('editor')
  );
}

export default function Breakfast() {
  // TODO
  xr.get('/logos/getLogos/')
    .then((data) => {
      Store.dispatch(logosLoaded(data));
    });

  // TODO
  xr.get('/fonts/getFonts/')
    .then((data) => {
      Store.dispatch(fontsLoaded(data.fonts));
    });

  Store.subscribe(renderBreakfast);
  renderBreakfast();
}
