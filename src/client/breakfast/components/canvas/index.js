'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';

import updateBackground from './background';
import updateLogo from './logo';
import updateAttribution from './attribution';
import updateText from './text';
import Store from '../../store';

export default class Canvas extends React.Component {
  componentDidMount() { this.updateCanvas(); }
  componentDidUpdate() {
    // TODO - figure out if we need to clear out the old canvas
    this.updateCanvas();
  }

  getCanvasNode() {
    return findDOMNode(this.refs.canvas);
  }

  getCanvasContext() {
    const canvas = findDOMNode(this.refs.canvas);
    return canvas.getContext('2d');
  }

  // We double the actual size of the canvas to render images, but scale down
  // the size using CSS transform. So the actual size of the canvas is double
  // what we have stored in the store
  getCanvasStyle() {
    const canvas = this.props.options.Background.canvas;

    return {
      width: canvas.canvasWidth,
      height: canvas.canvasHeight,
      padding: canvas.canvasPadding,
      maxTextWidth: canvas.maxTextWidth,
    };
  }

  updateCanvas() {
    const canvasStyle = this.getCanvasStyle();
    const context = this.getCanvasContext();
    const options = this.props.options;

    // Clear out and re-draw
    context.clearRect(0, 0, canvasStyle.width, canvasStyle.height);

    updateBackground(context, canvasStyle, options.Background);
    updateLogo(context, canvasStyle, options.Logo);
    updateAttribution(context, canvasStyle, options.Attribution, options.Font);
    if (this.props.textContent) {
      updateText(context, canvasStyle, options.Font, options.Text, this.props.textContent);
    }
  }

  render() {
    const style = this.getCanvasStyle();
    return (
      <canvas width={style.width} height={style.height} ref="canvas" />
    );
  }
}

Canvas.propTypes = {
  options: React.PropTypes.shape(Store.getState()).isRequired,
  textContent: React.PropTypes.object.isRequired,
};
