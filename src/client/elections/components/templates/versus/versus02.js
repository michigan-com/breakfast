'use strict';

import React, { Component, PropTypes } from 'react';

import { getLinesOfText } from '../helpers/svg-text-line';

export default class Versus02 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  getTextBottom = (height, numLines, fontSize, lineHeight) => {
    var textHeight = numLines * lineHeight * fontSize;
    return (height / 2) + (textHeight / 2);
  };
  getTextLeft = (width, index = 0) => (width * 0.05 + ((width * index) / 2));

  renderText(text, candidates) {
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics

    var textElements = []
    var candidateElements = []
    for (var i = 0; i < text.length; i++) {
      var lines = getLinesOfText(text[i], fontSize, lineHeight, (width / 2) - (width * 0.05));

      var bottom = this.getTextBottom(height, lines.length, fontSize, lineHeight);
      var left = this.getTextLeft(width, i);
      var boxHeight = ((lines.length + 2) * lineHeight * (fontSize));
      var top = bottom - boxHeight;
      var textTop = top + (fontSize * 2);
      var textLeft = left;

      var candidate = candidates[i];
      var candidateBoxHeight = fontSize * 3;
      var candidateTop = bottom;
      var candidateTextTop =(candidateTop + (candidateBoxHeight / 2)) - (fontSize / 2);
      var candidateTextLeft = textLeft + (width * 0.025);

      var secondaryText = `${candidate.party.abbr}`;
      if (candidate.location) secondaryText += `-${candidate.location}`;

      textElements.push((
        <text x={textLeft} y={textTop} width={width / 2} className='text-block' key={`versus02-text-${i}`}>
          {lines.map((line, index) => (
            <tspan
              x={textLeft}
              y={textTop + (index * fontSize * lineHeight)}
              key={`versus01-text-${index}`}
              >{line}</tspan>
          ))}
        </text>
      ));

      candidateElements.push((
        <g key={`candidate-${i}`}>
          <rect x={textLeft} y={candidateTextTop - (fontSize * 0.8)} width={(width * 0.05) / 8} height={(fontSize + (fontSize * 0.72 * lineHeight) * 0.9)} fill={candidate.party.color} stroke={candidate.party.color}/>
          <text x={candidateTextLeft} y={candidateTextTop} width={width / 2} fill='black'>
            <tspan className='candidate-name' y={candidateTextTop} x={candidateTextLeft}>{candidate.name}</tspan>
            <tspan className='candidate-party-location' y={candidateTextTop + (fontSize * 0.75 * lineHeight)} x={candidateTextLeft} style={{fontSize: `${fontSize * 0.75}px`}}>{secondaryText}</tspan>
          </text>
        </g>
      ));
    }

    return (
      <g>
        {textElements}
        {candidateElements}
      </g>
    )
  }

  renderBackground(candidates) {
    const { height, width } = this.props.imageMetrics;
    var dividerWidth = width * 0.01;
    return (
      <g>
        <rect height={height} y='0' width={dividerWidth} x={(width / 2) - (dividerWidth / 2)} fill='white'></rect>
        <image x='0' y='0' width={width - (dividerWidth / 2)} xlinkHref={`/img/elections/templates/versus02/versus02-${candidates[0].party.abbr.toLowerCase()}.png`}></image>
        <image x={(width / 2) + (dividerWidth / 2)} y='0' width={width} xlinkHref={`/img/elections/templates/versus02/versus02-${candidates[1].party.abbr.toLowerCase()}.png`}></image>
      </g>
    )
  }

  render() {
    const { text, candidates } = this.props;
    const { width, height } = this.props.imageMetrics;

    return (
      <g>
        <style>
          {
            `.logo-container {
              fill: white;
            }
            svg {
              background: rgb(56, 56, 56);
            }
            .candidate-name {
              text-transform: uppercase;
            }
            text {
              fill: white;
            }`
          }
        </style>
        { this.renderBackground(candidates) }
        { this.renderText(text, candidates) }
      </g>
    )
  }
}
