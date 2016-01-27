'use strict';

import React from 'react';
import ReactCanvas from 'react-canvas';
import MediumEditor from 'medium-editor';
import assign from 'object-assign';

import FontFaceSelector from '../medium-toolbar/font-face';
import FontSizeSelector from '../medium-toolbar/font-size';
import FontColorSelector from '../medium-toolbar/font-color';
import TextWidthSelector from '../medium-toolbar/text-width';
import Actions from '../../actions/options';
import MediumToCanvasText from './medium-to-canvas-text';

var Text = ReactCanvas.Text;
var measureText = ReactCanvas.measureText;
var FontFace = ReactCanvas.FontFace;

var actions = new Actions();

export default class TextOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,

      mouseDown: false,
      lastMouseX: 0,
      lastMouseY: 0,

      textPos: assign({}, this.props.options.textPos)
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
    let fontFace = new FontFaceSelector(this.props.options.fontOptions);
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

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options.fontOptions.length > 0 && !this.editor) {
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
    actions.textPosChange(this.state.textPos);
    this.setState({ mouseDown: false });
  }

  mouseMove = (e) => {
    if (!this.state.mouseDown) return;

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
    document.body.addEventListener('touchmove', this.mouseMove);

    document.body.addEventListener('mouseup', this.mouseUp);
    document.body.addEventListener('touchend', this.mouseUp);
  }

  stopTrackingMouseMovement = () => {
    document.body.removeEventListener('mousemove', this.mouseMove);
    document.body.removeEventListener('touchmove', this.mouseMove);

    document.body.removeEventListener('mouseup', this.mouseUp);
    document.body.removeEventListener('touchend', this.mouseUp);
  }

  /** End Mouse events */

  getTextContent() {
    let text = this.editor.serialize()['text-overlay'].value;

    let obj = new MediumToCanvasText(text, this.props.options);
    return obj.getTextElements();
  }

  getStyle() {
    let options = this.props.options;
    let fontFamily = options.fontFace;
    return { fontFamily }
  }

  renderStyle() {
    let options = this.props.options;
    let styleMetrics = options.styleMetrics;
    let textWidth = options.canvas.textWidth;

    let style = [];
    for (let tag in styleMetrics) {
      let metrics = styleMetrics[tag];
      let s = `{
        font-size: ${metrics.fontSize}px;
        margin-bottom: ${metrics.marginBottom}px;
        line-height: ${metrics.lineHeight}px;
        color: ${this.props.options.fontColor}
      }`;

      style.push(`#text-overlay ${tag} ${s}`);
    }

    style.push(`#text-overlay { width: ${textWidth}px; }`);

    let textPos = this.state.textPos;
    style.push(`.text-overlay-container { top: ${textPos.top}; left: ${textPos.left} }`);

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