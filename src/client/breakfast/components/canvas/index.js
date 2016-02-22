'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';

import { BACKGROUND_COLOR, BACKGROUND_IMAGE } from '../../actions/background';

import updateBackground from './background';
import updateLogo from './logo';
import updateAttribution from './attribution';

export default class Canvas extends React.Component {
  componentDidMount() { this.updateCanvas() }
  componentDidUpdate() {
    // TODO - figure out if we need to clear out the old canvas
    this.updateCanvas()
  }

  getCanvasNode() {
    return findDOMNode(this.refs.canvas);
  }

  getCanvasContext() {
    let canvas = findDOMNode(this.refs.canvas);
    return canvas.getContext('2d');
  }

  updateCanvas() {
    let canvasStyle = this.getCanvasStyle();
    let context = this.getCanvasContext();
    let options = this.props.options;

    // Clear out and re-draw
    context.clearRect(0, 0, canvasStyle.width, canvasStyle.height);

    updateBackground(context, canvasStyle, options.Background);
    updateLogo(context, canvasStyle, options.Logo);
    updateAttribution(context, canvasStyle, options.Attribution, options.Font);
  }

  // We double the actual size of the canvas to render images, but scale down
  // the size using CSS transform. So the actual size of the canvas is double
  // what we have stored in the store
  getCanvasStyle() {
    let canvas = this.props.options.Background.canvas;

    return {
      width: canvas.canvasWidth * 2,
      height: canvas.canvasHeight * 2,
      padding: canvas.canvasPadding * 2,
      maxTextWidth: canvas.maxTextWidth * 2,
    }
  }

  render() {
    let style = this.getCanvasStyle();
    return (
      <canvas width={ style.width } height={ style.height } ref='canvas'/>
    )
  }
}
