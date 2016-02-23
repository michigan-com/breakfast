'use strict';

import React from 'react';
import assign from 'object-assign';

import Store from '../../store';
import { updateBackgroundSx, updateBackgroundSy } from '../../actions/background';

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
    let backgroundImg = options.Background.backgroundImg;
    let imageAspectRatio = backgroundImg.width / backgroundImg.height;
    let canvasAspectRatio = options.Background.canvas.aspectRatio;
    let imageHeight = this.imageWidth / imageAspectRatio;
    let style = this.getOverlayStyle();

    // Fixed height, only care about deltaX
    if (imageAspectRatio > canvasAspectRatio) {
      let deltaPercent = deltaX / this.imageWidth;
      let newSx = this.storedImageMetrics.sx + (deltaPercent * backgroundImg.width);
      console.log(deltaPercent, newSx);
      Store.dispatch(updateBackgroundSx(Math.round(newSx)));
    } else {
      let deltaPercent = deltaY / imageHeight;
      let newSy = this.storedImageMetrics.sy + (deltaPercent * backgroundImg.height);
      Store.dispatch(updateBackgroundSy(Math.round(newSy)));
    }
  }

  trackMouseMovement = () => {
    document.body.addEventListener('mousemove', this.mouseMove);
    document.body.addEventListener('mouseup', this.stopTrackingMouseMovement);
  }

  stopTrackingMouseMovement = () => {
    this.clickedMouseX = 0;
    this.clickedMouseY = 0;
    document.body.removeEventListener('mousemove', this.mouseMove);
    document.body.removeEventListener('mouseup', this.stopTrackingMouseMovement);
  }

  getOverlayStyle() {
    let options = this.props.options;
    let backgroundImg = options.Background.backgroundImg;
    let drawImageMetrics = options.Background.drawImageMetrics;
    let canvasAspectRatio = options.Background.canvas.aspectRatio;
    let imageAspectRatio = backgroundImg.width / backgroundImg.height;
    if (drawImageMetrics == null) return null;

    let top = (drawImageMetrics.sy / backgroundImg.height) * 100;
    let left = (drawImageMetrics.sx / backgroundImg.width) * 100;
    let width, height;
    if (imageAspectRatio > canvasAspectRatio) {
      height = 100;

      let widthDrawn = drawImageMetrics.sWidth / backgroundImg.width;
      width = 100 * widthDrawn;
    } else {
      width = 100;

      let heightDrawn = drawImageMetrics.sHeight / backgroundImg.height;
      height = 100 * heightDrawn;
    }

    return { top, left, height, width };
  }

  renderPositionOverlay() {
    let style = this.getOverlayStyle();
    style.width = `${style.width}%`;
    style.height = `${style.height}%`;
    return (
      <div className='overlay' onMouseDown={ this.mouseDown } style={ style }></div>
    )
  }

  render() {
    let options = this.props.options;

    let imageAspectRatio = options.Background.backgroundImg.width / options.Background.backgroundImg.height;
    let width = this.imageWidth;
    let height = width / imageAspectRatio;
    let style = { width, height }

    return (
      <div className='background-position' style={ style }>
        <img src={ options.Background.backgroundImg.img.src }/>
        { this.renderPositionOverlay() }
      </div>
    )
  }
}
