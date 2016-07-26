'use strict';

import React from 'react';
import { findDOMNode, render } from 'react-dom';
import { connect, Provider } from 'react-redux';

// TODO get it so we dont have to import store
import Store from '../store';
import EditingCanvas from './editing-canvas.js';
import DownloadCanvas from './download-canvas';
import AspectRatioPicker from './aspect-ratio-picker';
import LogoOptions from './logo-options';
import BackgroundOptions from './background-options';

class PicEditor extends React.Component {
  static propTypes = {
    Background: React.PropTypes.object,
  }

  constructor(args) {
    super(args);

    this.state = {
      downloading: false,
      textContent: null, // TODO
    };

    this.saveImage = this.saveImage.bind(this);
  }

  getImageName() {
    const fileName = findDOMNode(this.refs['file-name']).value;
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

    const filename = findDOMNode(this.refs['file-name']).value;

    // TODO move this upstream
    render(
      <Provider store={Store}>
        <DownloadCanvas
          fontSize={this.state.fontSize}
          options={this.props}
          textContent={textContent}
          fileName={filename || 'pic'}
          downloadCallback={doneDownloading}
        />
      </Provider>,
      document.getElementById('download-canvas')
    );
  }

  render() {
    let buttonClass = 'save-image';
    let saveButtonContent = 'Save';
    if (this.state.downloading) {
      buttonClass += ' downloading';
      saveButtonContent = 'Saving...';
    }

    return (
      <div className="pic-editor">
        <div className="image-container">
          <AspectRatioPicker
            currentRatio={this.props.Background.aspectRatio}
            Background={this.props.Background}
          />
          <EditingCanvas options={this.props} options={this.props} ref="canvas" />
        </div>
        <div className="options-container">
          <LogoOptions options={this.props} />
          <BackgroundOptions options={this.props} />
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

function mapStateToProps(state) { return { ...state }; }

export default connect(mapStateToProps)(PicEditor);
