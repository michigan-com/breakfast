'use strict';

import React from 'react';

export default function logoContainer(props) {
  const { logo, imageMetrics } = props;
  const { totalHeight, width, logoContainerHeight } = imageMetrics;

  var logoWidth = width * 0.35;
  var logoHeight = logoWidth / logo.aspectRatio;
  var electionsLogoHeight =  logoContainerHeight * 0.3;

  if (logoHeight > (logoContainerHeight * 0.8)) {
    logoHeight = logoContainerHeight * 0.6;
    logoWidth = logoHeight * logo.aspectRatio;
  }

  return (
    <g>
      <rect x='0' y={totalHeight - logoContainerHeight} height={logoContainerHeight} width={width} className='logo-container' fill='#ffffff'></rect>
      <image xlinkHref='/img/elections-logo.svg' height={electionsLogoHeight} y={totalHeight - electionsLogoHeight - ((logoContainerHeight - electionsLogoHeight) / 2)} x={width * 0.05}></image>
      <image xlinkHref={logo.imgObj ? logo.imgObj.src : ''} height={logoHeight} width={logoWidth} y={totalHeight - logoHeight - ((logoContainerHeight - logoHeight) / 2)} x={width - logoWidth - (width * 0.05)}></image>
    </g>
  )
}
