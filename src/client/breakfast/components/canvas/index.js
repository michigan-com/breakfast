'use strict';

import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import updateBackground from './background';
import updateLogo from './logo';
import updateAttribution from './attribution';
import updateText from './text';
import updateSports from './sports';

export default class Canvas extends React.Component {
  static propTypes = {
    Sports: PropTypes.object,
    Background: PropTypes.object,
    Logo: PropTypes.object,
    Attribution: PropTypes.object,
    Font: PropTypes.object,
    Text: PropTypes.object,
    canvas: PropTypes.object,
    drawImageMetrics: PropTypes.object,
    renderText: PropTypes.bool,
  };

  static defaultProps = {
    renderText: false,
  }

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
    const { canvas } = this.props;
    const width = canvas.canvasWidth;
    const height = canvas.canvasHeight;

    return {
      width,
      height,
      padding: canvas.canvasPadding,
      maxTextWidth: canvas.maxTextWidth,
    };
  }

  updateCanvas() {
    const canvasStyle = this.getCanvasStyle();
    const context = this.getCanvasContext();
    const { renderText, Background, Attribution, Logo, Font, Text,
      drawImageMetrics, Sports } = this.props;
    const { textContainers, blockTypeStyle } = Text;


    if (!context) return;

    // Clear out and re-draw
    context.clearRect(0, 0, canvasStyle.width, canvasStyle.height);

    updateBackground(context, canvasStyle, Background, drawImageMetrics);
    updateLogo(context, canvasStyle, Logo);
    updateAttribution(context, canvasStyle, Attribution, Font);
    if (renderText) {
      for (const container of textContainers) {
        if (container.display) {
          updateText(context, canvasStyle, Font, blockTypeStyle, container);
        }
      }
    }

    if (Sports.showSports) {
      updateSports(context, canvasStyle, Sports);
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
