'use strict';

export const TEMPLATE_TYPE_SINGLE = 'single';
export const TEMPLATE_TYPE_DOUBLE = 'double';
export const TEMPLATE_TYPE_LIST = 'list';

const TEMPLATE_TYPES = [
  TEMPLATE_TYPE_SINGLE,
  TEMPLATE_TYPE_DOUBLE,
  TEMPLATE_TYPE_LIST,
];

const ASPECT_RATIO_SQUARE = 1;


const CANDIDATE = {
  name: '',
  party: '',
  location: '',
  text: ['test text'],
}

const TEMPLATE = {
  markup: '',
  type: '',
  aspectRatio: ASPECT_RATIO_SQUARE,
  candidates: [],
}

function createTemplate(type = '', markup = '') {
  if (TEMPLATE_TYPES.indexOf(type) < 0 ) return TEMPLATE;

  var createdTemplate = { ...TEMPLATE, markup, type };

  var candidates = [{ ...CANDIDATE }];
  if (type === TEMPLATE_TYPE_DOUBLE) candiates.push( { ...CANDIDATE });

  createdTemplate.candidates = candidates;

  return createdTemplate;
}

const STARTER_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_SINGLE,
    `<style>
      .text-block {
        font-family: Unify Sans;
        stroke: black;
      }
    </style>`,
  )
]

export const DEFAULT_STATE = {
  templates: [...STARTER_TEMPLATES],
  activeTemplateIndex: 0,
}
