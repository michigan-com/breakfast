'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from 'redux-undo';

import { doneDownloading } from '../actions/downloading';
import { getPresentState } from '../selectors/present';
import { showRepositioning } from '../actions/nav';
import OptionsMenu from './options-menu';
import EditingCanvas from './editing-canvas';
import DownloadCanvas from './download-canvas';
import BackgroundPosition from './background-position';

class App extends Component {
  static propTypes = {
    Downloading: PropTypes.object,
    Background: PropTypes.object,
    Nav: PropTypes.object,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.editingCanvas = null;
  }

  renderRespositionButton() {
    const { Background } = this.props;
    if (Background.backgroundImg.img === null) return null;

    return (
      <div className="reposition-button-container">
        <div className="reposition-button" onClick={this.props.actions.showRepositioning}>
          <div className="image-container">
            <img src="/img/reposition.svg" alt="reposition" />
            <div className="text">Reposition</div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { Background, Downloading, Nav } = this.props;
    const { downloading, filename } = Downloading;
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

    if (Nav.showRepositioning) {
      return <BackgroundPosition />;
    }


    return (
      <div>
        <OptionsMenu />

        <div className="pic-editor">
          <div className="undo-container">
            <div className="undo-button" onClick={this.props.actions.redo}>
              <div className="image-container">
                <img src="/img/redo.svg" alt="Undo" />
              </div>
              <div className="text">Redo</div>
            </div>
            <div className="undo-button" onClick={this.props.actions.undo}>
              <div className="image-container">
                <img src="/img/undo.svg" alt="Undo" />
              </div>
              <div className="text">Undo</div>
            </div>
          </div>
          <div className="image-container">
            <EditingCanvas
              ref={(canvas) => {
                if (canvas) this.editingCanvas = canvas;
              }}
            />
          </div>
          {this.renderRespositionButton()}
        </div>
        {downloadCanvas}
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { Downloading, Background, Nav } = getPresentState(state);
  return { Downloading, Background, Nav };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      doneDownloading,
      showRepositioning,
      undo: ActionCreators.undo,
      redo: ActionCreators.redo,
    }, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
