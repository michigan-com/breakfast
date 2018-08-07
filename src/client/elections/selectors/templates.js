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

export const getImageMetrics = createSelector(
  activeAspectRatio,
  (aspectRatio) => {
    if (aspectRatio === null) aspectRatio = 1;

    const width = window.innerWidth < 500 ? window.innerWidth * 2 : 1080;
    const totalHeight = width * aspectRatio;
    const logoContainerHeight = totalHeight * 0.1;
    const height = totalHeight - logoContainerHeight;
    const fontSize = 32;
    const lineHeight = 1.25;
    return { width, totalHeight, height, fontSize, lineHeight, logoContainerHeight };
  }

)
