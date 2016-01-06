'use strict';

import React from 'react';
import ReactCanvas from 'react-canvas';
import MediumEditor from 'medium-editor';
import assign from 'object-assign';

import $ from '../lib/$';
import FontFaceSelector from './medium-toolbar/font-face';
import FontSizeSelector from './medium-toolbar/font-size';
import FontColorSelector from './medium-toolbar/font-color';

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
        buttons: ['orderedlist', 'unorderedlist', 'h1', 'h2', 'fontface', 'fontsize', 'fontcolor'],
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

    let options = assign({}, this.mediumEditorOptions);

    options.extensions = {
      'fontface': new fontFace.extension(),
      'fontsize': new fontSize.extension(),
      'fontcolor': new fontColor.extension()
    }

    this.editor = new MediumEditor(document.getElementById('text-overlay'), options);
    this.setState({ initialized: true });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options.fontOptions.length > 0 && !this.editor) {
      this.loadMediumEditor();
    }
  }

  getTextContent() {
    let text = this.editor.serialize()['text-overlay'].value;

    let obj = new StringToCanvasText(text, this.props.options);
    return obj.getTextElements();
  }

  getStyle() {
    let options = this.props.options;
    let fontFamily = options.fontFace;
    return { fontFamily }
  }

  renderStyle() {
    let styleMetrics = this.props.options.styleMetrics;

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

    return (<style>{ style.join(' ') }</style>);
  }

  render() {
    let className = 'text-overlay-container';
    if (this.state.initialized) className += ' initialized';

    let style = this.getStyle();
    return (
      <div className={ className } style={ style }>
        <div id='text-overlay'></div>
        { this.renderStyle() }
      </div>
    )
  }
}

class StringToCanvasText {

  possibleTags = ['p', 'ol', 'ul', 'h1', 'h2', 'h3'];

  constructor(textString, opts={}) {
    this.textString = textString;
    this.$textString = $(textString);

    this.opts = opts;
    this.canvasPadding = 20;
    this.textWidth = 650 - (this.canvasPadding * 2); // 20 padding on each side, need to abstract this
    this.canvasMultiplier = 3/4; // 17px in the DOM -> 20px in canvas. Need to normalize

    this.listPadding = 40;
  }

  getStyle(tagName, content) {
    let lookupTagName = tagName;
    if (lookupTagName === 'li') lookupTagName = 'p';

    let styleMetrics = this.opts.styleMetrics[lookupTagName];

    let fontWeight = 'normal';
    if (tagName === 'h1' || tagName === 'h2') fontWeight = 'bold';

    let textWidth = this.textWidth,
      fontSize = styleMetrics.fontSize * this.canvasMultiplier,
      lineHeight = styleMetrics.lineHeight,
      marginBottom = styleMetrics.marginBottom;

    if (tagName === 'li') textWidth -= this.listPadding;

    let fontFace = FontFace(this.opts.fontFace, '', {
      weight: fontWeight,
      style: 'normal' // TODO pull this from element
    });

    let textMetrics = measureText(content, textWidth, fontFace, fontSize, lineHeight);

    let style = {
      left: 20,
      fontFace,
      fontSize,
      lineHeight,
      marginBottom,
      width: textWidth,
      color: this.opts.fontColor,
      fontWeight,
      height: textMetrics.height,
    }

    return style;
  }

  getTextElements() {
    let elements = [];
    let top = 20;

    this.$textString.forEach((el) => {
      let tagName = el.tagName.toLowerCase();
      if (this.possibleTags.indexOf(tagName) < 0) return;

      if (tagName === 'ul' || tagName === 'ol') {
        let listCount = 0;
        let bulletType = tagName === 'ul' ? 'bullet' : 'number';

        $(el).children('li').forEach((el) => {
          let bullet = bulletType === 'bullet' ? '•' : `${listCount + 1}.`;

          let bulletStyle = this.getStyle('p', bullet);
          let style = this.getStyle('li', el.textContent);

          bulletStyle.top = top;
          bulletStyle.left += this.listPadding / 2;
          style.left += this.listPadding;
          style.top = top;

          elements.push(<Text style={ bulletStyle } key={ `text-element-${elements.length}` }>{ bullet }</Text>);
          elements.push(<Text style={ style } key={ `text-element-${elements.length}` }>{ el.textContent }</Text>)

          top += style.height + style.marginBottom;
          listCount += 1;
        });

      } else {
        let style = this.getStyle(tagName, el.textContent);

        style.top = top;

        elements.push(
          <Text style={ style } key={ `text-element-${elements.length}` }>
            { el.textContent }
          </Text>
        );

        top += style.height + style.marginBottom;
      }
    });
    return elements;
  }
}