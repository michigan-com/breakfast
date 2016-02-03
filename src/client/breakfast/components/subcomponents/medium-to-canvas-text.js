'use strict';

import React from 'react';

import $ from '../../util/$';
import { measureText, FontFace, Text } from 'react-canvas';
import assign from 'object-assign';

/**
 * Convert the string returned from the medium-editor into <Text> elements to be
 * drawn to the canvas for image saving
 */
export default class MediumToCanvasText {

  possibleTags = ['p', 'ol', 'ul', 'h1', 'h2', 'h3'];

  constructor(textString, opts={}) {
    this.textString = textString;
    this.$textString = $(textString);

    this.opts = opts;
    this.canvasPadding = this.opts.AspectRatio.canvas.canvasPadding;
    this.textWidth = (this.opts.AspectRatio.canvas.maxTextWidth) * (this.opts.Text.textWidth / 100);
    this.fontSizeMultiplier = 3/4; // 17px in the DOM -> 20px in canvas. Need to normalize
    this.textPos = assign({}, this.opts.Text.textPos);

    this.listPadding = 40;
  }

  getStyle(tagName, content) {
    let lookupTagName = tagName;
    if (lookupTagName === 'li') lookupTagName = 'p';

    let styleMetrics = this.opts.Font.styleMetrics[lookupTagName];

    let fontWeight = 'normal';
    if (tagName === 'h1' || tagName === 'h2') fontWeight = 'bold';

    let textWidth = this.textWidth,
      fontSize = styleMetrics.fontSize,
      lineHeight = styleMetrics.lineHeight,
      marginBottom = styleMetrics.marginBottom;

    textWidth *= .8;

    if (tagName === 'li') textWidth -= this.listPadding;

    let fontFace = FontFace(this.opts.Font.fontFace, '', {
      weight: fontWeight,
      style: 'normal' // TODO pull this from element
    });

    let textMetrics = measureText(content, textWidth, fontFace, fontSize, lineHeight);

    let style = {
      left: this.canvasPadding + this.textPos.left,
      fontFace,
      fontSize,
      lineHeight,
      marginBottom,
      width: textWidth,
      color: this.opts.Font.fontColor,
      fontWeight,
      height: textMetrics.height,
    }

    return style;
  }

  getTextElements() {
    let elements = [];
    let top = this.canvasPadding + this.textPos.top;

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