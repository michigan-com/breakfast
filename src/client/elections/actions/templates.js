'use strict';

export const UPDATE_SINGLE_TEXT = 'UPDATE_SINGLE_TEXT';

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
  markup: '',
  type: '',
  aspectRatio: ASPECT_RATIO_SQUARE,
  activeCandidateIndices: [],
}

function createTemplate(type = '', markup = '') {
  if (TEMPLATE_TYPES.indexOf(type) < 0 ) return TEMPLATE;

  var createdTemplate = { ...TEMPLATE, markup, type };

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
    `<style>
      .text-block {
        font-family: Unify Sans;
        stroke: black;
      }
    </style>`,
  )
];

const VERSUS_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_VERSUS,
    `<style>svg { fill: blue; }</style>`
  )
];

const LIST_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_LIST,
    `<style>svg { fill: red; }</style>`
  )
]


// Action functions
export function updateSingleText(text = '') {
  return {
    type: UPDATE_SINGLE_TEXT,
    value: text,
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
