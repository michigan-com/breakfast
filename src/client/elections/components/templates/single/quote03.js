'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLinesOfText } from '../helpers/svg-text-line';
import { imagePositionToAspectRatio } from '../helpers/image-position';
import { getCandidateText } from '../helpers/candidate-info';

export default class Single03 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  getTextBottom = (height) => (Math.floor(height * 0.95));
  getTextLeft = (width) => (width * 0.05);

  renderText(text, candidates) {
    const candidate = candidates[0];
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    var lines = getLinesOfText(text[0], fontSize, lineHeight, width * 0.875);
    var bottom = this.getTextBottom(height);
    var left = this.getTextLeft(width);
    var boxHeight = ((lines.length + 5) * lineHeight * (fontSize));
    var top = bottom - boxHeight;
    var textTop = top + (fontSize * 2);
    var textLeft = left * 2;
    const candidateTextTop = (bottom - (fontSize * 2 * lineHeight));
    const candidateTextLeft = left * 2;

    var secondaryText = getCandidateText(candidate);
    var gradientTop = height * 0.975;
    return (
      <g>
        <rect className='text-container' x={left} y={top} width={width - (left * 2)} height={boxHeight} fill='rgba(256, 256, 256, 0.93)'></rect>
        <text x={textLeft} y={textTop} width={width} className='text-block'>
          <tspan dx={fontSize * -0.5} >{'“'}</tspan>
          {lines.map((line, index) => (
            <tspan
              x={textLeft}
              y={textTop + (index * fontSize * lineHeight)}
              key={`single03-text-${index}`}
              >{line}{index === (lines.length - 1) ? <tspan>{'”'}</tspan> : null}</tspan>
          ))}
        </text>
        <text x={candidateTextLeft} y={candidateTextTop} width={width} fill='black'>
          <tspan className='candidate-name' y={candidateTextTop} x={candidateTextLeft}>{candidate.name}</tspan>
          <tspan className='candidate-party-location' y={candidateTextTop + (fontSize * 0.75 * lineHeight)} x={candidateTextLeft} style={{fontSize: `${fontSize * 0.75}px`}}>{secondaryText}</tspan>
        </text>
      </g>
    )
  }

  renderBackground(candidates) {
    const candidate = candidates[0];
    const { height, width } = this.props.imageMetrics;
    if (!candidate.photo.img.src) return null;

    const containerAspectRatio = width / height;
    const imageAspectRatio = candidate.photo.img.width / candidate.photo.img.height;

    var gradientTop = height * 0.5;

    return (
      <g>
        <image
          className='background-image'
          preserveAspectRatio={imagePositionToAspectRatio(candidate.photo.props.imagePosition, imageAspectRatio, containerAspectRatio)}
          xlinkHref={candidate.photo.img.src}
          height={height}
          width={width}
          y='0'
          x='0'
          >
        </image>
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
        { this.renderBackground(candidates) }
        { this.renderText(text, candidates) }
      </g>
    )
  }
}
