'use strict';

import React, { PropTypes } from 'react';

import updateBackground from './canvas/background';

export default class BackgroundPosition extends React.Component {
  static propTypes = {
    Background: PropTypes.object.isRequired,
    canvas: PropTypes.object.isRequired,
    drawImageMetrics: PropTypes.object,
    updateDrawLocation: PropTypes.func,
  };

  static defaultProps = {
    updateDrawLocation: () => {},
  };

  constructor(props) {
    super(props);
    this.storedImageMetrics = null;
    this.clickedMouseX = 0;
    this.clickedMouseY = 0;

    this.canvas = null;
  }

  componentDidMount() { this.updateCanvas(); }
  componentDidUpdate() { this.updateCanvas(); }

  getImageWidth() {
    return window.innerWidth * 0.5;
  }

  getOverlayStyle() {
    const { canvas, drawImageMetrics } = this.props;
    const canvasAspectRatio = canvas.aspectRatio;
    if (drawImageMetrics == null) return null;

    const top = 0;
    const left = 0;
    const width = this.getImageWidth();
    const height = width / canvasAspectRatio;
    // if (imageAspectRatio < canvasAspectRatio) {
    //   height = width / canvasAspectRatio;
    // } else {
    //   height = this.imageWidth / imageAspectRatio;
    // }

    return { top, left, height, width };
  }

  getCanvasContext() {
    if (!this.canvas) return null;
    const canvas = this.canvas;
    return canvas.getContext('2d');
  }

  getCanvasStyle() {
    const { canvas } = this.props;
    return {
      height: canvas.canvasHeight,
      width: canvas.canvasWidth,
    };
  }

  getCanvasContainerStyle() {
    const { canvas } = this.props;
    const height = canvas.canvasHeight / 2;
    const width = canvas.canvasWidth / 2;
    return {
      height,
      width,
      margin: '0 auto',
    };
  }

  mouseDown = (e) => {
    this.clickedMouseX = e.clientX;
    this.clickedMouseY = e.clientY;
    this.storedImageMetrics = { ...this.props.drawImageMetrics };
    this.trackMouseMovement();
  }

  mouseMove = (e) => {
    const { Background, canvas } = this.props;
    const deltaX = e.clientX - this.clickedMouseX;
    const deltaY = e.clientY - this.clickedMouseY;
    const backgroundImg = Background.backgroundImg;
    const imageAspectRatio = backgroundImg.width / backgroundImg.height;
    const imageHeight = this.getImageWidth() / imageAspectRatio;

    const deltaXPercent = deltaX / this.getImageWidth();
    const deltaYPercent = deltaY / imageHeight;

    const newDx = this.storedImageMetrics.dx + (deltaXPercent * canvas.canvasWidth);
    const newDy = this.storedImageMetrics.dy + (deltaYPercent * canvas.canvasHeight);
    this.props.updateDrawLocation(newDx, newDy);
  }

  trackMouseMovement = () => {
    document.body.addEventListener('mousemove', this.mouseMove);
    document.body.addEventListener('mouseup', this.stopTrackingMouseMovement);
    document.body.addEventListener('blur', this.stopTrackingMouseMovement);
    document.body.addEventListener('mouseout', this.stopTrackingMouseMovement);
  }

  stopTrackingMouseMovement = () => {
    this.clickedMouseX = 0;
    this.clickedMouseY = 0;
    document.body.removeEventListener('mousemove', this.mouseMove);
    document.body.removeEventListener('mouseup', this.stopTrackingMouseMovement);
    document.body.removeEventListener('blur', this.stopTrackingMouseMovement);
    document.body.removeEventListener('mouseout', this.stopTrackingMouseMovement);
  }

  updateCanvas() {
    if (!this.canvas) return;
    const { drawImageMetrics, Background } = this.props;
    const context = this.getCanvasContext();
    const canvasStyle = this.getCanvasStyle();

    context.clearRect(0, 0, canvasStyle.width, canvasStyle.height);
    updateBackground(context, canvasStyle, Background, drawImageMetrics);
  }

  render() {
    const style = this.getCanvasStyle();
    return (
      <div className="background-position" style={this.getCanvasContainerStyle()}>
        <canvas
          height={style.height}
          width={style.width}
          onMouseDown={this.mouseDown}
          ref={(canvas) => {
            if (canvas) this.canvas = canvas;
          }}
        />
      </div>
    );
  }
}
