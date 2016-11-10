'use strict';

import { createSelector } from 'reselect';

import { canvasMetricsSelector } from './background';
import { BLOCK_TYPES } from '../actions/text';

const textSelector = (state) => state.Text.present;

function getStyleMetrics(blockType, canvasHeight) {
  function generateStyle(fontSize) {
    const lineHeight = fontSize * 1.05;
    const marginBottom = fontSize * 0.65;
    return { fontSize, lineHeight, marginBottom };
  }

  // These are for the regular sized canvas
  // If we have a smaller canvas, we have to scale it down
  // let pFontSize = 16.5; // 325 * 0.06
  const pFontSize = canvasHeight * 0.05;
  // const  h1FontSize = 33.5 * 2; // 325 * 0.1
  const h1FontSize = canvasHeight * 0.1;
  // const  h2FontSize = 26 * 2;
  const h2FontSize = canvasHeight * 0.08;
  // const  h3FontSize = 19.5 * 2;
  const h3FontSize = canvasHeight * 0.06;

  // Scale up
  // pFontSize *= 2;
  // h1FontSize *= 2;
  // h2FontSize *= 2;
  // h3FontSize *= 2;


  switch (blockType) {
    case 'header-one':
      return {
        ...generateStyle(h1FontSize),
        fontWeight: 'bold',
      };
    case 'header-two':
      return {
        ...generateStyle(h2FontSize),
        fontWeight: 'bold',
      };
    case 'header-three':
      return {
        ...generateStyle(h3FontSize),
        fontWeight: 'bold',
      };
    case 'unstyled':
    default:
      return {
        ...generateStyle(pFontSize),
        fontWeight: 'normal',
      };
  }
}

export const blockStyleMetricsSelector = createSelector(
  canvasMetricsSelector,
  (canvasMetrics) => {
    const blockStyleMetrics = BLOCK_TYPES.map((blockType) => {
      const styleMetrics = getStyleMetrics(blockType.style, canvasMetrics.canvasHeight);
      let tagName = 'span';
      switch (blockType.style) {
        case 'header-one':
          tagName = 'h1';
          break;
        case 'header-two':
          tagName = 'h2';
          break;
        case 'header-three':
          tagName = 'h3';
          break;
        case 'unordered-list-item':
          tagName = 'ul';
          break;
        case 'ordered-list-item':
          tagName = 'ol';
          break;
        default:
          break;
      }

      return { ...styleMetrics, tagName, blockType };
    });

    return blockStyleMetrics;
  });
