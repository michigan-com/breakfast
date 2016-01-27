'use strict';

import React from 'react';

import { SIXTEEN_NINE, TWO_ONE, FIT_IMAGE, FACEBOOK, FACEBOOK_COVER, BACKGROUND_LOADING,
  BACKGROUND_IMAGE, BACKGROUND_COLOR } from '../util/constants';
import TextOverlay from './subcomponents/text-overlay';
import Canvas from './subcomponents/canvas';
import { Select } from '../../util/components';

export default class EditingCanvas extends React.Component {

  getTextContent() {
    return this.refs['text-overlay'].getTextContent();
  }

  render() {
    let className = 'image';
    let options = this.props.options;

    let style = {
      width: options.canvas.canvasWidth
    }

    return (
      <div className={ className } style={ style } ref='image'>
        <Canvas options={ options } textContent={ this.props.textContent } ref='canvas'/>
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
