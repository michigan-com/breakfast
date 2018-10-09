'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LogoContainer from './helpers/logo-container';
import quote01 from './single/quote01';
import quote02 from './single/quote02';
import quote03 from './single/quote03';
import quote04 from './single/quote04';
import fact01 from './single/fact01';
import versus01 from './versus/versus01';
import versus02 from './versus/versus02';
import versus03 from './versus/versus03';
import list01 from './list/list01';
import list02 from './list/list02';
import results01 from './results/results01.js';
import results03 from './results/results03.js';

export const ALL_TEMPLATES = {
  'quote01': quote01,
  'quote02': quote02,
  'quote03': quote03,
  'quote04': quote04,

  'versus01': versus01,
  'versus02': versus02,
  'versus03': versus03,

  'results01' : results01,
  'results03' : results03,

  'list01': list01,
  'list02': list02,

  'fact01': fact01,
}

export class ElectionsTemplate extends Component {
  static propTypes = {
    templateName: PropTypes.string,
    imageMetrics: PropTypes.object,
    text: PropTypes.array,
    candidates: PropTypes.array,
    logo: PropTypes.object,
    variation: PropTypes.object,
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
      <svg xmlns="http://www.w3.org/2000/svg" height={totalHeight} width={width} ref={(s) => { this.svg = s;}}>
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
            text {
              letter-spacing: 0.05em;
            }
            `
          }
        </style>
        <defs>
          <linearGradient id="bottom-black-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop stopColor="#000000" stopOpacity="0" offset="0%"></stop>
            <stop stopColor="#000000" stopOpacity="0.2" offset="20%"></stop>
            <stop stopColor="#000000" stopOpacity="0.4" offset="40%"></stop>
            <stop stopColor="#000000" stopOpacity="0.6" offset="60%"></stop>
            <stop stopColor="#000000" stopOpacity="0.8" offset="80%"></stop>
            <stop stopColor="#000000" offset="100%"></stop>
          </linearGradient>
          <linearGradient id="bottom-drop-shadow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="100%"  stopColor="rgba(64, 64, 64, 0.1)"/>
          </linearGradient>
        </defs>

        { this.renderTemplate() }
        <LogoContainer logo={logo} imageMetrics={imageMetrics}/>
      </svg>
    )
  }
}
