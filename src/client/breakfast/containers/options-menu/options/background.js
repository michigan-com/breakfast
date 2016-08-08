'use strict';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CompactPicker } from 'react-color';
import Dropzone from 'react-dropzone';

import { BACKGROUND_COLOR, BACKGROUND_IMAGE, backgroundColorChange,
  removeBackgroundImage, backgroundImageUpload } from '../../../actions/background';
import { attributionChange, attributionColorChange,
  attributionLocationChange } from '../../../actions/attribution';
import CornerPicker from '../../../components/corner-picker';
import { drawImageMetricsSelector } from '../../../selectors/background';
import { getPresentState } from '../../../selectors/present';

class BackgroundOptions extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    Background: PropTypes.object.isRequired,
    Attribution: PropTypes.object.isRequired,
  }
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
      this.props.actions.attributionColorChange(color);
    };
  }

  updateAttribution = (e) => {
    this.props.actions.attributionChange(e.target.value);
  }

  triggerFileUpload = () => {
    const input = findDOMNode(this.refs['image-upload']);
    input.click();
  }

  handleFileUpload = (files) => {
    const file = files[0];
    this.props.actions.backgroundImageUpload(file);
  }

  backgroundColorChange = (color) => {
    this.props.actions.backgroundColorChange(`${color.hex}`);
  }

  renderFileUploader() {
    const { Background } = this.props;

    // If we already uploaded a file...
    let content = null;
    if (!!Background.backgroundImg.img) {
      content = (
        <img src={Background.backgroundImg.img.src} alt="background" />
      );
    } else {
      const dropzoneStyle = {
        width: '90%',
        margin: '0 auto',
        height: '100px',
        border: '2px dashed black',
      };
      content = (
        <div className="file-upload">
          <Dropzone
            onDropAccepted={this.handleFileUpload}
            multiple={false}
            accept="image/*"
            style={dropzoneStyle}
          >
            <p>DRAG & DROP</p>
            <p>your file or click to browse</p>
          </Dropzone>
        </div>
      );
    }

    return content;
  }

  renderColorPicker() {
    const { Background } = this.props;
    return (
      <CompactPicker
        className="color-picker"
        color={Background.backgroundColor}
        onChange={this.backgroundColorChange}
        key={'background-color-picker'}
      />
    );
  }

  renderBackgroundOption(option) {
    if (BackgroundOptions.options.indexOf(option) < 0) return null;

    const { Background } = this.props;
    let className = `background-option ${option}`;
    let picker = null;
    let extra = null;
    switch (option) {
      case BACKGROUND_IMAGE:
        picker = this.renderFileUploader();
        if (Background.backgroundImg.img != null) {
          className += ' loaded';
          extra = (
            <div className="remove-image" onClick={this.props.actions.removeBackgroundImage}>
              Remove Background Image
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
    const { Background, Attribution } = this.props;
    if (Background.backgroundImg.img == null) return null;

    let attributionColorOptions = [];
    for (const color of BackgroundOptions.AttributionColors) {
      let optionClass = `color ${color}`;
      if (color === Attribution.attributionColor) optionClass += ' active';

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
          value={Background.backgroundImg.attribution || null}
        />
        <div className="attribution-options">
          <CornerPicker
            activeCorner={Attribution.attributionLocation}
            callback={(corner) => { this.props.actions.attributionLocationChange(corner); }}
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
    const { Background } = this.props;
    let attributionInput = null;
    if (Background.backgroundImg.img !== null) {
      attributionInput = (
        <div className="option-container">
          <div className="option-container-title">Photographer Attribution</div>
          {this.renderAttributionInput()}
        </div>
      );
    }
    return (
      <div className="background-options-container">
        <div className="option-container">
          <div className="option-container-title">Background Image</div>
          {this.renderBackgroundOption(BACKGROUND_IMAGE)}
        </div>
        {attributionInput}
        <div className="option-container">
          <div className="option-container-title">Background Color</div>
          {this.renderBackgroundOption(BACKGROUND_COLOR)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Background, Attribution } = getPresentState(state);
  const drawImageMetrics = drawImageMetricsSelector(state);
  return { Background, Attribution, drawImageMetrics };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      attributionColorChange,
      attributionChange,
      backgroundImageUpload,
      backgroundColorChange,
      removeBackgroundImage,
      attributionLocationChange,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundOptions);
