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
    const candidateFontSize = fontSize * 0.8;
    var lines = getLinesOfText(text[0], fontSize, lineHeight, width * 0.95);
    var bottom = this.getTextBottom(height);
    var left = this.getTextLeft(width);
    var boxHeight = ((lines.length + 3) * lineHeight * (fontSize));
    var top = bottom - boxHeight;
    var textTop = top + (fontSize * 2);
    var textLeft = width * 0.05;
    const candidateTextTop = (bottom - (candidateFontSize * lineHeight));

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
        <text x={textLeft} y={candidateTextTop} width={width} fill='black' fontWeight='bold' style={{fontSize: candidateFontSize}}>
          <tspan className='candidate-name'>
            {candidate.name}
          </tspan>
          {
            candidate.party.abbr.toLowerCase() !== 'o' ?
              (
                <tspan className='simple-candidate-party' fill={candidate.party.color}>
                  { ` (${candidate.party.abbr})` }
                </tspan>
              ) : null
          }
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
    const { width, height, cornerElementWidth } = this.props.imageMetrics;
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
            }
            `
          }
        </style>
        { this.renderBackground(candidates) }
        <image className='corner-pattern'
          xlinkHref={'/img/elections/graphics/2020/2020-corner-element.png'}
          x='0'
          y='0'
          width={cornerElementWidth}
          >
        </image>
        { this.renderText(text, candidates) }
      </g>
    )
  }
}
