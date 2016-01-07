'use strict';

import React from 'react';
import xr from 'xr';

import Canvas from './components/canvas';

/**
 * Used to draw the canvas then download it
 */
export default class DownloadCanvas extends React.Component {

  componentDidMount() {
    let canvas = this.refs.canvas.getCanvasNode();
    let dataUri = canvas.toDataURL();

    let downloadImage = () => {
      let a = document.createElement('a');
      a.setAttribute('href',  dataUri);
      a.setAttribute('download', `${this.props.fileName}.png`); // todo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (this.props.downloadCallback) this.props.downloadCallback();
    }

    // even if we fail to save to s3, let them download the image
    xr.put('/save-image/', { imageData: dataUri })
      .then( downloadImage, downloadImage );
  }

  render() {
    return (
      <Canvas fontSize={ this.props.fontSize }
          options={ this.props.options }
          textContent={ this.props.textContent }
          ref='canvas'/>
    )
  }
}