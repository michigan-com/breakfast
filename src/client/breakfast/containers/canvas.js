'use strict';

import { connect } from 'react-redux';

import Canvas from '../components/canvas';

function mapStateToProps(state) {
  return { ...state };
}

const connectOptions = {
  withRef: true,
};

export default connect(mapStateToProps, {}, undefined, connectOptions)(Canvas);
