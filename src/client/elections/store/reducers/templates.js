'use strict';

import { DEFAULT_STATE, UPDATE_SINGLE_TEXT } from '../../actions/templates';

export default function tepmlatesReducer(state = DEFAULT_STATE, action) {

  const { activeTemplateType, templates } = state;
  if (!(activeTemplateType in templates)) return state;

  const { activeVariationIndex, variations } = templates[activeTemplateType];
  if (activeVariationIndex < 0 || activeVariationIndex >= variations.length) {
    return state;
  }

  switch (action.type) {
    case UPDATE_SINGLE_TEXT:
      var newTemplates = { ...templates };
      newTemplates[activeTemplateType].text[0] = action.value;
      return { ...state, templates: newTemplates };
  }

  return { ...state };
}
