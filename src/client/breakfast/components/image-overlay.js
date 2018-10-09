'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const MOVE_TYPE_POS = 'pos';
const MOVE_TYPE_SIZE = 'size';

export default class ImageOverlay extends React.Component {
  static propTypes = {
    image: PropTypes.object,
    canvas: PropTypes.object,
    imageIndex: PropTypes.number.isRequired,
    updateImage: PropTypes.func,
    activateImage: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      moving: false,

      lastMouseX: 0,
      lastMouseY: 0,

      originalImage: { ...this.props.image.img },
    };

    this.startMoving = this.startMoving.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
  }


  startMoving(type) {
    return (e) => {
      this.props.activateImage(this.props.imageIndex);

      e.stopPropagation();
      e.preventDefault();
      const clientX = e.clientX || e.changedTouches[0].clientX;
      const clientY = e.clientY || e.changedTouches[0].clientY;

      this.trackingTarget = e.target;
      this.trackMouseMovement(type);
      this.setState({
        moving: true,
        lastMouseX: clientX,
        lastMouseY: clientY,

        originalImage: { ...this.props.image },
      });
    };
  }

  mouseUp = () => {
    this.stopTrackingMouseMovement();
    this.setState({ moving: false });
  }

  mouseMove = (type) => {
    return (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!this.state.moving) return;

      const { canvas } = this.props;

      const clientX = e.clientX || e.changedTouches[0].clientX;
      const clientY = e.clientY || e.changedTouches[0].clientY;

      const movementX = clientX - this.state.lastMouseX;
      const movementY = clientY - this.state.lastMouseY;
      const movementXPercent = movementX / (canvas.canvasWidth / 2);
      const movementYPercent = movementY / (canvas.canvasHeight / 2);

      // Figure out what to do with the new found information
      switch (type) {
        case MOVE_TYPE_POS: {
          const dx = this.state.originalImage.dx + movementX;
          const dy = this.state.originalImage.dy + movementY;

          this.props.updateImage(this.props.imageIndex, { dx, dy });
          break;
        }
        case MOVE_TYPE_SIZE:
        default: {
          // cause we're scaled up, divide by two
          const aspectRatio = this.state.originalImage.width / this.state.originalImage.height;

          const height = this.state.originalImage.height + movementYPercent;
          const width = aspectRatio * height;

          if ((height * canvas.canvasHeight) < 20) return;

          this.props.updateImage(this.props.imageIndex, { height, width });
          break;
        }
      }
    };
  }

  trackMouseMovement = (type) => {
    this.mouseMoveCallback = this.mouseMove(type);
    document.body.addEventListener('mousemove', this.mouseMoveCallback);
    document.body.addEventListener('touchmove', this.mouseMoveCallback);
    document.body.addEventListener('mouseup', this.mouseUp);
    document.body.addEventListener('touchend', this.mouseUp);
    document.body.addEventListener('blur', this.stopTrackingMouseMovement);
  }

  stopTrackingMouseMovement = () => {
    document.body.removeEventListener('mousemove', this.mouseMoveCallback);
    document.body.removeEventListener('touchmove', this.mouseMoveCallback);
    document.body.removeEventListener('mouseup', this.mouseUp);
    document.body.removeEventListener('touchend', this.mouseUp);
    document.body.removeEventListener('blur', this.stopTrackingMouseMovement);
  }

  render() {
    const { image, canvas, imageIndex, activeImageIndex } = this.props;
    const style = {
      height: `${canvas.canvasHeight * image.height}px`,
      width: `${canvas.canvasHeight * image.width}px`,
      top: image.dy,
      left: image.dx,
      zIndex: imageIndex,
    };

    const imageOverlayClass = ['image-overlay-container'];
    if (imageIndex === activeImageIndex) imageOverlayClass.push('active');

    return (
      <div
        className={imageOverlayClass.join(' ')}
        style={style}
        ref={(d) => { this.container = d; }}
      >
        {/* <div
          className="size-control top left"
          onMouseDown={this.startMoving(MOVE_TYPE_SIZE)}
          onTouchStart={this.startMoving(MOVE_TYPE_SIZE)}
        ></div>
        <div
          className="size-control top right"
          onMouseDown={this.startMoving(MOVE_TYPE_SIZE)}
          onTouchStart={this.startMoving(MOVE_TYPE_SIZE)}
        ></div>
        <div
          className="size-control bottom left"
          onMouseDown={this.startMoving(MOVE_TYPE_SIZE)}
          onTouchStart={this.startMoving(MOVE_TYPE_SIZE)}
        ></div>*/}
        <div
          className="size-control bottom right"
          onMouseDown={this.startMoving(MOVE_TYPE_SIZE)}
          onTouchStart={this.startMoving(MOVE_TYPE_SIZE)}
        ><i className="fa fa-arrows-h"></i></div>
        <div
          className="image-container"
          onMouseDown={this.startMoving(MOVE_TYPE_POS)}
          onTouchStart={this.startMoving(MOVE_TYPE_POS)}
        >
          <img src={image.img.src} />
        </div>
      </div>
    );
  }
}
