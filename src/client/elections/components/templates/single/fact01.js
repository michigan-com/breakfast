'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLinesOfText } from '../helpers/svg-text-line';

const numPatternRows = 6;
const starPatternHTML = `
<pattern id="starPattern" patternUnits="objectBoundingBox" x='0' y='0' width="${1 / 6}" height="100%">
    <image xlink:href="/img/elections/templates/fact01/fact01-star.png" x="0" y="0"
        width="${366 / 3}" height="${356 / 3}" />
</pattern>
`

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
        <rect x={width * 0.05} y={boxTop} width={boxWidth} height={boxHeight} fill='rgba(256, 256, 256, 0.93)'></rect>
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

  renderBackgroundPattern() {
    const { width, height } = this.props.imageMetrics;
    var patternRows = []
    for (var i = 0; i < numPatternRows; i++) {
      const x = i % 2 === 0 ? -100 : 0;
      patternRows.push(
         <rect x={x} y={10 + (i * height / numPatternRows)} width={width + 100} height={height / numPatternRows} fill='url(#starPattern)' key={`pattern-row-${i}`}></rect>
      )
    }
    return (
      <g>
        {patternRows}
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
              background: rgb(186, 225, 255);
            }
            `}
        </style>
        <defs dangerouslySetInnerHTML={{ __html: starPatternHTML }}r>
        </defs>
        {this.renderBackgroundPattern()}
        {this.renderText(text)}
      </g>
    )
  }
}
