'use strict';

import { connect } from 'react-redux';

import Canvas from '../components/canvas';
import { canvasMetricsSelector, drawImageMetricsSelector } from '../selectors/background';
import { getPresentState } from '../selectors/present';
import { blockStyleMetricsSelector } from '../selectors/text';

function mapStateToProps(state) {
  const canvas = canvasMetricsSelector(state);
  const drawImageMetrics = drawImageMetricsSelector(state);
  const blockTypeStyle = blockStyleMetricsSelector(state);
  return { ...getPresentState(state), canvas, drawImageMetrics, blockTypeStyle };
}

const connectOptions = {
  withRef: true,
};

export default connect(mapStateToProps, {}, undefined, connectOptions)(Canvas);
