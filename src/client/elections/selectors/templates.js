'use strict';

import { createSelector } from 'reselect';


const templateSelector = state => ( state.Templates );

export const activeTemplateSelector = (state) => {
  const { activeTemplateType, templates } = templateSelector(state);
  if (!(activeTemplateType in templates)) return null;
  var template = templates[activeTemplateType];

  if (template.activeVariationIndex < 0 || template.activeVariationIndex > template.variations.length) {
    return null;
  }

  return template.variations[template.activeVariationIndex];
}

export const getImageMetrics = createSelector(
  activeTemplateSelector,
  (template) => {
    if (template === null) return { width: 499, height: 499 };

    const width = window.innerWidth < 720 ? window.innerWidth * 0.8 : 500;
    const height = width * template.aspectRatio;
    const fontSize = 16;
    const lineHeight = 1.1;
    return { width, height, fontSize, lineHeight };
  }

)
