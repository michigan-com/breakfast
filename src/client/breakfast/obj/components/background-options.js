'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ColorPicker from 'react-color';

import OptionActions from '../../actions/options';
import { BACKGROUND_COLOR, BACKGROUND_IMAGE, BACKGROUND_LOADING } from '../../lib/constants';

var actions = new OptionActions();

export default class BackgroundOptions extends React.Component {

  static options = [ BACKGROUND_IMAGE, BACKGROUND_COLOR ];

  constructor(props) {
    super(props);

    this.state = {
      showColorPicker: false
    }
  }

  backgroundTypeCallback = (o) => {
    let option = o;
    return () => {
      actions.backgroundTypeChange(option);
    }
  }

  removeBackgroundImage = () => {
    actions.removeBackgroundImage();
  }

  triggerFileUpload = () => {
    let input = ReactDOM.findDOMNode(this.refs['image-upload']);
    input.click();
  }

  handleFileUpload = () => {
    if (!('image-upload' in this.refs)) return null;

    let input = ReactDOM.findDOMNode(this.refs['image-upload']);
    if (!input.files || !input.files.length) return null;

    let file = input.files[0];
    actions.backgroundImageFileChange(file);
  }

  backgroundColorChange = (color) => {
    actions.backgroundColorChange(`#${color.hex}`);
  }

  renderFileUploader() {
    let options = this.props.options;

    // If we already uploaded a file...
    if (options.backgroundImg.src) {
      return (
        <div className='background-image'>
          <img src={ options.backgroundImg.src } onClick={ this.backgroundTypeCallback(BACKGROUND_IMAGE) }/>
          <div onClick={ this.removeBackgroundImage } className='remove-image'><i className='fa fa-times-circle'></i></div>
        </div>
      )

    } else {
      return (
        <div className='file-upload'>
          <img id='image-upload-button' src='/img/upload.svg' onClick={ this.triggerFileUpload }/>
          <input type='file' accept='img/*|image/*' ref='image-upload' id='image-upload'
            onChange={ this.handleFileUpload }/>
        </div>
      )
    }
  }

  renderColorPicker() {
    let options = this.props.options;
    let style = {
      backgroundColor: options.backgroundColor
    }

    let colorPickerStyle = {
      position: 'absolute',
      top: '-100%',
      left: '-50%',
    }

    return (
      <div className='color-picker'>
        <div className='swatch' style={ style } onClick={ () => { this.setState({ showColorPicker: true }); } }></div>
        <div className='picker-container'>
          <ColorPicker className='color-picker' type='compact'
              color={ options.backgroundColor }
              display={ this.state.showColorPicker }
              onChange={ this.backgroundColorChange }
              onClose={ () => { this.setState({ showColorPicker: false }); } }
              positionCSS={ colorPickerStyle }
              key={ 'background-color-picker' }/>
        </div>
      </div>
    )
  }

  renderBackgroundOption(option) {
    if (BackgroundOptions.options.indexOf(option) < 0) return;

    let options = this.props.options;
    let picker = null;
    switch(option) {
      case BACKGROUND_IMAGE:
        picker = this.renderFileUploader();
        break;
      case BACKGROUND_COLOR:
        picker = this.renderColorPicker();
        break;
    }

    let className = `background-option ${option}`;
    let checked = null;
    if (options.backgroundType === option) {
      className += ' active';
      checked = true;
    }
    return (
      <div className={ className }>
        <div className='picker'>
          { picker }
        </div>
        <input type='checkbox' name={ `background-type-${option}` }
          defaultChecked={ checked }
          onClick={ this.backgroundTypeCallback(option) }/>
      </div>
    )
  }

  render() {
    return (
      <div className='background-options-container'>
        <div className='title'>Background</div>
        { this.renderBackgroundOption(BACKGROUND_COLOR) }
        { this.renderBackgroundOption(BACKGROUND_IMAGE) }
      </div>
    )
  }
}
