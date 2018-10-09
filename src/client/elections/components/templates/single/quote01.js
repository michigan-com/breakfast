'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLinesOfText } from '../helpers/svg-text-line';
import { imagePositionToAspectRatio } from '../helpers/image-position';
import { getCandidateText } from '../helpers/candidate-info';

export default class Quote01 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  getTextBottom = (height) => (height);
  getTextLeft = (width) => (0)

  renderText(text, candidates) {
    const candidate = candidates[0];
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    var lines = getLinesOfText(text[0], fontSize, lineHeight, width * 0.95);
    var bottom = this.getTextBottom(height);
    var left = this.getTextLeft(width);
    var boxHeight = ((lines.length + 5) * lineHeight * (fontSize));
    var top = bottom - boxHeight;
    var textTop = top + (fontSize * 2);
    var textLeft = width * 0.05;
    const candidateTextTop = (bottom - (fontSize * lineHeight * 2));
    const candidateTextLeft = width * 0.08;

    var secondaryText = getCandidateText(candidate);
    var gradientTop = height * 0.975;
    return (
      <g>
        <rect className='text-container' x={left} y={top} width={width} height={boxHeight} fill='white'></rect>
        <text x={textLeft} y={textTop} width={width} className='text-block'>
          <tspan dx={fontSize * -0.5} >{'“'}</tspan>
          {lines.map((line, index) => (
            <tspan
              x={textLeft}
              y={textTop + (index * fontSize * lineHeight)}
              key={`quote01-text-${index}`}
              >{line}{index === (lines.length - 1) ? <tspan>{'”'}</tspan> : null}</tspan>
          ))}
        </text>
        <rect x={candidateTextLeft * 2/3} y={candidateTextTop - (fontSize * 0.75)} width={(width * 0.05)/ 8} height={(fontSize + (fontSize * 0.72 * lineHeight) * 0.9)} fill={candidate.party.color} stroke={candidate.party.color}/>
        <text x={candidateTextLeft} y={candidateTextTop} width={width} fill='black'>
          <tspan className='candidate-name' y={candidateTextTop} x={candidateTextLeft}>{candidate.name}</tspan>
          <tspan className='candidate-party-location' y={candidateTextTop+ (fontSize * 0.75 * lineHeight)} x={candidateTextLeft} style={{fontSize: `${fontSize * 0.75}px`}}>{secondaryText}</tspan>
        </text>
        <rect x={0} y={gradientTop} width={width} height={height - gradientTop} fill='url(#bottom-drop-shadow)'></rect>
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
    const candidate = candidates[0];

    return (
      <g>
        <style>
          {
            `.logo-container {
              fill: white;
            }
            svg {
              background: rgb(56, 56, 56);
            }`
          }
        </style>
        { this.renderBackground(candidates) }
        <image className='corner-pattern'
          xlinkHref={`/img/elections/templates/quote01/quote01-${candidate.party.abbr.toLowerCase()}.png`}
          x='0'
          y='0'
          width={width}
          >
        </image>
        { this.renderText(text, candidates) }
      </g>
    )
  }
}
