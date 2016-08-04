'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TextOverlay from './text-overlay';
import Canvas from './canvas';
import { canvasMetricsSelector } from '../selectors/background';

class EditingCanvas extends Component {
  static propTypes = {
    canvas: PropTypes.object,
    Background: PropTypes.object,
    Text: PropTypes.object,
  };

  render() {
    const { canvas, Text } = this.props;
    const { textContainers } = Text;
    let className = 'image';

    // Have to scale down for better UI
    let style = {
      width: canvas.canvasWidth / 2,
      height: canvas.canvasHeight / 2,
    };

    return (
      <div className={className} style={style} ref="image">
        <Canvas ref="canvas" />

        {textContainers.map((container, index) => {
          if (!container.display) return null;
          return (
            <TextOverlay
              textContainerOptions={container}
              textContainerIndex={index}
              key={`text-container-${index}`}
            />
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Background, Text } = state;
  const canvas = canvasMetricsSelector(state);
  return { Background, Text, canvas };
}

export default connect(mapStateToProps)(EditingCanvas);
