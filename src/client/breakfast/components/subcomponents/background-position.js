'use strict';

import React from 'react';
import assign from 'object-assign';

import Store from '../../store';
import { updateDrawLocation } from '../../actions/background';

export default class BackgroundPosition extends React.Component {
  constructor(props) {
    super(props);
    this.storedImageMetrics = null;
    this.clickedMouseX = 0;
    this.clickedMouseY = 0;
    this.imageWidth = 100; //
  }

  mouseDown = (e) => {
    this.clickedMouseX = e.clientX;
    this.clickedMouseY = e.clientY;
    this.storedImageMetrics = assign({}, this.props.options.Background.drawImageMetrics);
    this.trackMouseMovement();
  }

  mouseMove = (e) => {
    let options = this.props.options;
    let deltaX = e.clientX - this.clickedMouseX;
    let deltaY = e.clientY - this.clickedMouseY;
    let canvas = options.Background.canvas;
    let backgroundImg = options.Background.backgroundImg;
    let imageAspectRatio = backgroundImg.width / backgroundImg.height;
    let canvasAspectRatio = options.Background.canvas.aspectRatio;
    let imageHeight = this.imageWidth / imageAspectRatio;
    let style = this.getOverlayStyle();

    let deltaXPercent = deltaX / this.imageWidth;
    let deltaYPercent = deltaY / imageHeight;

    let newDx = this.storedImageMetrics.dx + (deltaXPercent * canvas.canvasWidth);
    let newDy = this.storedImageMetrics.dy + (deltaYPercent * canvas.canvasHeight);
    Store.dispatch(updateDrawLocation(newDx, newDy));
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

  getOverlayStyle() {
    let options = this.props.options;
    let backgroundImg = options.Background.backgroundImg;
    let drawImageMetrics = options.Background.drawImageMetrics;
    let canvasAspectRatio = options.Background.canvas.aspectRatio;
    let imageAspectRatio = backgroundImg.width / backgroundImg.height;
    if (drawImageMetrics == null) return null;

    let top = 0, left = 0, width, height;
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
    let options = this.props.options;
    let drawImageMetrics = options.Background.drawImageMetrics;
    let canvas = options.Background.canvas;
    let backgroundImg = options.Background.backgroundImg;
    let imageAspectRatio = backgroundImg.width / backgroundImg.height;
    let overlayStyle = this.getOverlayStyle();

    let top, left, height, width;
    let backgroundImage = `url(${options.Background.backgroundImg.img.src})`;

    width = this.imageWidth;
    height = this.imageWidth / imageAspectRatio;
    top = (drawImageMetrics.dy / canvas.canvasHeight) * overlayStyle.height;
    left = (drawImageMetrics.dx / canvas.canvasWidth) * overlayStyle.width;
    return { top, left, height, width, backgroundImage };
  }

  renderPositionOverlay() {
    let style = this.getOverlayStyle();
    style.width = `${style.width}px`;
    style.height = `${style.height}px`;
    return (
      <div className='overlay' style={ style }></div>
    )
  }


  render() {
    let options = this.props.options;

    let imageStyle = this.getImageStyle();
    return (
      <div className='background-position' onMouseDown={ this.mouseDown } style={ this.getOverlayStyle() }>
        <div className='background-image' style={ imageStyle }></div>
        { this.renderPositionOverlay() }
      </div>
    )
  }
}
