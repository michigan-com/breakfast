'use strict';

import React from 'react';
import MediumEditor from 'medium-editor';
import assign from 'object-assign';

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

      textPos: assign({}, this.props.options.Text.textPos)
    }

    this.mediumEditorOptions = {
      buttonLabels: 'fontawesome',
      activeButtonClass: 'medium-editor-button-active',
      toolbar: {
        buttons: ['orderedlist', 'unorderedlist', 'h1', 'h2', 'fontface', 'fontcolor', 'fontsize', 'textwidth'],
        static: true,
        updateOnEmptySelection: true
      }
    }

    this.editor = undefined;
  }

  loadMediumEditor() {
    let fontFace = new FontFaceSelector(this.props.options.Font.fontOptions);
    let fontSize = new FontSizeSelector();
    let fontColor = new FontColorSelector();
    //let textWidth = new TextWidthSelector();

    let options = assign({}, this.mediumEditorOptions);

    options.extensions = {
      'fontface': new fontFace.extension(),
      'fontsize': new fontSize.extension(),
      'fontcolor': new fontColor.extension(),
      //'tetwidth': new textWidth.extension()
    }

    this.editor = new MediumEditor(document.getElementById('text-overlay'), options);
    this.setState({ initialized: true });
  }

  componentDidUpdate() {
    if (this.props.options.Font.fontOptions.length > 0 && !this.editor) {
      this.loadMediumEditor();
    }
  }

  /** Mouse events */
  mouseDown = (type) => {
    let moveType = type;

    return (e) => {
      this.trackMouseMovement(moveType);
      this.setState({
        mouseDown: true,
        lastMouseX: e.clientX,
        lastMouseY: e.clientY,

        origTextPos: assign({}, this.props.options.Text.textPos),
        origTextWidth: this.props.options.Text.textWidth
      });
    }
  }

  mouseUp = (e) => {
    this.stopTrackingMouseMovement();
    this.setState({ mouseDown: false });
  }

  mouseMove = (type) => {
    let moveType = type;

    return (e) => {
      if (!this.state.mouseDown) return;

      let options = this.props.options;
      let backgroundOptions = this.props.options.Background;

      let movementX = e.clientX - this.state.lastMouseX;
      let movementY = e.clientY - this.state.lastMouseY;

      // Figure out what to do with the new found information
      switch (moveType) {
        case MOVE_TYPE_POS:
          let top = this.state.origTextPos.top + movementY;
          let left = this.state.origTextPos.left + movementX;
          Store.dispatch(textPosChange({ top, left }));
          break;
        case MOVE_TYPE_WIDTH:
          // cause we're scaled up, divide by two
          let maxTextWidth = backgroundOptions.canvas.maxTextWidth / 2;
          let percentChange = 100 * (movementX / maxTextWidth);
          let textWidthPercent = Math.round(percentChange + this.state.origTextWidth);
          Store.dispatch(textWidthChange(textWidthPercent));
          break;
      }
    }
  }

  trackMouseMovement = (type) => {
    this.mouseMoveCallback = this.mouseMove(type);
    document.body.addEventListener('mousemove', this.mouseMoveCallback);
    // TODO
    //document.body.addEventListener('touchmove', this.mouseMove);

    document.body.addEventListener('mouseup', this.mouseUp);
    // TODO
    //document.body.addEventListener('touchend', this.mouseUp);
  }

  stopTrackingMouseMovement = () => {
    document.body.removeEventListener('mousemove', this.mouseMoveCallback);
    // TODO
    //document.body.removeEventListener('touchmove', this.mouseMove);

    document.body.removeEventListener('mouseup', this.mouseUp);
    // TODO
    //document.body.removeEventListener('touchend', this.mouseUp);
  }

  /** End Mouse events */

  getTextContent() {
    return this.editor.serialize()['text-overlay'].value;
  }

  getStyle() {
    let options = this.props.options;
    let fontFamily = options.Font.fontFace;
    return { fontFamily }
  }

  renderStyle() {
    let options = this.props.options;
    let styleMetrics = options.Font.styleMetrics;
    let textWidth = options.Text.textWidth;
    let textPos = this.props.options.Text.textPos;
    let textWidthPx = options.Background.canvas.maxTextWidth * (textWidth / 100);

    // Have to scale things down on the DOM for better UI
    textWidthPx /= 2;
    let canvasPadding = options.Background.canvas.canvasPadding / 2;


    let style = [];
    for (let tag in styleMetrics) {
      let metrics = styleMetrics[tag];

      // Scale down for UI purposes
      let s = `{
        font-size: ${metrics.fontSize / 2}px !important;
        margin-bottom: ${metrics.marginBottom / 2}px !important;
        line-height: ${metrics.lineHeight / 2}px !important;
        color: ${this.props.options.Font.fontColor} !important;
      }`;

      style.push(`#text-overlay ${tag}, #text-overlay ${tag} * ${s}`);
    }

    style.push(`#text-overlay { width: ${textWidthPx}px; }`);
    style.push(`.text-overlay-container { top: ${textPos.top}; left: ${textPos.left}; padding: ${canvasPadding}px }`);
    style.push(`.text-overlay-container .move-text { top: ${canvasPadding}px; left: ${canvasPadding - 40}px; }`)
    style.push(`.text-overlay-container .text-width-change { top: ${canvasPadding}px; left: ${textWidthPx + canvasPadding + 4}px }`)

    return (<style>{ style.join(' ') }</style>);
  }

  render() {
    let className = 'text-overlay-container';
    if (this.state.initialized) className += ' initialized';

    let style = this.getStyle();
    return (
      <div className={ className } style={ style }>
        <div id='text-overlay'></div>
        <div className='move-text'
            onMouseDown={ this.mouseDown(MOVE_TYPE_POS) }
            onTouchStart={ this.mouseDown(MOVE_TYPE_POS) }><i className="fa fa-arrows"></i></div>
        { this.renderStyle() }
        <div className='text-width-change'
            onMouseDown={ this.mouseDown(MOVE_TYPE_WIDTH) }
            onTouchStart={ this.mouseDown(MOVE_TYPE_WIDTH) }><i className='fa fa-arrows-h'></i></div>
      </div>
    )
  }
}
