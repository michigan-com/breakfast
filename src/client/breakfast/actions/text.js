'use strict';

import { EditorState, RichUtils } from 'draft-js';

export const TEXT_WIDTH_CHANGE = 'TEXT_WIDTH_CHANGE';
export const TEXT_POS_CHANGE = 'TEXT_POS_CHANGE';
export const UPDATE_EDITOR_STATE = 'UPDATE_EDITOR_STATE';
export const UPDATE_EDITOR_FONTFACE = 'UPDATE_EDITOR_FONTFACE';
export const UPDATE_EDITOR_TEXT_ALIGN = 'UPDATE_EDITOR_TEXT_ALIGN';
export const UPDATE_EDITOR_FONT_COLOR = 'UPDATE_EDITOR_FONT_COLOR';
export const UPDATE_EDITOR_DISPLAY = 'UPDATE_EDITOR_DISPLAY';

export const HEADER_TEXT_CONTAINER = 'header';
export const BODY_TEXT_CONTAINER = 'body';
export const CAPTION_TEXT_CONTAINER = 'caption';

const DEFAULT_TEXT_CONTAINER_HEIGHT = 20;

const DEFAULT_TEXT_CONTAINER = {
  containerType: HEADER_TEXT_CONTAINER,
  textPos: {
    left: 0,
    top: 0,
  },
  // textWidth: 100,
  textWidth: 71,
  textHeight: DEFAULT_TEXT_CONTAINER_HEIGHT,
  display: false,
  fontFace: 'Helvetica',
  fontColor: '#000000',
  textAlign: 'left',
  editorState: EditorState.createEmpty(),
};

// https://github.com/facebook/draft-js/blob/master/examples/rich/rich.html#L169
export const BLOCK_TYPES = [
  { label: 'Text', style: 'text' }, // Custom block type that resets to "basic" style
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
];


// https://github.com/facebook/draft-js/blob/master/examples/rich/rich.html#L205
const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
];

const TEXT_ALIGN_OPTIONS = [
  'left',
  'center',
  'right',
];

function generateDefaultTextContainer(containerType = HEADER_TEXT_CONTAINER, display = false) {
  const textPos = { ...DEFAULT_TEXT_CONTAINER.textPos };
  switch (containerType) {
    case BODY_TEXT_CONTAINER:
      textPos.top = 0.4;
      return {
        ...DEFAULT_TEXT_CONTAINER,
        containerType,
        textPos,
        display,
        editorState: RichUtils.toggleBlockType(
          EditorState.createEmpty(),
          'header-three',
        ),
      };
    case CAPTION_TEXT_CONTAINER:
      textPos.top = 0.6;
      return { ...DEFAULT_TEXT_CONTAINER, containerType, textPos, display };
    case HEADER_TEXT_CONTAINER:
    default:
      return {
        ...DEFAULT_TEXT_CONTAINER,
        display,
        editorState: RichUtils.toggleBlockType(
          EditorState.createEmpty(),
          'header-one'
        ),
      };
  }
}


export function textWidthChange(textContainerIndex, textWidth) {
  return {
    type: TEXT_WIDTH_CHANGE,
    value: {
      textContainerIndex,
      textWidth,
    },
  };
}

export function textPosChange(textContainerIndex, textPos) {
  return {
    type: TEXT_POS_CHANGE,
    value: {
      textContainerIndex,
      textPos,
    },
  };
}

export function updateEditorState(textContainerIndex, editorState) {
  return {
    type: UPDATE_EDITOR_STATE,
    value: {
      textContainerIndex,
      editorState,
    },
  };
}

export function updateFontFace(textContainerIndex, fontFace) {
  return {
    type: UPDATE_EDITOR_FONTFACE,
    value: {
      textContainerIndex,
      fontFace,
    },
  };
}

export function updateTextAlign(textContainerIndex, textAlign) {
  return {
    type: UPDATE_EDITOR_TEXT_ALIGN,
    value: {
      textContainerIndex,
      textAlign,
    },
  };
}

export function updateFontColor(textContainerIndex, fontColor) {
  return {
    type: UPDATE_EDITOR_FONT_COLOR,
    value: {
      textContainerIndex,
      fontColor,
    },
  };
}

export function updateEditorDisplay(textContainerIndex, display) {
  return {
    type: UPDATE_EDITOR_DISPLAY,
    value: {
      textContainerIndex,
      display,
    },
  };
}

export const DEFAULT_TEXT = {
  textContainers: [
    generateDefaultTextContainer(HEADER_TEXT_CONTAINER, true),
    generateDefaultTextContainer(BODY_TEXT_CONTAINER, false),
    generateDefaultTextContainer(CAPTION_TEXT_CONTAINER, false),
  ],
  possibleBlockTypes: [...BLOCK_TYPES],
  possibleInlineTypes: [...INLINE_STYLES],
  possibleTextAlignOptions: [...TEXT_ALIGN_OPTIONS],
};
