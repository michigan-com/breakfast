'use strict';

import React from 'react';
import ReactCanvas from 'react-canvas';
import MediumEditor from 'medium-editor';
import assign from 'object-assign';
import $ from '../lib/$';

var Text = ReactCanvas.Text;
var measureText = ReactCanvas.measureText;
var FontFace = ReactCanvas.FontFace;

export default class TextOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false
    }

    this.mediumEditorOptions = {
      buttonLabels: 'fontawesome',
      activeButtonClass: 'medium-editor-button-active',
      disableDoubleReturn: true,
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'orderedlist', 'unorderedlist', 'h1', 'h2'],
        static: true,
        updateOnEmptySelection: true
      }
    }
  }

  componentDidMount() {
    this.editor = new MediumEditor(document.getElementById('text-overlay'), this.mediumEditorOptions);

    this.setState({ initialized: true });
  }

  getTextContent() {
    let text = this.editor.serialize()['text-overlay'].value;

    let obj = new StringToCanvasText(text);
    return obj.getTextElements();
  }

  getStyle() {
    let options = this.props.options;

    let top = 0, left = 0;
    let padding = 20;
    let fontFace = options.fontFace;
    return { top, left, fontFace, padding }
  }

  render() {
    let className = 'text-overlay-container';
    if (this.state.initialized) className += ' initialized';

    let style = this.getStyle();
    return (
      <div className={ className } style={ style }>
        <div id='text-overlay'></div>
      </div>
    )
  }
}

class StringToCanvasText {
  static defaultOpts = {
    multipliers: {
      h1: 2,
      h2: 1.5,
      h3: 1.25
    },
    fontSize: 30,
    fontFace: 'Helvetica',
    textWidth: 610 // 650 - 40 (20 padding on each side)
  }

  possibleTags = ['p', 'ol', 'ul', 'h1', 'h2', 'h3'];

  constructor(textString, opts={}) {
    this.textString = textString;
    this.$textString = $(textString);

    this.opts = assign({}, StringToCanvasText.defaultOpts, opts);
  }

  getStyle(tagName, content) {
    let textWidth = this.opts.textWidth, fontSize = this.opts.fontSize;
    let fontFace = FontFace(this.opts.fontFace, '', {});

    if (this.opts.multipliers && tagName in this.opts.multipliers) {
      fontSize *= this.opts.multipliers[tagName];
    }

    let textMetrics = measureText(content, textWidth, fontFace, fontSize, fontSize);

    let style = {
      left: 0,
      fontSize,
      fontFace,
      width: textWidth,
      color: 'black',
      lineHeight: textMetrics.height,
      height: textMetrics.height,
    }

    return style;
  }

  getTextElements() {
    let elements = [];
    let top = 0;

    this.$textString.forEach((el) => {
      let tagName = el.tagName.toLowerCase();
      if (this.possibleTags.indexOf(tagName) < 0) return;

      let style = this.getStyle(tagName, el.textContent);
      style.top = top;

      console.log(style);

      elements.push(
        <Text style={ style } key={ `text-element-${elements.length}` }>
          { el.textContent }
        </Text>
      );

      top += style.height;
    });
    return elements;
  }
}