'use strict';

import React, { Component, PropTypes } from 'react';

import { getLinesOfText } from '../helpers/svg-text-line';
import { imagePositionToAspectRatio } from '../helpers/image-position';
import { getCandidateText } from '../helpers/candidate-info';

export default class Results03 extends Component {
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

  renderText(text, candidates) {
    const { width, fontSize, lineHeight, totalHeight } = this.props.imageMetrics

    var candidateElements = []
    for (var i = 0; i < text.length; i++) {
      var percent = text[i];
      var percentFontSize = fontSize * 2;
      var winnerTextFontSize = fontSize * 3;

      var bottom = this.getTextBottom(totalHeight, fontSize, percentFontSize, lineHeight);
      var left = this.getRectangleLeft(width, i);
      var boxHeight = this.getTextHeight(totalHeight, fontSize, percentFontSize, lineHeight);
      var top = bottom - boxHeight;
      var rectangleTop = top - (fontSize / lineHeight);
      var textLeft  = left + (width * 0.025)
      var percentTextTop = top + (2 * lineHeight * (fontSize)) + (percentFontSize / 4);

      var candidate = candidates[i];
      var secondaryText = getCandidateText(candidate);
      candidateElements.push((
        <g key={`candidate-${i}`}>
          {
            i !== 0 ? null :
            (
              <text x={left} y={top - (winnerTextFontSize * 0.75)} style={{fontSize: `${winnerTextFontSize}px`}}>WINNER</text>
            )
          }
          <rect x={left} y={rectangleTop} height={boxHeight} fill={candidate.party.color} width={(width * 0.05) / 8} stroke={candidate.party.color}/>
          <text x={textLeft} y={top} width={width / 2}>
            <tspan className='candidate-name' y={top} x={textLeft}>{candidate.name}</tspan>
            <tspan className='candidate-party-location' y={top + (fontSize * 0.75 * lineHeight)} x={textLeft} style={{fontSize: `${fontSize * 0.75}px`, fontWeight: 'bold'}}>{secondaryText}</tspan>
          </text>
          <text x={textLeft} y={percentTextTop} width={width / 2} className='text-block' key={`results02-text-${i}`}>
            <tspan
              style={{fontSize: `${percentFontSize}px`, fontWeight: 'bold'}}
              >{percent}</tspan>
            <tspan y={percentTextTop - (percentFontSize / 3)} style={{fontSize: `${percentFontSize /2}px`}}>%</tspan>
            <tspan dx={10} y={percentTextTop} style={{fontSize: `${percentFontSize * 3/4 }px`}}>votes</tspan>
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
    const { height, width } = this.props.imageMetrics;

    const backgroundImages = [];
    for (var count = 0; count < candidates.length; count++) {
      var candidate = candidates[count];
      if (!candidate.photo.img.src) continue;

      const containerAspectRatio = (width / 2) / height;
      const imageAspectRatio = candidate.photo.img.width / candidate.photo.img.height;

      backgroundImages.push(
        <image
          xlinkHref={candidate.photo.img.src}
          className={`background-image image-${count}`}
          preserveAspectRatio={imagePositionToAspectRatio(candidate.photo.props.imagePosition, imageAspectRatio, containerAspectRatio)}
          height={height}
          width={width / 2}
          y='0'
          x={(width * count)/ 2}
          key={`results03-image-${count}`}>
        </image>
      )
    }


    var gradientTop = height * 0.5;
    var dividerWidth = width * 0.01;

    var patternImages = null;
    if (variation.aspectRatio > 1) {
      patternImages = (
        <g>
          <image x='0' y='0' width={width - (dividerWidth / 2)} xlinkHref={`/img/elections/templates/versus02/versus02-${candidates[0].party.abbr.toLowerCase()}.png`}></image>
          <image x={(width / 2) + (dividerWidth / 2)} y='0' width={width} xlinkHref={`/img/elections/templates/versus02/versus02-${candidates[1].party.abbr.toLowerCase()}.png`}></image>
        </g>
      )
    }

    return (
      <g>
        {backgroundImages}
        <rect fill='url(#bottom-black-gradient)' y={gradientTop} x={0} height={height - gradientTop} width={width / 2}></rect>
        <rect fill='url(#bottom-black-gradient)' y={gradientTop} x={width / 2} height={height - gradientTop} width={width / 2}></rect>
        <rect height={height} y='0' width={dividerWidth} x={(width / 2) - (dividerWidth / 2)} fill='white'></rect>
        {patternImages}
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
        { this.renderText(text, candidates) }
      </g>
    )
  }
}
