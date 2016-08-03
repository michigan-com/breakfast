'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { doneDownloading } from '../actions/downloading';
import OptionsMenu from './options-menu';
import EditingCanvas from './editing-canvas';
import DownloadCanvas from './download-canvas';

class App extends Component {
  static propTypes = {
    Downloading: PropTypes.object,
    Background: PropTypes.object,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.editingCanvas = null;
  }

  render() {
    const { downloading, filename } = this.props.Downloading;
    let downloadCanvas = null;
    if (downloading) {
      downloadCanvas = (
        <div id="download-canvas">
          <DownloadCanvas
            fileName={filename || 'pic'}
            downloadCallback={this.props.actions.doneDownloading}
          />
        </div>
      );
    }

    return (
      <div>
        <OptionsMenu />
        <div className="pic-editor">
          <div className="image-container">
            <EditingCanvas
              ref={(canvas) => {
                if (canvas) this.editingCanvas = canvas;
              }}
            />
          </div>
        </div>
        {downloadCanvas}
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { Downloading, Background } = state;
  return { Downloading, Background };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      doneDownloading,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
