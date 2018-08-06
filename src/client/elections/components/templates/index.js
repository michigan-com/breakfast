'use strict';

import React, { PropTypes, Component } from 'react';

import LogoContainer from './helpers/logo-container';
import single01 from './single/single01';
import single02 from './single/single02';
import single03 from './single/single03';
import versus01 from './versus/versus01';
import versus02 from './versus/versus02';

export const ALL_TEMPLATES = {
  'single01': single01,
  'single02': single02,
  'single03': single03,

  'versus01': versus01,
  'versus02': versus02,
}

export class ElectionsTemplate extends Component {
  static propTypes = {
    templateName: PropTypes.string,
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.svg = null
  }

  getSVG() {
    return this.svg;
  }

  renderTemplate() {
    const { templateName, text, candidates, imageMetrics } = this.props;

    if (!(templateName in ALL_TEMPLATES)) return (<text y={imageMetrics.height / 2} x='0'>Template not found</text>);

    return React.createElement(
      ALL_TEMPLATES[templateName],
      { ...this.props },
    )
  }

  render() {
    const { logo, imageMetrics, templateName } = this.props;
    const { width, totalHeight, fontSize } = imageMetrics;

    return (
      <svg xmlns="http://www.w3.org/2000/svg" height={totalHeight} width={ width} ref={(s) => { this.svg = s;}}>
        <style id="svg-styles">
          {
            `@font-face {
              font-family: 'Unify Sans';
              src: url('/fonts/UnifySans/UnifySans_SBd.ttf') format('truetype');
              font-style: normal;
              font-weight: 700;
            }
            @font-face {
              font-family: 'Unify Sans';
              src: url('/fonts/UnifySans/UnifySans_Bd.ttf') format('truetype');
              font-style: normal;
              font-weight: 900;
            }
            @font-face {
              font-family: 'Unify Sans';
              src: url('/fonts/UnifySans/UnifySans_Rg.ttf') format('truetype');
              font-style: normal;
              font-weight: normal;
            }
            text {
              font-family: 'Unify Sans';
              font-size: ${fontSize}px;
            }
            `
          }
        </style>
        <defs>
          <linearGradient id="bottom-black-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="100%"  stopColor="black"/>
          </linearGradient>
          <linearGradient id="bottom-drop-shadow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="100%"  stopColor="rgba(64, 64, 64, 0.3)"/>
          </linearGradient>
        </defs>

        { this.renderTemplate() }
        <LogoContainer logo={logo} imageMetrics={imageMetrics}/>
      </svg>
    )
  }
}
