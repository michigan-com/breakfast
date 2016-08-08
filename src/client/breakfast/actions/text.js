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

function getStyleMetrics(blockType) {
  function generateStyle(fontSize) {
    const lineHeight = fontSize * 1.05;
    const marginBottom = fontSize * 0.65;
    return { fontSize, lineHeight, marginBottom };
  }

  // Scale up
  const pFontSize = 16.5 * 2;
  const h1FontSize = 33.5 * 2;
  const h2FontSize = 26 * 2;
  const h3FontSize = 19.5 * 2;

  switch (blockType) {
    case 'header-one':
      return {
        ...generateStyle(h1FontSize),
        fontWeight: 'bold',
      };
    case 'header-two':
      return {
        ...generateStyle(h2FontSize),
        fontWeight: 'bold',
      };
    case 'header-three':
      return {
        ...generateStyle(h3FontSize),
        fontWeight: 'bold',
      };
    case 'unstyled':
    default:
      return {
        ...generateStyle(pFontSize),
        fontWeight: 'normal',
      };
  }
}


const DEFAULT_TEXT_CONTAINER_HEIGHT = 20;

const DEFAULT_TEXT_CONTAINER = {
  containerType: HEADER_TEXT_CONTAINER,
  textPos: {
    left: 0,
    top: 0,
  },
  textWidth: 100,
  textHeight: DEFAULT_TEXT_CONTAINER_HEIGHT,
  display: false,
  fontFace: 'Helvetica',
  fontColor: '#000000',
  textAlign: 'left',
  editorState: EditorState.createEmpty(),
};

// https://github.com/facebook/draft-js/blob/master/examples/rich/rich.html#L169
const BLOCK_TYPES = [
  { label: 'Text', style: 'text' }, // Custom block type that resets to "basic" style
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
];

const BLOCK_TYPE_STYLE = BLOCK_TYPES.map((blockType) => {
  const styleMetrics = getStyleMetrics(blockType.style);
  let tagName = 'span';
  switch (blockType.style) {
    case 'header-one':
      tagName = 'h1';
      break;
    case 'header-two':
      tagName = 'h2';
      break;
    case 'header-three':
      tagName = 'h3';
      break;
    case 'unordered-list-item':
      tagName = 'ul';
      break;
    case 'ordered-list-item':
      tagName = 'ol';
      break;
    default:
      break;
  }

  return { ...styleMetrics, tagName, blockType };
});


// https://github.com/facebook/draft-js/blob/master/examples/rich/rich.html#L205
const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
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
      textPos.top = DEFAULT_TEXT_CONTAINER_HEIGHT * 5;
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
      textPos.top = DEFAULT_TEXT_CONTAINER_HEIGHT * 7;
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
  blockTypeStyle: BLOCK_TYPE_STYLE,
};
