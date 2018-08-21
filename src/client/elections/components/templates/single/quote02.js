'use strict';

import React, { Component, PropTypes } from 'react';

import { getLinesOfText } from '../helpers/svg-text-line';
import { imagePositionToAspectRatio } from '../helpers/image-position';

export default class Quote02 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  getTextBottom = (height) => (Math.floor(height * 0.8))
  getTextLeft = (width) => (width * 0.05)

  renderText(text, templateType) {
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    var lines = getLinesOfText(text[0], fontSize, lineHeight, width * 0.875);
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
          <tspan dx={fontSize * -0.5} >{'“'}</tspan>
          {lines.map((line, index) => (
            <tspan
              x={textLeft}
              y={textTop + (index * fontSize * lineHeight)}
              key={`quote02-text-${index}`}
              >{line}{index === (lines.length - 1) ? <tspan>{'”'}</tspan> : null}</tspan>
          ))}
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
          x='0'>
        </image>
        <rect fill='url(#bottom-black-gradient)' y={gradientTop} x={0} height={height - gradientTop} width={width}></rect>
      </g>
    )
  }

  renderCandidates(candidates) {
    const candidate = candidates[0];

    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    var candidateFontSize = fontSize * 1.2;
    const top = this.getTextBottom(height);
    const left = this.getTextLeft(width);
    const boxHeight = (fontSize * 3 * lineHeight);
    const textTop = top + (fontSize * 2);
    const textLeft = left * 2;

    var secondaryText = `${candidate.party.abbr}`;
    if (candidate.location) secondaryText += `-${candidate.location}`;

    return (
      <g>
        <image x={left} y={top} width={width - (left * 2)} xlinkHref={`/img/elections/templates/quote02/quote02-${candidate.party.abbr.toLowerCase()}.png`}></image>
        <text x={textLeft} y={textTop} width={width} fill='white' style={{fontSize: candidateFontSize}}>
          <tspan className='candidate-name' y={textTop} x={textLeft}>{candidate.name}</tspan>
          <tspan className='candidate-party-location' y={textTop + (candidateFontSize * lineHeight)} x={textLeft}>{secondaryText}</tspan>
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
        { this.renderBackground(candidates) }
        { this.renderText(text) }
        { this.renderCandidates(candidates)}
      </g>
    )
  }
}
