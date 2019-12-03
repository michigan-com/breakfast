'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLinesOfText } from '../helpers/svg-text-line';
import { getCandidateText } from '../helpers/candidate-info';

export default class List01 extends Component {

  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  getTextLeft = (width) => (width * 0.23);
  getHeaderBottom = (height) => (height / 6);

  renderText(text) {

    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    var totalLines = 0;
    var allLines = [];
    var largestLineCount = 0;
    for (var i = 0; i < text.length; i++) {
      var lines = getLinesOfText(text[i], fontSize, lineHeight, width * 0.7);
      allLines.push(lines);
      totalLines += lines.length;
      if (lines.length > largestLineCount) largestLineCount = lines.length;
    }

    var headerBottom = this.getHeaderBottom(height);
    var textHeight = ((largestLineCount) * fontSize * lineHeight) * allLines.length + ((allLines.length - 1) * fontSize);
    var top = ((height - (headerBottom)) / 2) - (textHeight / 2) + (fontSize * lineHeight) + headerBottom;
    var left = this.getTextLeft(width);

    var textElements = [];
    var textTop = top;
    var listIndexFontSize = largestLineCount * fontSize * lineHeight * 0.8;
    for (var i = 0; i < allLines.length; i++) {
      const lines = allLines[i]
      var centeredTextTop = textTop;
      centeredTextTop += ((largestLineCount - lines.length) / 2) * (fontSize * lineHeight);
      textElements.push((
        <text x={left} y={textTop} key={`list-item-${i}`}>
          <tspan x={(left / 2) - (listIndexFontSize / 3)} y={textTop} className='list-index' style={{fontSize: `${listIndexFontSize}px`}}>{i+1}</tspan>
          {
            lines.map((l, lineIndex) => (
              <tspan x={left} y={centeredTextTop + (lineIndex * fontSize * lineHeight)} key={`line-item-${lineIndex}`}>{l}</tspan>
            ))
          }
        </text>
      ))

      textTop += (largestLineCount * fontSize * lineHeight) + fontSize;
    }

    return (
      <g>
        {textElements}
      </g>
    )
  }

  renderCandidate(candidates) {
    const { cornerElementWidth, width, height } = this.props.imageMetrics;
    const candidate = candidates[0];

    var candidateFontSize = 70;
    var candidateLineHeight = 1.13;
    var candidateInfoFontSize = candidateFontSize * 0.7;

    var textTop = this.getHeaderBottom(height) - (candidateFontSize / 3);
    var textLeft =  this.getTextLeft(width);

    var candidateInfo = getCandidateText(candidate);
    return (
      <g>
        <image x={0} y={0} width={cornerElementWidth} xlinkHref='/img/elections/graphics/2020/2020-corner-element.png'></image>
        <text className='candidate'>
          <tspan x={textLeft} y={textTop} style={{fontSize: candidateFontSize}}>
            <tspan style={{fontFamily: 'Unify Sans SemiBold'}}>{`${candidate.name}`}</tspan>
            <tspan x={textLeft} dy={candidateFontSize * 0.9} style={{fontSize: candidateInfoFontSize}} fill={candidate.party.color}>{candidateInfo}</tspan>
          </tspan>
        </text>
      </g>
    )
  }

  render()  {
    const { text, candidates } = this.props;
    const { width, height } = this.props.imageMetrics;

    return (
      <g>
        <style>
          {
            `svg {
              background: white;
            }
            .candidate {
              font-weight: bold;
            }
            .list-index {
              stroke: #a2a2a2;
              fill: #a2a2a2;
              font-weight: bold;
              dominant-baseline: hanging;
              font-family: 'Unify Sans Bold';
            }`
          }
        </style>
        {this.renderCandidate(candidates)}
        {this.renderText(text)}
      </g>
    )
  }

}
