'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from 'redux-undo';

import { doneDownloading } from '../../breakfast/actions/downloading';
import { getPresentState } from '../../breakfast/selectors/present';
import { showRepositioning } from '../../breakfast/actions/nav';
import { getImageMetrics } from '../selectors/templates';
import OptionsMenu from './options-menu';
import Navbar from '../../components/navbar';
import EditingCanvas from './editing-canvas';

class App extends Component {
  static propTypes = {
    Downloading: PropTypes.object,
    Background: PropTypes.object,
    Nav: PropTypes.object,
    actions: PropTypes.object,
    imageMetrics: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.editingCanvas = null;
  }

  getCanvasWidth() {
    const { width } = this.props.imageMetrics;
    return {
      width,
    }
  }

  renderRespositionButton() {
    return null;
    // const { Background } = this.props;
    // if (Background.backgroundImg.img === null) return null;
    //
    // return (
    //   <div className="reposition-button-container" style={this.getCanvasWidth()}>
    //     <div className="reposition-button" onClick={this.props.actions.showRepositioning}>
    //       <div className="image-container">
    //         <img src="/img/reposition.svg" alt="reposition" />
    //       </div>
    //       <div className="text">Reposition</div>
    //     </div>
    //   </div>
    // );
  }

  render() {
    const { Downloading, Nav } = this.props;

    if (Nav.showRepositioning) {
      return null;
      // return <BackgroundPosition />;
    }

    return (
      <div>
        <Navbar email={window.BFAST_USER_EMAIL} />
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
            <EditingCanvas ref={(e) => { this.editingCanvas = e;}}/>
          </div>
          <div className="breakfast-image-container">
          </div>
          {this.renderRespositionButton()}
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { Downloading, Background, Nav } = getPresentState(state);
  const imageMetrics = getImageMetrics(state);
  return { Downloading, Background, Nav, imageMetrics };
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
