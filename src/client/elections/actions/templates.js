'use strict';

export const UPDATE_SINGLE_TEXT = 'UPDATE_SINGLE_TEXT';
export const UPDATE_VERSUS_TEXT = 'UPDATE_VERSUS_TEXT';
export const SELECT_TEMPLATE_VARIATION = 'SELECT_TEMPLATE_VARIATION';

export const TEMPLATE_TYPE_SINGLE = 'single';
export const TEMPLATE_TYPE_VERSUS = 'versus';
export const TEMPLATE_TYPE_LIST = 'list';

const TEMPLATE_TYPES = [
  TEMPLATE_TYPE_SINGLE,
  TEMPLATE_TYPE_VERSUS,
  TEMPLATE_TYPE_LIST,
];

const ASPECT_RATIO_SQUARE = 1;


const TEMPLATE = {
  thumbnail: '',
  templateName: '',
  type: '',
  aspectRatio: ASPECT_RATIO_SQUARE,
  activeCandidateIndices: [],
}

function createTemplate(type = '', templateName) {
  if (TEMPLATE_TYPES.indexOf(type) < 0 ) return TEMPLATE;

  var createdTemplate = { ...TEMPLATE, templateName, type };

  switch (type) {
    case TEMPLATE_TYPE_LIST:
    case TEMPLATE_TYPE_SINGLE:
    default:
      createdTemplate.activeCandidateIndices.push(-1);
      break;
    case TEMPLATE_TYPE_VERSUS:
      createdTemplate.activeCandidateIndices.push(-1);
      createdTemplate.activeCandidateIndices.push(-1);
      break;
  }

  return createdTemplate;
}

const SINGLE_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_SINGLE,
    'single01',
  ),
  createTemplate(
    TEMPLATE_TYPE_SINGLE,
    'single02',
  ),
  createTemplate(
    TEMPLATE_TYPE_SINGLE,
    'single03',
  ),
];

const VERSUS_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_VERSUS,
    'versus01',
  ),
  createTemplate(
    TEMPLATE_TYPE_VERSUS,
    'versus02',
  ),
];

const LIST_TEMPLATES = [
  // createTemplate(
  //   TEMPLATE_TYPE_LIST,
  //   'list01'
  // )
]


// Action functions
export function updateSingleText(text = '') {
  return {
    type: UPDATE_SINGLE_TEXT,
    value: text,
  }
}

export function updateVersusText(textIndex = -1, text = '') {
  return {
    type: UPDATE_VERSUS_TEXT,
    value: {
      textIndex,
      text,
    }
  }
}

export function selectTemplateVariation(templateType=TEMPLATE_TYPE_SINGLE, activeVariationIndex = 0) {
  return {
    type: SELECT_TEMPLATE_VARIATION,
    value: {
      templateType,
      activeVariationIndex,
    }
  }
}

export const DEFAULT_STATE = {
  templates: {
    [TEMPLATE_TYPE_SINGLE]: {
      variations: [...SINGLE_TEMPLATES],
      text: ['Single template'],
      activeVariationIndex: 0,
    },
    [TEMPLATE_TYPE_VERSUS]: {
      variations: [...VERSUS_TEMPLATES],
      text: ['double!', 'template!'],
      activeVariationIndex: 0,
    },
    [TEMPLATE_TYPE_LIST]: {
      variations: [...LIST_TEMPLATES],
      text: ['list', 'listicle', 'list'],
      activeVariationIndex: 0,
    }
  },
  activeTemplateType: TEMPLATE_TYPE_SINGLE,
}
