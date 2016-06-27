'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ColorPicker from 'react-color';

import Store from '../store';
import { BACKGROUND_COLOR, BACKGROUND_IMAGE, backgroundColorChange,
  removeBackgroundImage, backgroundImageUpload } from '../actions/background';
import { attributionChange, attributionColorChange,
  attributionLocationChange } from '../actions/attribution';
import CornerPicker from './subcomponents/corner-picker';
import BackgroundPosition from './subcomponents/background-position';

export default class BackgroundOptions extends React.Component {

  static options = [BACKGROUND_IMAGE, BACKGROUND_COLOR];
  static AttributionColors = ['black', 'white'];

  constructor(props) {
    super(props);

    this.state = {
      showColorPicker: false,
    };
  }

  attributionColorCallback = (c) => {
    const color = c;
    return () => {
      Store.dispatch(attributionColorChange(color));
    };
  }

  updateAttribution = (e) => {
    Store.dispatch(attributionChange(e.target.value));
  }

  triggerFileUpload = () => {
    const input = ReactDOM.findDOMNode(this.refs['image-upload']);
    input.click();
  }

  handleFileUpload = () => {
    if (!('image-upload' in this.refs)) return;

    const input = ReactDOM.findDOMNode(this.refs['image-upload']);
    if (!input.files || !input.files.length) return;

    const file = input.files[0];
    Store.dispatch(backgroundImageUpload(file));
  }

  backgroundColorChange = (color) => {
    Store.dispatch(backgroundColorChange(`#${color.hex}`));
  }

  renderFileUploader() {
    const options = this.props.options;

    // If we already uploaded a file...
    let content = null;
    if (!!options.Background.backgroundImg.img) {
      content = (
        <div className="background-image">
          <BackgroundPosition options={options} />
        </div>
      );
    } else {
      content = (
        <div className="file-upload">
          <img
            id="image-upload-button"
            src="/img/upload.svg"
            onClick={this.triggerFileUpload}
            alt="Upload"
          />
          <input
            type="file"
            accept="img/*|image/*"
            ref="image-upload"
            id="image-upload"
            onChange={this.handleFileUpload}
          />
        </div>
      );
    }

    return content;
  }

  renderColorPicker() {
    const options = this.props.options;
    let style = {
      backgroundColor: options.Background.backgroundColor,
    };

    let colorPickerStyle = {
      position: 'absolute',
      top: '-100%',
      left: '-50%',
    };

    return (
      <div className="color-picker">
        <div
          className="swatch"
          style={style}
          onClick={() => { this.setState({ showColorPicker: true }); }}
        ></div>
        <div className="picker-container">
          <ColorPicker
            className="color-picker"
            type="compact"
            color={options.backgroundColor}
            display={this.state.showColorPicker}
            onChange={this.backgroundColorChange}
            onClose={() => { this.setState({ showColorPicker: false }); }}
            positionCSS={colorPickerStyle}
            key={'background-color-picker'}
          />
        </div>
      </div>
    );
  }

  renderBackgroundOption(option) {
    if (BackgroundOptions.options.indexOf(option) < 0) return null;

    const options = this.props.options;
    let className = `background-option ${option}`;
    let picker = null;
    let extra = null;
    switch (option) {
      case BACKGROUND_IMAGE:
        picker = this.renderFileUploader();
        if (options.Background.backgroundImg.img != null) {
          className += ' loaded';
          extra = (
            <div
              onClick={() => { Store.dispatch(removeBackgroundImage()); }}
              className="remove-image"
            >
              <i className="fa fa-times-circle"></i>
            </div>
          );
        }
        break;
      case BACKGROUND_COLOR:
      default:
        picker = this.renderColorPicker();
        break;
    }


    return (
      <div className={className}>
        <div className="picker">
          {picker}
        </div>
        {extra}
      </div>
    );
  }

  renderAttributionInput() {
    const options = this.props.options;
    if (options.Background.backgroundImg.img == null) return null;

    let attributionColorOptions = [];
    for (const color of BackgroundOptions.AttributionColors) {
      let optionClass = `color ${color}`;
      if (color === options.Attribution.attributionColor) optionClass += ' active';

      attributionColorOptions.push(
        <div className="color-container" key={`attribution-color-${color}`}>
          <div className={optionClass} onClick={this.attributionColorCallback(color)}></div>
        </div>
      );
    }

    return (
      <div className="attribution-container">
        <input
          type="text"
          onChange={this.updateAttribution}
          placeholder="Attribution"
          value={options.Background.backgroundImg.attribution || null}
        />
        <div className="attribution-options">
          <CornerPicker
            activeCorner={options.Attribution.attributionLocation}
            callback={(corner) => { Store.dispatch(attributionLocationChange(corner)); }}
          />
          <div className="color-picker attribution">
            <div className="color-options">
              {attributionColorOptions}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="background-options-container">
        <div className="title">Background</div>
        {this.renderBackgroundOption(BACKGROUND_COLOR)}
        {this.renderBackgroundOption(BACKGROUND_IMAGE)}
        {this.renderAttributionInput()}
      </div>
    );
  }
}

BackgroundOptions.propTypes = {
  options: React.PropTypes.shape(Store.getState()).isRequired,
};
