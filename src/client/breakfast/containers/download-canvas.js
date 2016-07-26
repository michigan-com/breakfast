'use strict';

import React from 'react';
import xr from 'xr';

import Canvas from './canvas';

const MAX_CANVAS_SIZE = 2097152;

/**
 * Used to draw the canvas then download it
 */
export default class DownloadCanvas extends React.Component {
  static propTypes = {
    fileName: React.PropTypes.string.isRequired,
    downloadCallback: React.PropTypes.func,
    textContent: React.PropTypes.string,
  };

  static defaultProps = {
    downloadCallback: () => {},
  };

  componentDidMount() {
    // TODO
    const canvas = this.refs.canvas.refs.wrappedInstance.getCanvasNode();
    let dataUri = canvas.toDataURL();
    let fileExtension = 'png';

    if (dataUri.length > MAX_CANVAS_SIZE) {
      const scaleDown = MAX_CANVAS_SIZE / dataUri.length;
      dataUri = canvas.toDataURL('image/jpeg', scaleDown);
      fileExtension = 'jpg';
    }

    const downloadImage = () => {
      const a = document.createElement('a');
      a.setAttribute('href', dataUri);
      a.setAttribute('download', `${this.props.fileName}.${fileExtension}`); // todo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (this.props.downloadCallback) this.props.downloadCallback();
    };

    // even if we fail to save to s3, let them download the image
    xr.put('/save-image/', { imageData: dataUri })
      .then(downloadImage, downloadImage);
  }

  render() {
    return (
      <Canvas
        textContent={this.props.textContent}
        ref="canvas"
      />
    );
  }
}
