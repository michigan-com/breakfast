'use strict';

import React, { Component, PropTypes } from 'react';

import { getLinesOfText } from '../helpers/svg-text-line';

export default class Single01 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
    uploads: PropTypes.object,
  }

  getTextBottom = (height) => (height * 0.8)
  getTextLeft = (width) => (width * 0.05)

  renderText(text, templateType) {
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    var lines = getLinesOfText(text[0], fontSize, lineHeight, width);
    var bottom = this.getTextBottom(height);
    var left = this.getTextLeft(width);
    var boxHeight = ((lines.length + 1) * lineHeight * (fontSize));
    var top = bottom - boxHeight;
    var textTop = top + (fontSize * 1.5);
    var textLeft = left * 2;

    return (
      <g>
        <rect className='text-container' x={left} y={top} width={width - (left * 2)} height={boxHeight} fill='white'></rect>
        <text x={textLeft} y={textTop} width={width} className='text-block'>
          {lines.map((line, index) => (
            <tspan
              x={textLeft}
              y={textTop + (index * fontSize * lineHeight)}
              key={`single01-text-${index}`}
              >{line}</tspan>
          ))}
        </text>
      </g>
    )
  }

  renderBackground() {
    const { activeImageIndices, images } = this.props.uploads;
    const { height, width } = this.props.imageMetrics;
    if (activeImageIndices[0] === -1) return null;
    const backgroundImage = images[activeImageIndices[0]];

    var gradientTop = height * 0.5;

    return (
      <g>
        <image className='background-image' preserveAspectRatio='xMinYMin slice' xlinkHref={backgroundImage.img.src} height={height} width={width} y='0' x='0'></image>
        <rect fill='url(#bottom-black-gradient)' y={gradientTop} x={0} height={height - gradientTop} width={width}></rect>
      </g>
    )
  }

  renderCandidates(candidates) {
    const candidate = candidates[0];

    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    const top = this.getTextBottom(height);
    const left = this.getTextLeft(width);
    const boxHeight = (fontSize * 3 * lineHeight);
    const textTop = top + (fontSize * 1.5);
    const textLeft = left * 2;

    var secondaryText = `${candidate.party}`;
    if (candidate.location) secondaryText += ` - ${candidate.location}`;

    // TODO pull color based on candidate
    return (
      <g>
        <rect x={left} y={top} width={width - (left * 2)} height={boxHeight} fill='rgb(8, 43, 149)'/>
        <text x={textLeft} y={textTop} width={width} fill='white'>
          <tspan className='candidate-name' y={textTop} x={textLeft}>{candidate.name}</tspan>
          <tspan className='candidate-party-location' y={textTop + (fontSize * lineHeight)} x={textLeft}>{secondaryText}</tspan>
        </text>
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
            }`
          }
        </style>
        { this.renderBackground() }
        { this.renderText(text) }
        { this.renderCandidates(candidates)}
      </g>
    )
  }
}
