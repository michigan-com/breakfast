'use strict';

import React, { Component, PropTypes } from 'react';

import { getLinesOfText } from '../helpers/svg-text-line';

export default class List01 extends Component {

  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
    uploads: PropTypes.object,
  }

  getTextLeft = (width) => (width * 0.2);

  renderText(text) {

    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    var totalLines = 0;
    var allLines = [];
    var largestLineCount = 0;
    for (var i = 0; i < text.length; i++) {
      var lines = getLinesOfText(text[i], fontSize, lineHeight, width * 0.9);
      allLines.push(lines);
      totalLines += lines.length;
      if (lines.length > largestLineCount) largestLineCount = lines.length;
    }

    var textHeight = ((largestLineCount + 1) * fontSize * lineHeight) * text.length;
    var top = (height / 2) - (textHeight / 2) + fontSize;  // TODO add topper height
    var left = this.getTextLeft(width);

    var textElements = [];
    var textTop = top;
    var listIndexFontSize = largestLineCount * fontSize;
    for (var i = 0; i < allLines.length; i++) {
      const lines = allLines[i]
      textElements.push((
        <text x={left} y={textTop} key={`list-item-${i}`}>
          <tspan x={(left / 2) - (listIndexFontSize / 3)} y={textTop - fontSize +  (largestLineCount * fontSize / 2) + (listIndexFontSize / 2)} className='list-index' style={{fontSize: `${listIndexFontSize}px`}}>{i+1}</tspan>
          {
            lines.map((l, lineIndex) => (
              <tspan x={left} y={textTop + (lineIndex * fontSize * lineHeight)} key={`line-item-${lineIndex}`}>{l}</tspan>
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
        {this.renderText(text)}
      </g>
    )
  }

}
