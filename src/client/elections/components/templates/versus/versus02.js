'use strict';

import React, { Component, PropTypes } from 'react';

import { getLinesOfText } from '../helpers/svg-text-line';

export default class Versus02 extends Component {
  static propTypes = {
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
    uploads: PropTypes.object,
  }

  getTextBottom = (height, index = 0) => {
    return index === 0 ? height * 2 / 5 : height * 9 / 10;
  };
  getTextLeft = (width, index = 0) => {
    return index === 0 ?  width * 0.025 + (width / 2): width * 0.025;
  };

  renderText(text, templateType) {
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics

    var textElements = []
    for (var i = 0; i < text.length; i++) {
      var lines = getLinesOfText(text[i], fontSize, lineHeight, width * 0.55);

      var bottom = this.getTextBottom(height, i);
      var left = this.getTextLeft(width, i);
      var boxHeight = ((lines.length + 2) * lineHeight * (fontSize));
      var top = bottom - boxHeight;
      var textTop = top + (fontSize * 2);
      var textLeft = left + (width * 0.025);

      textElements.push((
        <text x={textLeft} y={textTop} width={width} className='text-block' key={`versus02-text-${i}`}>
          {lines.map((line, index) => (
            <tspan
              x={textLeft}
              y={textTop + (index * fontSize * lineHeight)}
              key={`versus02-text-${index}`}
              >{line}</tspan>
          ))}
        </text>
      ));
    }

    return (
      <g>
        {textElements}
      </g>
    )
  }

  renderBackground() {
    const { activeImageIndices, images } = this.props.uploads;
    const { height, width } = this.props.imageMetrics;

    const backgroundImages = [];
    for (var count = 0; count < activeImageIndices.length; count++) {
      var index = activeImageIndices[count];
      if (index < 0 || index >= images.length) continue;

      const backgroundImage = images[index];
      backgroundImages.push(
        <image
          xlinkHref={backgroundImage.img.src}
          className={`background-image image-${count}`}
          preserveAspectRatio='xMidYMin slice'
          height={height / 2}
          width={width / 2}
          y={(height * count) / 2}
          x={(width * count)/ 2}
          key={`versus01-image-${count}`}>
        </image>
      )
    }


    var gradientTop = height * 0.5;

    var dividerWidth = width * 0.01;
    return (
      <g>
        {backgroundImages}
        <rect height={height} y={(height / 2) - (dividerWidth / 2)} width={width} height={dividerWidth} x={0} fill='white'></rect>
      </g>
    )
  }

  renderCandidates(candidates) {
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics

    // TODO pull color based on candidate
    return (
      <g>
        {
          candidates.map((candidate, i) => {
            const top = this.getTextBottom(height, i);
            const left = this.getTextLeft(width, i);
            const boxHeight = (fontSize * 3);
            const textTop = (top + (boxHeight / 2)) - (fontSize / 2);
            const textLeft = left + (width * 0.025);
            var secondaryText = `${candidate.party}`;
            if (candidate.location) secondaryText += ` - ${candidate.location}`;

            return (
              <text x={textLeft} y={textTop} width={width / 2 } fill='black'>
                <tspan className='candidate-name' y={textTop} x={textLeft}>{candidate.name}</tspan>
                <tspan className='candidate-party-location' y={textTop + (fontSize * 0.75 * lineHeight)} x={textLeft} style={{fontSize: `${fontSize * 0.75}px`}}>{secondaryText}</tspan>
              </text>
            )

          })
        }
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
        { this.renderCandidates(candidates)}
      </g>
    )
  }
}
