'use strict';

import { getIpsumText } from './test-text';

export const UPDATE_SINGLE_TEXT = 'UPDATE_SINGLE_TEXT';
export const UPDATE_VERSUS_TEXT = 'UPDATE_VERSUS_TEXT';
export const UPDATE_RESULTS_TEXT = 'UPDATE_RESULTS_TEXT';
export const UPDATE_LIST_TEXT = 'UPDATE_LIST_TEXT';
export const ADD_LIST_ITEM = 'ADD_LIST_ITEM';
export const REMOVE_LIST_ITEM = 'REMOVE_LIST_ITEM';
export const SELECT_TEMPLATE_VARIATION = 'SELECT_TEMPLATE_VARIATION';
export const UPDATE_ASPECT_RATIO = 'UPDATE_ASPECT_RATIO';

export const TEMPLATE_TYPE_QUOTE = 'quote';
export const TEMPLATE_TYPE_FACT = 'fact';
export const TEMPLATE_TYPE_RESULTS = 'results';
export const TEMPLATE_TYPE_VERSUS = 'versus';
export const TEMPLATE_TYPE_LIST = 'list';

export const ASPECT_RATIO_SQUARE = 1080 / 1080; // 1
export const ASPECT_RATIO_PORTRAIT = 1350 / 1080; // 1.25
export const ASPECT_RATIO_VERTICAL = 1920 / 1080; // 1.77778

const ALL_ASPECT_RATIOS = [
  ASPECT_RATIO_SQUARE,
  ASPECT_RATIO_PORTRAIT,
  ASPECT_RATIO_VERTICAL,
]

const TEMPLATE_TYPES = [
  TEMPLATE_TYPE_QUOTE,
  TEMPLATE_TYPE_VERSUS,
  TEMPLATE_TYPE_LIST,
  TEMPLATE_TYPE_RESULTS,
];

const TEMPLATE = {
  thumbnail: '',
  templateName: '',
  type: '',
  aspectRatio: ASPECT_RATIO_SQUARE,
  aspectRatioOptions: [ASPECT_RATIO_SQUARE],
}

function createTemplate(type = '', templateName, aspectRatioOptions=ALL_ASPECT_RATIOS) {
  if (TEMPLATE_TYPES.indexOf(type) < 0 ) return TEMPLATE;

  var createdTemplate = { ...TEMPLATE, templateName, type, aspectRatioOptions };

  return createdTemplate;
}

const SINGLE_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_QUOTE,
    'quote01',
  ),
  createTemplate(
    TEMPLATE_TYPE_QUOTE,
    'quote02',
  ),
  createTemplate(
    TEMPLATE_TYPE_QUOTE,
    'quote03',
    [ASPECT_RATIO_SQUARE],
  ),
  createTemplate(
    TEMPLATE_TYPE_QUOTE,
    'quote04',
    [ASPECT_RATIO_SQUARE],
  ),
  createTemplate(
    TEMPLATE_TYPE_QUOTE,
    'fact01',
    [ASPECT_RATIO_SQUARE],
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
  createTemplate(
    TEMPLATE_TYPE_VERSUS,
    'versus03',
    [ASPECT_RATIO_SQUARE]
  ),
];

const LIST_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_LIST,
    'list01'
  ),
  createTemplate(
    TEMPLATE_TYPE_LIST,
    'list02'
  )
];

const RESULTS_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_RESULTS,
    'results01'
  ),
  createTemplate(
    TEMPLATE_TYPE_RESULTS,
    'results03'
  )
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

export function updateResultsText(textIndex = -1, text = '') {
  return {
    type: UPDATE_RESULTS_TEXT,
    value: {
      textIndex,
      text,
    }
  }
}

export function updateListText(textIndex = -1, text = '') {
  return {
    type: UPDATE_LIST_TEXT,
    value: {
      textIndex,
      text,
    }
  }
}

export function addListItem() {
  return {
    type: ADD_LIST_ITEM
  }
}

export function removeListItem(textIndex = -1) {
  return {
    type: REMOVE_LIST_ITEM,
    value: textIndex,
  }
}

export function selectTemplateVariation(templateType=TEMPLATE_TYPE_QUOTE, activeVariationIndex = 0) {
  return {
    type: SELECT_TEMPLATE_VARIATION,
    value: {
      templateType,
      activeVariationIndex,
    }
  }
}

export function updateAspectRatio(aspectRatio) {
  // imply template type & variationIndex from state in reducer
  return {
    type: UPDATE_ASPECT_RATIO,
    value: aspectRatio
  }
}

export function swapWinner() {
  return { type: SWAP_WINNER };
}

export const DEFAULT_STATE = {
  templates: {
    [TEMPLATE_TYPE_QUOTE]: {
      variations: [...SINGLE_TEMPLATES],
      text: [getIpsumText(3)],
      activeVariationIndex: 0,
    },
    [TEMPLATE_TYPE_RESULTS]: {
      variations: [...RESULTS_TEMPLATES],
      text: ['0', '0'],
      activeVariationIndex: 0,
      winningCandidateIndex: 0,
    },
    [TEMPLATE_TYPE_VERSUS]: {
      variations: [...VERSUS_TEMPLATES],
      text: [getIpsumText(3), getIpsumText(3)],
      activeVariationIndex: 0,
    },
    [TEMPLATE_TYPE_LIST]: {
      variations: [...LIST_TEMPLATES],
      text: [getIpsumText(2), getIpsumText(2), getIpsumText(2)],
      activeVariationIndex: 0,
    }
  },
  activeTemplateType: TEMPLATE_TYPE_QUOTE,
}
