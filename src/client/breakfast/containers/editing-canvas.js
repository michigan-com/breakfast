'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TextOverlay from './text-overlay';
import Canvas from './canvas';

class EditingCanvas extends Component {
  static propTypes = {
    state: PropTypes.object,
    textContent: PropTypes.string,
  };

  getTextContent() {
    return this.refs['text-overlay'].getTextContent();
  }

  render() {
    let className = 'image';
    let { state } = this.props;

    // Have to scale down for better UI
    let style = {
      width: state.Background.canvas.canvasWidth / 2,
      height: state.Background.canvas.canvasHeight / 2,
    };

    return (
      <div className={className} style={style} ref="image">
        <Canvas options={state} textContent={this.props.textContent} ref="canvas" />
        <TextOverlay options={state} ref="text-overlay" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { state };
}

const connectOptions = {
  withRef: true,
};

export default connect(mapStateToProps, {}, undefined, connectOptions)(EditingCanvas);
