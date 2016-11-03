
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { doneDownloading } from '../actions/downloading';
import { getPresentState } from '../selectors/present';
import { canvasMetricsSelector } from '../selectors/background';
import { showRepositioning } from '../actions/nav';
import OptionsMenu from './options-menu';
import EditingCanvas from './editing-canvas';
import DownloadCanvas from './download-canvas';
import BackgroundPosition from './background-position';

class PhotoEditor extends Component {
  static propTypes = {
    Downloading: PropTypes.object,
    Background: PropTypes.object,
    Nav: PropTypes.object,
    User: PropTypes.object,
    actions: PropTypes.object,
    canvas: PropTypes.object,
  };


  constructor(props) {
    super(props);
    this.editingCanvas = null;
  }


  getCanvasWidth() {
    const { canvas } = this.props;
    const width = canvas.canvasWidth / 2;
    return {
      width,
    };
  }


  renderRespositionButton() {
    const { Background } = this.props;
    if (Background.backgroundImg.img === null) return null;

    return (
      <div className="reposition-button-container" style={this.getCanvasWidth()}>
        <div className="reposition-button" onClick={this.props.actions.showRepositioning}>
          <div className="image-container">
            <img src="/img/reposition.svg" alt="reposition" />
          </div>
          <div className="text">Reposition</div>
        </div>
      </div>
    );
  }

  render() {
    const { Downloading, Nav } = this.props;
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
        <div className="pic-editor" >
          <div className="undo-container" style={this.getCanvasWidth()}>
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
          <div className="breakfast-image-container">
            <EditingCanvas
              ref={(canvas) => {
                if (canvas) this.editingCanvas = canvas;
              }}
            />
          </div>
          {this.renderRespositionButton()}
          {downloadCanvas}
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Downloading, Background, Nav, User } = getPresentState(state);
  const canvas = canvasMetricsSelector(state);
  return { Downloading, Background, Nav, User, canvas };
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

export default connect(mapStateToProps, mapDispatchToProps)(PhotoEditor);
