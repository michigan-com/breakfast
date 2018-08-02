'use strict';

import { createSelector } from 'reselect';


const templateSelector = state => ( state.Templates );

const activeTemplateSelector = (state) => {
  const { activeTemplateIndex, templates } = templateSelector(state);
  if (activeTemplateIndex < 0 || activeTemplateIndex >= templates.length) return null;
  return templates[activeTemplateIndex];
}

export const getImageMetrics = createSelector(
  activeTemplateSelector,
  (template) => {
    const width = window.innerWidth < 720 ? window.innerWidth * 0.8 : 500;
    const height = width * template.aspectRatio;
    return { width, height };
  }

)
