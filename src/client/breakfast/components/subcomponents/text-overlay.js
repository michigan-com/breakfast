'use strict';

import React from 'react';
import MediumEditor from 'medium-editor';

import Store from '../../store';
import { textPosChange, textWidthChange } from '../../actions/text';
import FontFaceSelector from './medium-toolbar/font-face';
import FontSizeSelector from './medium-toolbar/font-size';
import FontColorSelector from './medium-toolbar/font-color';

const MOVE_TYPE_POS = 'pos';
const MOVE_TYPE_WIDTH = 'width';

export default class TextOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,

      mouseDown: false,
      lastMouseX: 0,
      lastMouseY: 0,

      textPos: { ...this.props.options.Text.textPos },
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
    if (this.props.options.Font.fontOptions.length > 0 && !this.editor) {
      this.loadMediumEditor();
    }
  }

  getTextContent() {
    return this.editor.serialize()['text-overlay'].value;
  }

  getStyle() {
    const options = this.props.options;
    const fontFamily = options.Font.fontFace;
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

        origTextPos: { ...this.props.options.Text.textPos },
        origTextWidth: this.props.options.Text.textWidth,
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

      const backgroundOptions = this.props.options.Background;

      const movementX = e.clientX - this.state.lastMouseX;
      const movementY = e.clientY - this.state.lastMouseY;

      // Figure out what to do with the new found information
      switch (moveType) {
        case MOVE_TYPE_POS: {
          const top = this.state.origTextPos.top + movementY;
          const left = this.state.origTextPos.left + movementX;
          Store.dispatch(textPosChange({ top, left }));
          break;
        }
        case MOVE_TYPE_WIDTH:
        default: {
          // cause we're scaled up, divide by two
          const maxTextWidth = backgroundOptions.canvas.maxTextWidth / 2;
          const percentChange = 100 * (movementX / maxTextWidth);
          const textWidthPercent = Math.round(percentChange + this.state.origTextWidth);
          Store.dispatch(textWidthChange(textWidthPercent));
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
    const fontFace = new FontFaceSelector(this.props.options.Font.fontOptions);
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
    const options = this.props.options;
    const styleMetrics = options.Font.styleMetrics;
    const textWidth = options.Text.textWidth;
    const textPos = this.props.options.Text.textPos;
    let textWidthPx = options.Background.canvas.maxTextWidth * (textWidth / 100);

    // Have to scale things down on the DOM for better UI
    textWidthPx /= 2;
    const canvasPadding = options.Background.canvas.canvasPadding / 2;


    let style = [];
    Object.keys(styleMetrics).forEach((tag) => {
      const metrics = styleMetrics[tag];

      // Scale down for UI purposes
      const s = `{
        font-size: ${metrics.fontSize / 2}px !important;
        margin-bottom: ${metrics.marginBottom / 2}px !important;
        line-height: ${metrics.lineHeight / 2}px !important;
        color: ${this.props.options.Font.fontColor} !important;
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

TextOverlay.propTypes = {
  options: React.PropTypes.shape(Store.getState()).isRequired,
};
