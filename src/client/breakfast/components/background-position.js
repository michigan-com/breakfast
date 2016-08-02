'use strict';

import React, { PropTypes } from 'react';

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
    this.imageWidth = 100; //
  }

  getOverlayStyle() {
    const { Background, canvas, drawImageMetrics } = this.props;
    const backgroundImg = Background.backgroundImg;
    const canvasAspectRatio = canvas.aspectRatio;
    const imageAspectRatio = backgroundImg.width / backgroundImg.height;
    if (drawImageMetrics == null) return null;

    const top = 0;
    const left = 0;
    let width;
    let height;
    if (imageAspectRatio < canvasAspectRatio) {
      width = this.imageWidth;
      height = width / canvasAspectRatio;
    } else {
      height = this.imageWidth / imageAspectRatio;
      width = height * canvasAspectRatio;
    }

    return { top, left, height, width };
  }

  getImageStyle() {
    const { Background, canvas, drawImageMetrics } = this.props;
    const backgroundImg = Background.backgroundImg;
    const imageAspectRatio = backgroundImg.width / backgroundImg.height;
    const overlayStyle = this.getOverlayStyle();

    const backgroundImage = `url(${Background.backgroundImg.img.src})`;
    const width = this.imageWidth;
    const height = this.imageWidth / imageAspectRatio;
    const top = (drawImageMetrics.dy / canvas.canvasHeight) * overlayStyle.height;
    const left = (drawImageMetrics.dx / canvas.canvasWidth) * overlayStyle.width;
    return { top, left, height, width, backgroundImage };
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
    const imageHeight = this.imageWidth / imageAspectRatio;

    const deltaXPercent = deltaX / this.imageWidth;
    const deltaYPercent = deltaY / imageHeight;

    const newDx = this.storedImageMetrics.dx + (deltaXPercent * canvas.canvasWidth);
    const newDy = this.storedImageMetrics.dy + (deltaYPercent * canvas.canvasHeight);
    this.props.updateDrawLocation(newDx, newDy);
  }

  trackMouseMovement = () => {
    document.body.addEventListener('mousemove', this.mouseMove);
    document.body.addEventListener('mouseup', this.stopTrackingMouseMovement);
    document.body.addEventListener('blur', this.stopTrackingMouseMovement);
  }

  stopTrackingMouseMovement = () => {
    this.clickedMouseX = 0;
    this.clickedMouseY = 0;
    document.body.removeEventListener('mousemove', this.mouseMove);
    document.body.removeEventListener('mouseup', this.stopTrackingMouseMovement);
    document.body.removeEventListener('blur', this.stopTrackingMouseMovement);
  }


  renderPositionOverlay() {
    let style = this.getOverlayStyle();
    style.width = `${style.width}px`;
    style.height = `${style.height}px`;
    return (
      <div className="overlay" style={style}></div>
    );
  }


  render() {
    let imageStyle = this.getImageStyle();
    return (
      <div
        className="background-position"
        onMouseDown={this.mouseDown}
        style={this.getOverlayStyle()}
      >
        <div className="background-image" style={imageStyle}></div>
        {this.renderPositionOverlay()}
      </div>
    );
  }
}
