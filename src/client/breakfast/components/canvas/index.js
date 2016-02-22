'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';

import { BACKGROUND_COLOR, BACKGROUND_IMAGE } from '../../actions/background';

import updateBackground from './background';

export default class Canvas extends React.Component {
  componentDidMount() { this.updateCanvas() }
  componentDidUpdate() {
    // TODO - figure out if we need to clear out the old canvas
    this.updateCanvas()
  }

  getCanvasContext() {
    let canvas = findDOMNode(this.refs.canvas);
    return canvas.getContext('2d');
  }

  updateCanvas() {
    let canvasStyle = this.getCanvasStyle();
    let context = this.getCanvasContext();
    let options = this.props.options;

    context.clearRect(0, 0, canvasStyle.width, canvasStyle.height);
    updateBackground(context, canvasStyle, options.Background);
    //updateLogo();
    //updateAttribution();
  }

  getCanvasStyle() {
    let canvas = this.props.options.Background.canvas;

    return {
      width: canvas.canvasWidth * 2,
      height: canvas.canvasHeight * 2,
      maxTextWidth: canvas.maxTextWidth,
    }
  }

  render() {
    let style = this.getCanvasStyle();
    return (
      <canvas width={ style.width } height={ style.height } ref='canvas'/>
    )
  }
}
