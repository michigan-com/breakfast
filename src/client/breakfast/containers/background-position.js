'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getPresentState } from '../selectors/present';
import { canvasMetricsSelector, drawImageMetricsSelector } from '../selectors/background';
import { updateDrawLocation, updateBackgroundZoom } from '../actions/background';
import { hideRepositioning } from '../actions/nav';
import BackgroundPosition from '../components/background-position';

class BackgroundPositionContainer extends Component {
  static propTypes = {
    Background: PropTypes.object,
    actions: PropTypes.object,
    canvas: PropTypes.object,
    drawImageMetrics: PropTypes.object,
  }


  updateBackgroundZoom = (e) => {
    const zoom = e.target.value;
    this.props.actions.updateBackgroundZoom(zoom);
  }

  render() {
    const { Background, canvas, drawImageMetrics } = this.props;

    return (
      <div className="background-position-container">
        <div className="zoom-container">
          <div className="label">Zoom</div>
          <input
            type="range" min="-100" max="100"
            value={Background.backgroundZoom}
            onChange={this.updateBackgroundZoom}
          />
        </div>
        <div className="background-image">
          <div className="instructions">Click and drag on the image to position it</div>
          <BackgroundPosition
            Background={Background}
            updateDrawLocation={this.props.actions.updateDrawLocation}
            canvas={canvas}
            drawImageMetrics={drawImageMetrics}
          />
        </div>
        <div className="close-background-position-container">
          <div className="close-background-position" onClick={this.props.actions.hideRepositioning}>
            Back
          </div>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Background } = getPresentState(state);
  const canvas = canvasMetricsSelector(state);
  const drawImageMetrics = drawImageMetricsSelector(state);
  return { Background, canvas, drawImageMetrics };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      updateDrawLocation,
      hideRepositioning,
      updateBackgroundZoom,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundPositionContainer);
