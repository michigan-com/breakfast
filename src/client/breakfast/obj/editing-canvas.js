'use strict';

import React from 'react';
import ReactCanvas from 'react-canvas';

import { clone } from '../lib/parse';
import { SIXTEEN_NINE, TWO_ONE, FIT_IMAGE, FACEBOOK, FACEBOOK_COVER, BACKGROUND_LOADING,
  BACKGROUND_IMAGE, BACKGROUND_COLOR } from '../lib/constants';
import TextOverlay from './text-overlay';
import Canvas from './components/canvas';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var measureText = ReactCanvas.measureText;
var Layer = ReactCanvas.Layer;

export default class EditingCanvas extends React.Component {

  getTextContent() {
    return this.refs['text-overlay'].getTextContent();
  }

  mouseDown(e) {
    //if (this.props.content.type !== 'watermark' || !this.props.options.backgroundImg.src) return;

    this.setState({
      mouseDown: true,
      lastMouseX: e.clientX,
      lastMouseY: e.clientY
    });
  }

  mouseUp(e) {
    this.setState({ mouseDown: false });
  }

  mouseMove(e) {
    if (!this.state.mouseDown) return;

    let movementX = this.state.lastMouseX - e.clientX;
    let movementY = this.state.lastMouseY - e.clientY;
    let newTop = this.state.textPos.top - movementY;
    let newLeft = this.state.textPos.left - movementX;

    this.setState({
      textPos: {
        top: newTop,
        left: newLeft
      },
      lastMouseX: e.clientX,
      lastMouseY: e.clientY
    });
  }

  render() {
    let className = 'image';

    return (
      <div className={ className }
          onMouseDown={ this.mouseDown.bind(this) }
          onMouseUp={ this.mouseUp.bind(this) }
          onMouseMove={ this.mouseMove.bind(this) }
          onMouseEnter={ () => { this.setState({ mouseHover: true }); } }
          onMouseLeave={ () => { this.setState({ mouseHover: false }); } }
          ref='image'>
        <Canvas fontSize={ this.props.fontSize }
            options={ this.props.options }
            textContent={ this.props.textContent }
            ref='canvas'/>
        <TextOverlay content={ this.props.content } options={ this.props.options } ref='text-overlay'/>
      </div>
    )
  }
}
