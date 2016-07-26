'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { BACKGROUND_COLOR, BACKGROUND_IMAGE, backgroundColorChange,
  removeBackgroundImage, backgroundImageUpload, updateDrawLocation } from '../actions/background';
import { attributionChange, attributionColorChange,
  attributionLocationChange } from '../actions/attribution';
import CornerPicker from '../components/corner-picker';
import BackgroundPosition from '../components/background-position';

// TODO component-ize
class BackgroundOptions extends React.Component {

  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    Background: React.PropTypes.object.isRequired,
    Attribution: React.PropTypes.object.isRequired,
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
    const input = ReactDOM.findDOMNode(this.refs['image-upload']);
    input.click();
  }

  handleFileUpload = () => {
    if (!('image-upload' in this.refs)) return;

    const input = ReactDOM.findDOMNode(this.refs['image-upload']);
    if (!input.files || !input.files.length) return;

    const file = input.files[0];
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
        <div className="background-image">
          <BackgroundPosition
            Background={Background}
            updateDrawLocation={this.props.actions.updateDrawLocation}
          />
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
    const { Background } = this.props;
    let style = {
      backgroundColor: Background.backgroundColor,
    };

    let picker = null;
    if (this.state.showColorPicker) {
      const coverStyle = {
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      };
      const poppoverStyle = {
        position: 'absolute',
        zIndex: '2',
      };
      picker = (
        <div style={poppoverStyle}>
          <div style={coverStyle} onClick={() => { this.setState({ showColorPicker: false }); }} />
          <CompactPicker
            className="color-picker"
            color={Background.backgroundColor}
            display={this.state.showColorPicker}
            onChange={this.backgroundColorChange}
            onClose={() => { this.setState({ showColorPicker: false }); }}
            key={'background-color-picker'}
          />
        </div>

      );
    }

    return (
      <div className="color-picker">
        <div
          className="swatch"
          style={style}
          onClick={() => { this.setState({ showColorPicker: true }); }}
        ></div>
        <div className="picker-container">
          {picker}
        </div>
      </div>
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
            <div
              onClick={() => { this.props.actions.removeBackgroundImage(); }}
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

function mapStateToProps(state) {
  const { Background, Attribution } = state;
  return { Background, Attribution };
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
      updateDrawLocation,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundOptions);
