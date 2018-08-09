'use strict';

import React, { Component, PropTypes } from 'react';

import { getLinesOfText } from '../helpers/svg-text-line';

export default class Fact01 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  renderText(text) {
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    var lines = getLinesOfText(text[0], fontSize, lineHeight, width * 0.85);
    var boxWidth = width * 0.9;
    var boxHeight = (lines.length + 6) * fontSize * lineHeight;
    var boxTop = (height / 2) - boxHeight / 2;
    var textTop = boxTop + (3.5 * fontSize * lineHeight);
    var textLeft = width * 0.1;

    return (
      <g>
        <rect x={width * 0.05} y={boxTop} width={boxWidth} height={boxHeight} fill='rgba(256, 256, 256, 0.9)'></rect>
        <text x={textLeft} y={textTop}>
          {
            lines.map((l, i) => (
              <tspan x={textLeft} y={textTop + (i * fontSize * lineHeight)} key={`fact01-line-${i}`}>{l}</tspan>
            ))
          }
        </text>
      </g>
    )
  }

  render() {
    const { text } = this.props;
    return (
      <g>
        <style>
          {`
            svg {
              background: rgb(56, 56, 56);
            }
            `}
        </style>
        {this.renderText(text)}
      </g>
    )
  }
}
