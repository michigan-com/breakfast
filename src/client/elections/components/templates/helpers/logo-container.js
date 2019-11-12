'use strict';

import React from 'react';

export default function logoContainer(props) {
  const { logo, imageMetrics, logoType } = props;
  const { totalHeight, width, logoContainerHeight, marginLeft, marginTop } = imageMetrics;

  const darkLogo = logoType !== 'light';
  const renderBackground = darkLogo && logoType.indexOf('no-background') < 0;

  var logoWidth = width * 0.3;
  var logoHeight = logoWidth / logo.aspectRatio;
  var electionsLogoHeight =  logoContainerHeight;

  if (logoHeight > (logoContainerHeight * 0.8)) {
    logoHeight = logoContainerHeight * 0.6;
    logoWidth = logoHeight * logo.aspectRatio;
  }

  // election logo
  const electionsLogoLink = `/img/elections/graphics/2020/2020-elections-logo-${darkLogo ? 'dark' : 'light'}.png`;

  // market logo 
  let marketLogoLink = `${logo.imgObj ? logo.imgObj.src : ''}`;

  // replace exiting URL params that get appended somewhere
  marketLogoLink = marketLogoLink.replace(/\?color=[^\&\?]+/g, '');

  // now color it accordingly 
  marketLogoLink = `${marketLogoLink}?color=${darkLogo ? '404040' : 'fff'}`;

  return (
    <g>
      {
        renderBackground ? 
          (<rect x='0' y={totalHeight - logoContainerHeight} height={logoContainerHeight} width={width} className='logo-container' fill='#ffffff'></rect>)
          : null
      }
      <image xlinkHref={electionsLogoLink} height={electionsLogoHeight} y={totalHeight - electionsLogoHeight - ((logoContainerHeight - electionsLogoHeight) / 2)} x={10}></image>
      <image xlinkHref={marketLogoLink} height={logoHeight} width={logoWidth} y={totalHeight - logoHeight - ((logoContainerHeight - logoHeight) / 2)} x={width - logoWidth - (width * 0.03)}></image>
    </g>
  )
}
