'use strict';

import { createSelector } from 'reselect';


const templateSelector = state => ( state.Templates );

export const activeAspectRatio = (state) => {
  const { activeTemplateType, templates } = templateSelector(state);
  if (!(activeTemplateType in templates)) return null;
  var template = templates[activeTemplateType];

  if (template.activeVariationIndex < 0 || template.activeVariationIndex > template.variations.length) {
    return null;
  }

  return template.variations[template.activeVariationIndex].aspectRatio;
}

export const activeTemplate = (state) => {
  const { activeTemplateType, templates } = templateSelector(state);
  const template = templates[activeTemplateType];
  return template.variations[template.activeVariationIndex];
}

export const getImageMetrics = createSelector(
  activeAspectRatio,
  activeTemplate,
  (aspectRatio, template) => {
    if (aspectRatio === null) aspectRatio = 1;

    const width = window.innerWidth < 500 ? window.innerWidth * 2 : 1080;
    const totalHeight = width * aspectRatio;
    const logoContainerHeight = Math.round(totalHeight * 0.065);
    const height = totalHeight - logoContainerHeight + 2;
    const fontSize = template.fontSize || 36;
    const lineHeight = 1.25;
    const marginLeft = 75;
    const marginTop = 60;
    const cornerElementWidth = width * 0.35;
    return {
      width,
      totalHeight,
      height,
      fontSize,
      lineHeight,
      logoContainerHeight,
      marginLeft,
      marginTop,
      cornerElementWidth,
    };
  }

)
