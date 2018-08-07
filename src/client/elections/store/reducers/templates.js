'use strict';

import { DEFAULT_STATE, UPDATE_SINGLE_TEXT, UPDATE_VERSUS_TEXT, SELECT_TEMPLATE_VARIATION,
  UPDATE_ASPECT_RATIO, UPDATE_LIST_TEXT, ADD_LIST_ITEM} from '../../actions/templates';

export default function tepmlatesReducer(state = DEFAULT_STATE, action) {

  var { activeTemplateType, templates } = state;
  if (!(activeTemplateType in templates)) return state;

  var { activeVariationIndex, variations } = templates[activeTemplateType];
  if (activeVariationIndex < 0 || activeVariationIndex >= variations.length) {
    return state;
  }

  var newTemplates = { ...templates };

  switch (action.type) {
    case UPDATE_SINGLE_TEXT:
      newTemplates[activeTemplateType].text[0] = action.value;
      return { ...state, templates: newTemplates };
    case UPDATE_VERSUS_TEXT:
      if (action.value.textIndex < 0 || action.value.textIndex > newTemplates[activeTemplateType].text.length) return state;

      newTemplates[activeTemplateType].text[action.value.textIndex] = action.value.text;
      return { ...state, templates: newTemplates };

    case UPDATE_LIST_TEXT:
      if (action.value.textIndex < 0 || action.value.textIndex > newTemplates[activeTemplateType].text.length) return state;

      newTemplates[activeTemplateType].text[action.value.textIndex] = action.value.text;
      return { ...state, templates: newTemplates }

    case ADD_LIST_ITEM:
      newTemplates[activeTemplateType].text.push('');
      return { ...state, templates: newTemplates }

    case SELECT_TEMPLATE_VARIATION:
      activeTemplateType = action.value.templateType;
      if (!(activeTemplateType in newTemplates)) return state;

      var { activeVariationIndex, variations } = newTemplates[activeTemplateType];
      activeVariationIndex = action.value.activeVariationIndex;
      if (activeVariationIndex < 0 || activeVariationIndex >= variations.length) return state;

      newTemplates[activeTemplateType].activeVariationIndex = activeVariationIndex;
      return { ...state, activeTemplateType, templates: newTemplates };

    case UPDATE_ASPECT_RATIO:
      var activeVariation = newTemplates[activeTemplateType].variations[activeVariationIndex];
      if (activeVariation.aspectRatioOptions.indexOf(action.value) < 0) return state;

      newTemplates[activeTemplateType].variations[activeVariationIndex].aspectRatio = action.value;
      return { ...state, templates: newTemplates };

  }

  return { ...state };
}
