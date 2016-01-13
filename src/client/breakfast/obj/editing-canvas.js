'use strict';

import React from 'react';

import { clone } from '../lib/parse';
import { SIXTEEN_NINE, TWO_ONE, FIT_IMAGE, FACEBOOK, FACEBOOK_COVER, BACKGROUND_LOADING,
  BACKGROUND_IMAGE, BACKGROUND_COLOR } from '../lib/constants';
import TextOverlay from './components/text-overlay';
import Canvas from './components/canvas';
import { Select } from '../../util/components';

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
    let options = this.props.options;

    let style = {
      width: options.canvas.canvasWidth
    }

    return (
      <div className={ className } style={ style } ref='image'>
        <Canvas fontSize={ this.props.fontSize }
            options={ options }
            textContent={ this.props.textContent }
            ref='canvas'/>
        <TextOverlay options={ options } ref='text-overlay'/>
      </div>
    )
  }
}

class LogoSelect extends Select {
  constructor(args) {
    super(args);

    this.htmlClass = 'logo-select';
  }

  getDisplayValue(option, index) {
    return (
      <img src={ `/logos/${option.filename}`} title={ option.name } alt={ option.name }/>
    )
  }
}
