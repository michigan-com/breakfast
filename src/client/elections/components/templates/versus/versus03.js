'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLinesOfText } from '../helpers/svg-text-line';
import { imagePositionToAspectRatio } from '../helpers/image-position';
import { getCandidateText } from '../helpers/candidate-info';

export default class Versus03 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  getTextBottom = (height, index = 0) => {
    return index === 0 ? height * 2 / 5 : height * 9 / 10;
  };
  getTextLeft = (width, index = 0) => {
    return index === 0 ?  width * 0.025 + (width / 2): width * 0.025;
  };

  renderText(text, templateType) {
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    const { candidates } = this.props;

    var textElements = []
    for (var i = 0; i < text.length; i++) {
      var lines = getLinesOfText(text[i], fontSize, lineHeight, width * 0.47);
      var candidate = candidates[i];

      const left = this.getTextLeft(width, i);
      const boxHeight = ((lines.length + 1) * lineHeight * (fontSize));
      const textTop = (height / 4) - (boxHeight / 2) + (height * i / 2);
      const textLeft = left + (width * 0.025);
      const candidateTextLeft = left + (width * 0.05);
      const candidateTextTop = textTop + boxHeight;

      var secondaryText = getCandidateText(candidate);

      textElements.push((
        <g key={`versus02-text-${i}`}>
>
          <text x={textLeft} y={textTop} width={width} className='text-block' key={`versus03-text-${i}`}>
            {lines.map((line, index) => (
              <tspan
                x={textLeft}
                y={textTop + (index * fontSize * lineHeight)}
                key={`versus02-text-line-${index}`}
                >{line}</tspan>
            ))}
          </text>

          <rect x={candidateTextLeft - (width * 0.025)} y={candidateTextTop - (fontSize * 0.8)} width={(width * 0.05)/ 8} height={(fontSize + (fontSize * 0.72 * lineHeight) * 0.9)} fill={candidate.party.color} stroke={candidate.party.color}/>
          <text x={candidateTextLeft} y={candidateTextTop} width={width / 2 } fill='black'>
            <tspan className='candidate-name' y={candidateTextTop} x={candidateTextLeft}>{candidate.name}</tspan>
            <tspan className='candidate-party-location' y={candidateTextTop + (fontSize * 0.75 * lineHeight)} x={candidateTextLeft} style={{fontSize: `${fontSize * 0.75}px`}}>{secondaryText}</tspan>
          </text>
        </g>
      ));
    }

    return (
      <g>
        {textElements}
      </g>
    )
  }

  renderBackground() {
    const { candidates } = this.props;
    const { height, width, logoContainerHeight} = this.props.imageMetrics;

    const backgroundImages = [];
    const imageDividerWidth = width * 0.0075;
    for (var count = 0; count < candidates.length; count++) {
      var candidate = candidates[count];
      if (!candidate.photo.img.src) continue;

      const containerAspectRatio = (width / 4) / height;
      const imageAspectRatio = candidate.photo.img.width / candidate.photo.img.height;

      const top = ((width - logoContainerHeight) * count) / 2;
      const dividerLeft = (width / 2) - (imageDividerWidth / 2);
      const dividerTriangleHeight  = (height * 0.1);
      backgroundImages.push((
        <g key={`versus01-image-${count}`}>

          <image
            xlinkHref={candidate.photo.img.src}
            className={`background-image image-${count}`}
            preserveAspectRatio={imagePositionToAspectRatio(candidate.photo.props.imagePosition, imageAspectRatio, containerAspectRatio)}
            height={height / 2}
            width={width / 2 - (count === 0 ? imageDividerWidth : 0)}
            y={(height * count) / 2}
            x={((width * count)/ 2)}>
          </image>
          <path d={`M ${dividerLeft},${top}
                    L ${dividerLeft},${top + (height / 4) - (dividerTriangleHeight / 2)}
                    L ${dividerLeft - ((count === 0 ? 1 : -1) * dividerTriangleHeight / 2)},${top + (height / 4)}
                    L ${dividerLeft},${top + (height / 4) + (dividerTriangleHeight / 2)}
                    L ${dividerLeft},${top + (height / 2)}`}
                stroke={candidate.party.color}
                strokeWidth={imageDividerWidth}
                fill='rgb(56, 56, 56)'
                >
          </path>
        </g>
      ))
    }


    const gradientTop = height * 0.5;
    const dividerWidth = width * 0.01;
    return (
      <g>
        {backgroundImages}
        <rect height={height} y={(height / 2) - (dividerWidth / 2)} width={width} height={dividerWidth} x={0} fill='white'></rect>
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
            }
            text {
              fill: white;
            }`
          }
        </style>
        { this.renderBackground() }
        { this.renderText(text) }
      </g>
    )
  }
}
