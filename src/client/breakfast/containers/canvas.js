'use strict';

import { connect } from 'react-redux';

import Canvas from '../components/canvas';
import { canvasMetricsSelector, drawImageMetricsSelector } from '../selectors/background';
import { getPresentState } from '../selectors/present';

function mapStateToProps(state) {
  const canvas = canvasMetricsSelector(state);
  const drawImageMetrics = drawImageMetricsSelector(state);
  return { ...getPresentState(state), canvas, drawImageMetrics };
}

const connectOptions = {
  withRef: true,
};

export default connect(mapStateToProps, {}, undefined, connectOptions)(Canvas);
