'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TextOverlay from './text-overlay';
import ImageOverlay from '../components/image-overlay';
import Canvas from './canvas';
import { canvasMetricsSelector } from '../selectors/background';
import { getPresentState } from '../selectors/present';
import { setActiveTextContainerIndex } from '../actions/text';
import { updateImage, activateImage } from '../actions/uploads';

class EditingCanvas extends Component {
  static propTypes = {
    canvas: PropTypes.object,
    Text: PropTypes.object,
    Uploads: PropTypes.object,
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
    const { canvas, Text, Uploads } = this.props;
    const { textContainers, activeContainerIndex } = Text;
    const { images, activeImageIndex } = Uploads;
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

        <div className="images-container">
          {
            images.map((img, index) => (
              <ImageOverlay
                image={img}
                imageIndex={index}
                updateImage={this.props.actions.updateImage}
                activateImage={this.props.actions.activateImage}
                activeImageIndex={activeImageIndex}
                canvas={canvas}
                key={`image-overlay-${index}`}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Text, Uploads } = getPresentState(state);
  const canvas = canvasMetricsSelector(state);
  return { Text, Uploads, canvas };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      setActiveTextContainerIndex,
      updateImage,
      activateImage,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditingCanvas);
