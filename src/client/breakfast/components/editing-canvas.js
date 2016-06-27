'use strict';

import React from 'react';

import TextOverlay from './subcomponents/text-overlay';
import Canvas from './canvas';
import Store from '../store';

export default class EditingCanvas extends React.Component {

  getTextContent() {
    return this.refs['text-overlay'].getTextContent();
  }

  render() {
    let className = 'image';
    let options = this.props.options;

    // Have to scale down for better UI
    let style = {
      width: options.Background.canvas.canvasWidth / 2,
      height: options.Background.canvas.canvasHeight / 2,
    };

    return (
      <div className={className} style={style} ref="image">
        <Canvas options={options} textContent={this.props.textContent} ref="canvas" />
        <TextOverlay options={options} ref="text-overlay" />
      </div>
    );
  }
}

EditingCanvas.propTypes = {
  options: React.PropTypes.shape(Store.getState()).isRequired,
  textContent: React.PropTypes.object,
};
