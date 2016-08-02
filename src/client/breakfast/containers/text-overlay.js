'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MediumEditor from 'medium-editor';

import { textPosChange, textWidthChange } from '../actions/text';
import FontFaceSelector from '../components/medium-toolbar/font-face';
import FontSizeSelector from '../components/medium-toolbar/font-size';
import FontColorSelector from '../components/medium-toolbar/font-color';
import { canvasMetricsSelector } from '../selectors/background';

const MOVE_TYPE_POS = 'pos';
const MOVE_TYPE_WIDTH = 'width';

class TextOverlay extends React.Component {
  static propTypes = {
    Text: PropTypes.object,
    Font: PropTypes.object,
    canvas: PropTypes.object,
    actions: PropTypes.object,
    textContainerOptions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      initialized: false,

      mouseDown: false,
      lastMouseX: 0,
      lastMouseY: 0,

      textPos: { ...this.props.Text.textPos },
    };

    this.mediumEditorOptions = {
      buttonLabels: 'fontawesome',
      activeButtonClass: 'medium-editor-button-active',
      toolbar: {
        buttons: [
          'orderedlist',
          'unorderedlist',
          'h1',
          'h2',
          'fontface',
          'fontcolor',
          'fontsize',
          'textwidth'],
        static: true,
        updateOnEmptySelection: true,
      },
    };

    this.editor = undefined;
  }

  componentDidUpdate() {
    if (this.props.Font.fontOptions.length > 0 && !this.editor) {
      this.loadMediumEditor();
    }
  }

  getTextContent() {
    return this.editor.serialize()['text-overlay'].value;
  }

  getStyle() {
    const fontFamily = this.props.Font.fontFace;
    return { fontFamily };
  }

  /** Mouse events */
  mouseDown = (type) => {
    const moveType = type;

    return (e) => {
      this.trackMouseMovement(moveType);
      this.setState({
        mouseDown: true,
        lastMouseX: e.clientX,
        lastMouseY: e.clientY,

        origTextPos: { ...this.props.Text.textPos },
        origTextWidth: this.props.Text.textWidth,
      });
    };
  }

  mouseUp = () => {
    this.stopTrackingMouseMovement();
    this.setState({ mouseDown: false });
  }

  mouseMove = (type) => {
    const moveType = type;

    return (e) => {
      if (!this.state.mouseDown) return;

      const { canvas } = this.props;

      const movementX = e.clientX - this.state.lastMouseX;
      const movementY = e.clientY - this.state.lastMouseY;

      // Figure out what to do with the new found information
      switch (moveType) {
        case MOVE_TYPE_POS: {
          const top = this.state.origTextPos.top + movementY;
          const left = this.state.origTextPos.left + movementX;
          this.props.actions.textPosChange({ top, left });
          break;
        }
        case MOVE_TYPE_WIDTH:
        default: {
          // cause we're scaled up, divide by two
          const maxTextWidth = canvas.maxTextWidth / 2;
          const percentChange = 100 * (movementX / maxTextWidth);
          const textWidthPercent = Math.round(percentChange + this.state.origTextWidth);
          this.props.actions.textWidthChange(textWidthPercent);
          break;
        }
      }
    };
  }

  trackMouseMovement = (type) => {
    this.mouseMoveCallback = this.mouseMove(type);
    document.body.addEventListener('mousemove', this.mouseMoveCallback);
    // TODO
    // document.body.addEventListener('touchmove', this.mouseMove);

    document.body.addEventListener('mouseup', this.mouseUp);
    // TODO
    // document.body.addEventListener('touchend', this.mouseUp);
  }

  stopTrackingMouseMovement = () => {
    document.body.removeEventListener('mousemove', this.mouseMoveCallback);
    // TODO
    // document.body.removeEventListener('touchmove', this.mouseMove);

    document.body.removeEventListener('mouseup', this.mouseUp);
    // TODO
    // document.body.removeEventListener('touchend', this.mouseUp);
  }

  /** End Mouse events */


  loadMediumEditor() {
    const fontFace = new FontFaceSelector(this.props.Font.fontOptions);
    const fontSize = new FontSizeSelector();
    const fontColor = new FontColorSelector();

    const options = { ...this.mediumEditorOptions };

    options.extensions = {
      fontface: new fontFace.Extension(),
      fontsize: new fontSize.Extension(),
      fontcolor: new fontColor.Extension(),
    };

    this.editor = new MediumEditor(document.getElementById('text-overlay'), options);
    this.setState({ initialized: true });
  }

  renderStyle() {
    const { canvas, Font, textContainerOptions } = this.props;
    const styleMetrics = Font.styleMetrics;
    const { textPos, textWidth } = textContainerOptions;
    let textWidthPx = canvas.maxTextWidth * (textWidth / 100);

    // Have to scale things down on the DOM for better UI
    textWidthPx /= 2;
    const canvasPadding = canvas.canvasPadding / 2;


    let style = [];
    Object.keys(styleMetrics).forEach((tag) => {
      const metrics = styleMetrics[tag];

      // Scale down for UI purposes
      const s = `{
        font-size: ${metrics.fontSize / 2}px !important;
        margin-bottom: ${metrics.marginBottom / 2}px !important;
        line-height: ${metrics.lineHeight / 2}px !important;
        color: ${Font.fontColor} !important;
      }`;

      style.push(`#text-overlay ${tag}, #text-overlay ${tag} * ${s}`);
    });

    style.push(`#text-overlay { width: ${textWidthPx}px; }`);
    style.push(`
      .text-overlay-container {
        top: ${textPos.top};
        left: ${textPos.left};
        padding: ${canvasPadding}px
      }`);
    style.push(`
      .text-overlay-container .move-text {
        top: ${canvasPadding}px;
        left: ${canvasPadding - 40}px;
      }`);
    style.push(`
      .text-overlay-container .text-width-change {
        top: ${canvasPadding}px;
        left: ${textWidthPx + canvasPadding + 4}px
      }`);

    return (<style>{style.join(' ')}</style>);
  }

  render() {
    let className = 'text-overlay-container';
    if (this.state.initialized) className += ' initialized';

    let style = this.getStyle();
    return (
      <div className={className} style={style}>
        <div id="text-overlay"></div>
        <div
          className="move-text"
          onMouseDown={this.mouseDown(MOVE_TYPE_POS)}
          onTouchStart={this.mouseDown(MOVE_TYPE_POS)}
        ><i className="fa fa-arrows"></i></div>
        {this.renderStyle()}
        <div
          className="text-width-change"
          onMouseDown={this.mouseDown(MOVE_TYPE_WIDTH)}
          onTouchStart={this.mouseDown(MOVE_TYPE_WIDTH)}
        ><i className="fa fa-arrows-h"></i></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Text, Font } = state;
  const canvas = canvasMetricsSelector(state);
  return { Text, Font, canvas };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      textPosChange,
      textWidthChange,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, undefined,
    { withRef: true })(TextOverlay);
