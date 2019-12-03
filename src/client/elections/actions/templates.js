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
export const UPDATE_TOGGLE_VALUE = 'UPDATE_TOGGLE_VALUE';
export const UPDATE_NUMBER_VALUE = 'UPDATE_NUMBER_VALUE';
export const UPDATE_STATE_VALUE = 'UPDATE_STATE_VALUE';

export const TEMPLATE_TYPE_QUOTE = 'quote';
export const TEMPLATE_TYPE_FACT = 'fact';
export const TEMPLATE_TYPE_RESULTS = 'results';
export const TEMPLATE_TYPE_VERSUS = 'versus';
export const TEMPLATE_TYPE_LIST = 'list';
export const TEMPLATE_TYPE_DATA = 'data';
export const TEMPLATE_TYPE_FACT_CHECK = 'fact-check';

export const ASPECT_RATIO_SQUARE = 1080 / 1080; // 1
export const ASPECT_RATIO_PORTRAIT = 1350 / 1080; // 1.25
export const ASPECT_RATIO_VERTICAL = 1920 / 1080; // 1.77778
export const ASPECT_RATIO_FIVE_FOUR = 5 / 4; // 0.8

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
  TEMPLATE_TYPE_DATA,
  TEMPLATE_TYPE_FACT_CHECK,
  TEMPLATE_TYPE_FACT,
];

const TEMPLATE = {
  thumbnail: '',
  templateName: '',
  type: '',
  aspectRatio: ASPECT_RATIO_FIVE_FOUR,
  aspectRatioOptions: [ASPECT_RATIO_FIVE_FOUR],
  fontSize: undefined,
  logoType: 'dark',
}

function createTemplate(type = '', templateName, overrideValues = {}) {
  if (TEMPLATE_TYPES.indexOf(type) < 0 ) return TEMPLATE;

  var createdTemplate = { ...TEMPLATE, templateName, type, ...overrideValues };

  return createdTemplate;
}

const SINGLE_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_QUOTE,
    'quote01',
    { 
      fontSize: 47
    },
  ),
  createTemplate(
    TEMPLATE_TYPE_QUOTE,
    'quote02',
    { 
      logoType: 'light',
      fontSize: 40
    }
  )
 ];

const VERSUS_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_VERSUS,
    'versus01',
    {
      logoType: 'dark-no-background'
    }
  ),
];

const LIST_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_LIST,
    'list01',
    {
      fontSize: 40
    }
  )
];

const RESULTS_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_RESULTS,
    'results01',
    {
      logoType: 'light'
    }
  ),
  createTemplate(
    TEMPLATE_TYPE_RESULTS,
    'results02',
    {
      logoType: 'light',
      fontSize: 53
    }
  )
]

const DATA_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_DATA,
    'data01',
    {
      logoType: 'light',
      fontSize: 45
    }
  ),
  createTemplate(
    TEMPLATE_TYPE_DATA,
    'data02',
    {
      fontSize: 50,
      logoType: 'dark-no-background'
    }
  )
]

const FACT_CHECK_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_FACT_CHECK,
    'factcheck01',
    {
      fontSize: 47,
    }
  )
]

const FACT_TEMPLATES = [
  createTemplate(
    TEMPLATE_TYPE_FACT,
    'fact01',
    {
      fontSize: 60,
      logoType: 'light'
    }
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

export function updateNumberValue(numberIndex = -1, numberValue = '') {
  return {
    type: UPDATE_NUMBER_VALUE,
    value: {
      numberIndex,
      numberValue
    }
  }
}

export function toggleValue() {
  return { 
    type: UPDATE_TOGGLE_VALUE
  }
}

export function updateStateValue(state, stateIndex) {
  return {
    type: UPDATE_STATE_VALUE,
    value: stateIndex,
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
      text: [getIpsumText(1)],
      numbers: ['0', '0'],
      toggle: true, // boolean values seem useful for results and true/false templates
      activeVariationIndex: 1,
      selectedStateDisplayValue: '',
      selectedStateIndex: 0,
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
    },
    [TEMPLATE_TYPE_DATA]: {
      variations: [...DATA_TEMPLATES],
      text: [getIpsumText(1)],
      numbers: ['0', '0'],
      activeVariationIndex: 0,
    },
    [TEMPLATE_TYPE_FACT_CHECK]: {
      variations: [...FACT_CHECK_TEMPLATES],
      text: [getIpsumText(3)],
      toggle: true,
      activeVariationIndex: 0,
    },
    [TEMPLATE_TYPE_FACT]: {
      variations: [...FACT_TEMPLATES],
      text: [getIpsumText(2)],
      activeVariationIndex: 0,
    }
  },
  activeTemplateType: TEMPLATE_TYPE_QUOTE,
}
