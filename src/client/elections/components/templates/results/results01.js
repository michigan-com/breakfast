'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getLinesOfText } from '../helpers/svg-text-line';
import { imagePositionToAspectRatio } from '../helpers/image-position';
import { getCandidateText } from '../helpers/candidate-info';

export default class Results01 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
    variation: PropTypes.object,
    activeTemplate: PropTypes.object,
  }

  getTextHeight = (height, fontSize, percentFontSize, lineHeight) => {
    return  (1.75 * lineHeight * (fontSize)) + (percentFontSize * 0.9);
  };
  getTextBottom = (height) => (height * 0.84);
  getTextLeft = (width, index = 0) => (width * 0.05 + ((width * index) / 2));
  getRectangleLeft = (width, index = 0) => (width * 0.05 + ((width * index) / 2));

  renderText() {
    const { candidates, numbers } = this.props;
    const { width, fontSize, lineHeight, totalHeight } = this.props.imageMetrics

    var candidateElements = []
    for (var i = 0; i < numbers.length; i++) {
      var percent = numbers[i];
      var percentFontSize = fontSize * 2;

      var bottom = this.getTextBottom(totalHeight, fontSize, percentFontSize, lineHeight);
      var left = this.getRectangleLeft(width, i);
      var boxHeight = this.getTextHeight(totalHeight, fontSize, percentFontSize, lineHeight);
      var top = bottom - boxHeight;
      var textLeft = left;
      var percentTextTop = top + percentFontSize;
      var candidateTextTop = top + (2.2 * percentFontSize);

      var candidate = candidates[i];
      var secondaryText = getCandidateText(candidate);
      candidateElements.push((
        <g key={`candidate-${i}`}>
          {
            i !== 0 ? null :
            (
              <text x={left} y={top} style={{fontSize: `${percentFontSize}px`, fontWeight: 'bold' }}>WINNER</text>
            )
          }
          <text x={textLeft} y={percentTextTop} width={width / 2} className='text-block' key={`results02-text-${i}`} style={{fontSize: `${percentFontSize}px`, fontWeight: 'bold'}}>
            {`${percent}% votes`}
          </text>
          <text x={textLeft} y={candidateTextTop} width={width / 2}>
            <tspan className='candidate-name' y={candidateTextTop} x={textLeft}>{candidate.name}</tspan>
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
      ));
    }

    return (
      <g>
        {candidateElements}
      </g>
    )
  }

  renderBackground() {
    const { variation } = this.props;
    const { candidates } = this.props;
    const { totalHeight, width } = this.props.imageMetrics;

    const backgroundImages = [];
    for (var count = 0; count < candidates.length; count++) {
      var candidate = candidates[count];
      if (!candidate.photo.img.src) continue;

      const containerAspectRatio = (width / 2) / totalHeight;
      const imageAspectRatio = candidate.photo.img.width / candidate.photo.img.height;

      backgroundImages.push(
        <image
          xlinkHref={candidate.photo.img.src}
          className={`background-image image-${count}`}
          preserveAspectRatio={imagePositionToAspectRatio(candidate.photo.props.imagePosition, imageAspectRatio, containerAspectRatio)}
          height={totalHeight}
          width={width / 2}
          y='0'
          x={(width * count)/ 2}
          key={`results01-image-${count}`}>
        </image>
      )
    }


    var gradientTop = totalHeight * 0.5;
    var dividerWidth = width * 0.01;

    return (
      <g>
        {backgroundImages}
        <rect fill='url(#bottom-black-gradient)' y={gradientTop} x={0} height={totalHeight - gradientTop} width={width / 2}></rect>
        <rect fill='url(#bottom-black-gradient)' y={gradientTop} x={width / 2} height={totalHeight - gradientTop} width={width / 2}></rect>
        <rect height={totalHeight} y='0' width={dividerWidth} x={(width / 2) - (dividerWidth / 2)} fill='url(#2020-elections-gradient)'></rect>
      </g>
    )
  }

  render() {

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
        { this.renderText() }
      </g>
    )
  }
}
