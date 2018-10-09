'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLinesOfText } from '../helpers/svg-text-line';
import { getCandidateText } from '../helpers/candidate-info';

export default class Results02 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  getTextHeight = (height, fontSize, percentFontSize, lineHeight) => {
    return  (1.75 * lineHeight * (fontSize)) + (percentFontSize) + (percentFontSize / 2)
  };

  getTextBottom = (height, fontSize, percentFontSize, lineHeight) => {
    var textHeight = this.getTextHeight(height, fontSize, percentFontSize, lineHeight);
    return (height / 2) + (textHeight / 2);
  };

  getRectangleLeft = (width, index = 0) => (width * 0.05 + ((width * index) / 2));

  renderText(text, candidates) {
    const { width, fontSize, lineHeight, totalHeight } = this.props.imageMetrics

    var candidateElements = []
    for (var i = 0; i < text.length; i++) {
      var percent = text[i];
      var percentFontSize = fontSize * 4;

      var bottom = this.getTextBottom(totalHeight, fontSize, percentFontSize, lineHeight);
      var left = this.getRectangleLeft(width, i);
      var boxHeight = this.getTextHeight(totalHeight, fontSize, percentFontSize, lineHeight);
      var top = bottom - boxHeight;
      var rectangleTop = top - (fontSize / lineHeight);
      var textLeft  = left + (width * 0.025)
      var percentTextTop = top + (2 * lineHeight * (fontSize)) + (percentFontSize / 2);

      var candidate = candidates[i];
      var secondaryText = getCandidateText(candidate);
      candidateElements.push((
        <g key={`candidate-${i}`}>
          <rect x={left} y={rectangleTop} height={boxHeight} fill={candidate.party.color} width={(width * 0.05) / 8} stroke={candidate.party.color}/>
          <text x={textLeft} y={top} width={width / 2}>
            <tspan className='candidate-name' y={top} x={textLeft}>{candidate.name}</tspan>
            <tspan className='candidate-party-location' y={top + (fontSize * 0.75 * lineHeight)} x={textLeft} style={{fontSize: `${fontSize * 0.75}px`}}>{secondaryText}</tspan>
          </text>
          <text x={textLeft} y={percentTextTop} width={width / 2} className='text-block' key={`results02-text-${i}`}>
            <tspan
              style={{fontSize: `${percentFontSize}px`, fontWeight: 'bold'}}
              >{percent}</tspan>
            <tspan y={percentTextTop - (percentFontSize / 3)} style={{fontSize: `${percentFontSize /2}px`}}>%</tspan>
            <tspan x={textLeft} y={percentTextTop + (percentFontSize * 1.2 / 2)} style={{fontSize: `${percentFontSize * 3/4 }px`}}>votes</tspan>
          </text>
        </g>
      ));
    }

    return (
      <g>
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
            .candidate-name, .candidate-party-location {
              fill: rgba(256, 256, 256, 0.8);
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
