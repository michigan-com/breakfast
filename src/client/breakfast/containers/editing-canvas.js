'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TextOverlay from './text-overlay';
import Canvas from './canvas';
import { canvasMetricsSelector } from '../selectors/background';

class EditingCanvas extends Component {
  static propTypes = {
    canvas: PropTypes.object,
    textContent: PropTypes.string,
    Background: PropTypes.object,
    Text: PropTypes.object,
  };

  getTextContent() {
    return this.refs['text-overlay'].refs.wrappedInstance.getTextContent();
  }

  render() {
    const { textContent, canvas, Text } = this.props;
    let className = 'image';

    // Have to scale down for better UI
    let style = {
      width: canvas.canvasWidth / 2,
      height: canvas.canvasHeight / 2,
    };

    return (
      <div className={className} style={style} ref="image">
        <Canvas
          textContent={textContent}
          ref="canvas"
        />
        <TextOverlay textContainerOptions={Text.textContainers[0]} ref="text-overlay" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Background, Text } = state;
  const canvas = canvasMetricsSelector(state);
  return { Background, Text, canvas };
}

const connectOptions = {
  withRef: true,
};

export default connect(mapStateToProps, {}, undefined, connectOptions)(EditingCanvas);
