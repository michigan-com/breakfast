'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLinesOfText } from '../helpers/svg-text-line';


export default class Fact01 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  renderText() {
    const { text } = this.props;
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    var lines = getLinesOfText(text[0], fontSize, lineHeight, width * 0.85);
    var boxWidth = width * 0.9;
    var boxHeight = (lines.length + 6) * fontSize * lineHeight;
    var boxTop = (height / 2);
    var textTop = boxTop;
    var textLeft = width * 0.1;

    return (
      <g>
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

  renderBackground() {
    const { width, totalHeight } = this.props.imageMetrics;

    const iconWidth = width * 0.3;
    const iconLeft = (width / 2) - (iconWidth / 2);

    return (
      <g>
        <image x='0' y='0' width={width} xlinkHref='/img/elections/graphics/2020/2020-full-gradient-background.png'></image>
        <image x={iconLeft} y={totalHeight * 0.2} width={iconWidth} xlinkHref='/img/elections/icons/2020/podium.svg'></image>
      </g>
    )
  }

  render() {
    return (
      <g>
        <style>
          {`
          text {
            fill: white;
            font-weight: bold;
          }
            `}
        </style>
        {this.renderBackground()}
        {this.renderText()}
      </g>
    )
  }
}
