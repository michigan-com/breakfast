'use strict';

import React, { PropTypes, Component } from 'react';

import { getLinesOfText } from '../helpers/svg-text-line';

export default class Quote04 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  boxMargin = (width) => (width * 0.03);
  textLeft = (width) => (width * 0.16);

  renderText(text, candidate) {
    const { width, height, fontSize, lineHeight } = this.props.imageMetrics;

    var boxMargin = this.boxMargin(width);
    var boxWidth = width - (boxMargin * 2);
    var boxHeight = height - (boxMargin * 2);

    var giantQuoteFontSize = 400;
    var lines = getLinesOfText(text[0], fontSize, lineHeight, width * 0.7);
    var textHeight = (lines.length + 2) * fontSize * lineHeight;
    var textTop = (height / 2) - (textHeight / 2);
    var textLeft = this.textLeft(width);

    var candidateTextTop = textTop + ((lines.length + 1) * fontSize * lineHeight);
    var candidateInfo = `${candidate.party.abbr}`
    if (candidate.location)  candidateInfo += `-${candidate.location}`;

    return (
      <g>
        <rect x={boxMargin} y={boxMargin} width={boxWidth} height={boxHeight} fill='rgba(256, 256, 256, 0.9)'></rect>
        <text x={textLeft} y={textTop}>
          <tspan dx={-25} dy={(fontSize * -3) + (giantQuoteFontSize / 2) } style={{fontSize: giantQuoteFontSize, fontFamily: 'Unify Serif'}} fill={candidate.party.color}>{'“'}</tspan>
          {
            lines.map((l, i) => (
              <tspan x={textLeft} y={textTop + (i * fontSize * lineHeight)} style={{fontWeight: 'bold'}} key={`text-line-${i}`}>{l}</tspan>
            ))
          }
        </text>
        <text x={textLeft} y={candidateTextTop}>
          <tspan style={{textTransform: 'uppercase'}}>{candidate.name}</tspan>
        </text>
        <text x={textLeft} y={candidateTextTop + (fontSize * lineHeight)}>{candidateInfo}</text>
      </g>
    )
  }

  render() {
    const { width, height } = this.props.imageMetrics;
    const candidate = this.props.candidates[0];
    return (
      <g>
        <rect x='0' y='0' width={width} height={height} fill={candidate.party.color}></rect>
        {this.renderText(this.props.text, this.props.candidates[0])}
      </g>
    )
  }
}
