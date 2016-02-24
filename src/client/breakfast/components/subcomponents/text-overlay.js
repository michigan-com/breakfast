'use strict';

import React from 'react';
import MediumEditor from 'medium-editor';
import assign from 'object-assign';

import Store from '../../store';
import { textPosChange } from '../../actions/text';
import FontFaceSelector from './medium-toolbar/font-face';
import FontSizeSelector from './medium-toolbar/font-size';
import FontColorSelector from './medium-toolbar/font-color';
import TextWidthSelector from './medium-toolbar/text-width';

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
    let textWidth = new TextWidthSelector();

    let options = assign({}, this.mediumEditorOptions);

    options.extensions = {
      'fontface': new fontFace.extension(),
      'fontsize': new fontSize.extension(),
      'fontcolor': new fontColor.extension(),
      'tetwidth': new textWidth.extension()
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
  mouseDown = (e) => {
    this.trackMouseMovement();

    this.setState({
      mouseDown: true,
      lastMouseX: e.clientX,
      lastMouseY: e.clientY
    });
  }

  mouseUp = (e) => {
    this.stopTrackingMouseMovement();
    Store.dispatch(textPosChange(this.state.textPos));
    this.setState({ mouseDown: false });
  }

  mouseMove = (e) => {
    if (!this.state.mouseDown) return;

    let options = this.props.options;

    let movementX = this.state.lastMouseX - e.clientX;
    let movementY = this.state.lastMouseY - e.clientY;
    let newTop = this.state.textPos.top - movementY;
    let newLeft = this.state.textPos.left - movementX;

    this.setState({
      textPos: {
        top: newTop,
        left: newLeft
      },
      lastMouseX: e.clientX,
      lastMouseY: e.clientY
    });
  }

  trackMouseMovement = () => {
    document.body.addEventListener('mousemove', this.mouseMove);
    // TODO
    //document.body.addEventListener('touchmove', this.mouseMove);

    document.body.addEventListener('mouseup', this.mouseUp);
    // TODO
    //document.body.addEventListener('touchend', this.mouseUp);
  }

  stopTrackingMouseMovement = () => {
    document.body.removeEventListener('mousemove', this.mouseMove);
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
    let maxTextWidth = options.Background.canvas.maxTextWidth;
    let canvasPadding = options.Background.canvas.canvasPadding;

    let style = [];
    for (let tag in styleMetrics) {
      let metrics = styleMetrics[tag];
      let s = `{
        font-size: ${metrics.fontSize}px !important;
        margin-bottom: ${metrics.marginBottom}px !important;
        line-height: ${metrics.lineHeight}px !important;
        color: ${this.props.options.Font.fontColor} !important;
      }`;

      style.push(`#text-overlay ${tag}, #text-overlay ${tag} * ${s}`);
    }

    style.push(`#text-overlay { width: ${maxTextWidth * (textWidth / 100)}px; }`);

    let textPos = this.state.textPos;
    style.push(`.text-overlay-container { top: ${textPos.top}; left: ${textPos.left}; padding: ${canvasPadding}px }`);
    style.push(`.text-overlay-container .move-text { top: ${canvasPadding}px; left: ${canvasPadding - 40}px; }`)

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
            onMouseDown={ this.mouseDown }
            onTouchStart={ this.mouseDown }><i className="fa fa-arrows"></i></div>
        { this.renderStyle() }
      </div>
    )
  }
}
