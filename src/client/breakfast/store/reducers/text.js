'use strict';

import { TEXT_WIDTH_CHANGE, TEXT_POS_CHANGE, UPDATE_EDITOR_STATE, UPDATE_EDITOR_FONTFACE,
  UPDATE_EDITOR_TEXT_ALIGN, UPDATE_EDITOR_FONT_COLOR, DEFAULT_TEXT } from '../../actions/text';

/* eslint-disable no-case-declarations */
function handleTextContainerUpdate(state = DEFAULT_TEXT, action) {
  const newTextContainers = [...state.textContainers];

  const { textContainerIndex } = action.value;
  for (let i = 0; i < newTextContainers.length; i++) {
    if (i === textContainerIndex) {
      switch (action.type) {
        case UPDATE_EDITOR_STATE:
          const { editorState } = action.value;
          newTextContainers[i].editorState = editorState;
          break;
        case UPDATE_EDITOR_FONTFACE:
          const { fontFace } = action.value;
          newTextContainers[i].fontFace = fontFace;
          break;
        case TEXT_WIDTH_CHANGE:
          let { textWidth } = action.value;
          if (textWidth > 100) textWidth = 100;
          else if (textWidth < 0) textWidth = 0;
          newTextContainers[i].textWidth = textWidth;
          break;
        case TEXT_POS_CHANGE:
          const { textPos } = action.value;
          newTextContainers[i].textPos = textPos;
          break;
        case UPDATE_EDITOR_TEXT_ALIGN:
          const { textAlign } = action.value;
          newTextContainers[i].textAlign = textAlign;
          break;
        case UPDATE_EDITOR_FONT_COLOR:
          const { fontColor } = action.value;
          newTextContainers[i].fontColor = fontColor;
          break;
        default:
          break;
      }
    }
  }

  return { ...state, textContainers: newTextContainers };
}

export default function textReducer(state = DEFAULT_TEXT, action) {
  switch (action.type) {
    case UPDATE_EDITOR_STATE:
    case UPDATE_EDITOR_FONTFACE:
    case TEXT_WIDTH_CHANGE:
    case TEXT_POS_CHANGE:
    case UPDATE_EDITOR_TEXT_ALIGN:
    case UPDATE_EDITOR_FONT_COLOR:
      return handleTextContainerUpdate(state, action);
    default:
      return { ...state };
  }
}
