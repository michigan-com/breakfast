'use strict';

import React, { Component, PropTypes } from 'react';

import { getLinesOfText } from '../helpers/svg-text-line';

export default class List02 extends Component {

  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  getTextLeft = (width) => (width * 0.2);
  getHeaderBottom = () => (200);

  renderText(text) {

    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    var totalLines = 0;
    var allLines = [];
    var largestLineCount = 0;
    for (var i = 0; i < text.length; i++) {
      var lines = getLinesOfText(text[i], fontSize, lineHeight, width * 0.8);
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
    var listIndexFontSize = largestLineCount * fontSize;
    for (var i = 0; i < allLines.length; i++) {
      const lines = allLines[i]
      var centeredTextTop = textTop;
      centeredTextTop += ((largestLineCount - lines.length) / 2) * (fontSize * lineHeight);
      textElements.push((
        <text x={left} y={textTop} key={`list-item-${i}`}>
          <tspan x={(left / 2) - (listIndexFontSize / 3)} y={textTop - fontSize +  (largestLineCount * fontSize / 2) + (listIndexFontSize / 2)} className='list-index' style={{fontSize: `${listIndexFontSize}px`}}>{i+1}</tspan>
          {
            lines.map((l, lineIndex) => (
              <tspan x={left} y={centeredTextTop + (lineIndex * fontSize * lineHeight)} key={`line-item-${lineIndex}`}>{l}</tspan>
            ))
          }
        </text>
      ))

      textTop += (largestLineCount * fontSize * lineHeight) + fontSize;
    }

    var gradientTop = height * 0.975;
    return (
      <g>
        {textElements}
        <rect x={0} y={gradientTop} width={width} height={height - gradientTop} fill='url(#bottom-drop-shadow)'></rect>
      </g>
    )
  }

  renderCandidate(candidates) {
    const { width, height } = this.props.imageMetrics;
    const candidate = candidates[0];

    var candidateFontSize = 70;
    var candidateLineHeight = 1.13;
    var candidateInfoFontSize = candidateFontSize * 0.7;

    var textBottom = this.getHeaderBottom() - (candidateFontSize / 2);
    var textLeft =  this.getTextLeft(width);

    var candidateInfo = `${candidate.party.abbr}`
    if (candidate.location)  candidateInfo += `-${candidate.location}`;

    return (
      <g>
        <image x={0} y={0} width={width} xlinkHref={`/img/elections/templates/list02/list02-${candidate.party.abbr.toLowerCase()}.png`}></image>
        <text className='candidate'>
          <tspan x={textLeft} y={textBottom} style={{fontSize: candidateFontSize}}>
            <tspan style={{fontWeight: 'bold'}}>{`${candidate.name}`}</tspan>
            <tspan x={textLeft} dy={candidateFontSize * 0.9} style={{fontSize: candidateInfoFontSize}}>{candidateInfo}</tspan>
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
            .list-index {
              stroke: #626262;
              fill: #626262;
            }`
          }
        </style>
        {this.renderCandidate(candidates)}
        {this.renderText(text)}
      </g>
    )
  }

}
