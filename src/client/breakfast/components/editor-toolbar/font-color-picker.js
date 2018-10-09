'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CompactPicker } from 'react-color';

export default class FontColorPicker extends Component {
  static propTypes = {
    currentColor: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    currentColor: '#000000',
  };

  constructor(props) {
    super(props);

    this.state = {
      showColorPicker: false,
    };

    this.toggleColorPicker = this.toggleColorPicker.bind(this);
  }

  toggleColorPicker() {
    let { showColorPicker } = this.state;
    showColorPicker = !showColorPicker;
    this.setState({ showColorPicker });
  }

  renderColorPicker() {
    if (!this.state.showColorPicker) return null;
    const { currentColor } = this.props;
    const coverStyle = {
      position: 'fixed',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    };

    return (
      <div className="color-picker-container">
        <div style={coverStyle} onClick={this.toggleColorPicker}></div>
        <CompactPicker
          color={currentColor}
          onChange={this.props.onChange}
        />
      </div>
    );
  }

  render() {
    const { currentColor } = this.props;
    const style = {
      backgroundColor: currentColor,
    };
    return (
      <div className="font-color-picker">
        <div onClick={this.toggleColorPicker} className="swatch" style={style}></div>
        {this.renderColorPicker()}
      </div>
    );
  }
}
