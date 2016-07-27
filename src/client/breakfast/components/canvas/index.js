'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';

import updateBackground from './background';
import updateLogo from './logo';
import updateAttribution from './attribution';
import updateText from './text';

export default class Canvas extends React.Component {
  static propTypes = {
    textContent: React.PropTypes.string,
    Background: React.PropTypes.object,
    Logo: React.PropTypes.object,
    Attribution: React.PropTypes.object,
    Font: React.PropTypes.object,
    Text: React.PropTypes.object,
  };


  componentDidMount() { this.updateCanvas(); }
  componentDidUpdate() { this.updateCanvas(); }

  getCanvasNode() {
    if (!this.canvas) return null;
    return findDOMNode(this.canvas);
  }

  getCanvasContext() {
    if (!this.canvas) return null;
    const canvas = findDOMNode(this.canvas);
    return canvas.getContext('2d');
  }

  // We double the actual size of the canvas to render images, but scale down
  // the size using CSS transform. So the actual size of the canvas is double
  // what we have stored in the store
  getCanvasStyle() {
    const { canvas } = this.props.Background;

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
    const { Background, Attribution, Logo, Font, Text, textContent } = this.props;

    if (!context) return;

    // Clear out and re-draw
    context.clearRect(0, 0, canvasStyle.width, canvasStyle.height);

    updateBackground(context, canvasStyle, Background);
    updateLogo(context, canvasStyle, Logo);
    updateAttribution(context, canvasStyle, Attribution, Font);
    if (textContent) {
      updateText(context, canvasStyle, Font, Text, textContent);
    }
  }

  render() {
    const style = this.getCanvasStyle();
    return (
      <canvas
        width={style.width}
        height={style.height}
        ref={(canvas) => {
          if (canvas) this.canvas = canvas;
        }}
      />
    );
  }
}
