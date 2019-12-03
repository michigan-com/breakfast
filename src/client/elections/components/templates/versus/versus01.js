'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLinesOfText } from '../helpers/svg-text-line';
import { imagePositionToAspectRatio } from '../helpers/image-position';
import { getCandidateText } from '../helpers/candidate-info';

export default class Versus01 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
    variation: PropTypes.object,
  }

  getTextBottom = (height) => (height * 0.7)
  getTextLeft = (width, index = 0) => (width * 0.05 + ((width * index) / 2));

  renderText(text, templateType) {
    const { candidates } = this.props;
    const { width, fontSize, lineHeight, totalHeight } = this.props.imageMetrics

    const textWidth = width * 0.43;
    const maxLines = text.reduce((a, txt) => {
      const numLines = getLinesOfText(txt, fontSize, lineHeight, textWidth).length;
      return numLines > a ? numLines : a;
    }, 0);

    var textElements = []
    for (var i = 0; i < text.length; i++) {
      const candidate = candidates[i];
      const lines = getLinesOfText(text[i], fontSize, lineHeight, textWidth);

      const textBottom = this.getTextBottom(totalHeight);
      const left = this.getTextLeft(width, i);
      const boxHeight = ((maxLines + 2) * lineHeight * (fontSize));
      const top = textBottom - boxHeight;
      const textTop = top + (fontSize * 2);
      const textLeft = left;
      const candidateTop = textBottom + (fontSize / 2);

      textElements.push((
        <g key={`versus01-text-${i}`}>
          <text x={textLeft} y={textTop} width={width} className='text-block' >
            {lines.map((line, index) => (
              <tspan
                x={textLeft}
                y={textTop + (index * fontSize * lineHeight)}
                key={`versus01-text-${index}`}
                >{line}</tspan>
            ))}
          </text>
          <text x={textLeft} y={candidateTop} fill='black' className='candidate-name' style={{fontSize: `${fontSize * 0.9}px`}}>
              {candidate.name} <tspan dx={10} fill={candidate.party.color}>{`(${candidate.party.abbr})`}</tspan>
          </text>
        </g>
      ));
    }

    return (
      <g>
        {textElements}
      </g>
    )
  }

  renderBackground() {
    const { totalHeight, width } = this.props.imageMetrics;

    const dividerWidth = width * 0.01;
    return (
      <g>
        <image x='0' y='0' height={totalHeight} width={width} xlinkHref='/img/elections/graphics/2020/2020-grey-background.png'></image>
        <rect height={totalHeight} y='0' width={dividerWidth} x={(width / 2) - (dividerWidth / 2)} fill='url(#2020-elections-gradient)'></rect>
      </g>
    )
  }

  render() {
    const { text } = this.props;

    return (
      <g>
        <style>
          {
            `.candidate-name {
              text-transform: uppercase;
              font-family: 'Unify Sans Bold';
            }
            `
          }
        </style>
        { this.renderBackground() }
        { this.renderText(text) }
      </g>
    )
  }
}
