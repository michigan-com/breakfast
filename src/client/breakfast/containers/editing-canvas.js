'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TextOverlay from './text-overlay';
import Canvas from './canvas';
import { canvasMetricsSelector } from '../selectors/background';
import { getPresentState } from '../selectors/present';
import { setActiveTextContainerIndex } from '../actions/text';

class EditingCanvas extends Component {
  static propTypes = {
    canvas: PropTypes.object,
    Text: PropTypes.object,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.deactivateTextContainers = this.deactivateTextContainers.bind(this);
  }

  deactivateTextContainers() {
    this.props.actions.setActiveTextContainerIndex(-1);
  }

  render() {
    const { canvas, Text } = this.props;
    const { textContainers, activeContainerIndex } = Text;
    let className = 'image';

    // Have to scale down for better UI
    let style = {
      width: canvas.canvasWidth / 2,
      height: canvas.canvasHeight / 2,
    };

    return (
      <div className={className} style={style} ref="image">
        <Canvas
          onCanvasClick={this.deactivateTextContainers}
          ref="canvas"
        />
        {textContainers.map((container, index) => {
          if (!container.display) return null;
          return (
            <TextOverlay
              textContainerOptions={container}
              textContainerIndex={index}
              activeContainerIndex={activeContainerIndex}
              key={`text-container-${index}`}
            />
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Text } = getPresentState(state);
  const canvas = canvasMetricsSelector(state);
  return { Text, canvas };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      setActiveTextContainerIndex,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditingCanvas);
