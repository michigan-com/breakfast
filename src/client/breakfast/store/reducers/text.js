'use strict';

import undoable from 'redux-undo';

import { TEXT_WIDTH_CHANGE, TEXT_POS_CHANGE, UPDATE_EDITOR_STATE, UPDATE_EDITOR_FONTFACE,
  UPDATE_EDITOR_TEXT_ALIGN, UPDATE_EDITOR_FONT_COLOR, UPDATE_EDITOR_DISPLAY,
  DEFAULT_TEXT } from '../../actions/text';

/* eslint-disable no-case-declarations */
function handleTextContainerUpdate(state = DEFAULT_TEXT, action) {
  const textContainers = [];

  const { textContainerIndex } = action.value;
  for (let i = 0; i < state.textContainers.length; i++) {
    const container = state.textContainers[i];
    if (i === textContainerIndex) {
      switch (action.type) {
        case UPDATE_EDITOR_STATE:
          const { editorState } = action.value;
          container.editorState = editorState;
          break;
        case UPDATE_EDITOR_FONTFACE:
          const { fontFace } = action.value;
          container.fontFace = fontFace;
          break;
        case TEXT_WIDTH_CHANGE:
          let { textWidth } = action.value;
          if (textWidth > 100) textWidth = 100;
          else if (textWidth < 0) textWidth = 0;
          container.textWidth = textWidth;
          break;
        case TEXT_POS_CHANGE:
          const { textPos } = action.value;
          container.textPos = textPos;
          break;
        case UPDATE_EDITOR_TEXT_ALIGN:
          const { textAlign } = action.value;
          container.textAlign = textAlign;
          break;
        case UPDATE_EDITOR_FONT_COLOR:
          const { fontColor } = action.value;
          container.fontColor = fontColor;
          break;
        case UPDATE_EDITOR_DISPLAY:
          const { display } = action.value;
          container.display = display;
          break;
        default:
          break;
      }
    }

    textContainers.push({ ...container });
  }

  return { ...state, textContainers };
}

function textReducer(state = DEFAULT_TEXT, action) {
  switch (action.type) {
    case UPDATE_EDITOR_STATE:
    case UPDATE_EDITOR_FONTFACE:
    case TEXT_WIDTH_CHANGE:
    case TEXT_POS_CHANGE:
    case UPDATE_EDITOR_TEXT_ALIGN:
    case UPDATE_EDITOR_FONT_COLOR:
    case UPDATE_EDITOR_DISPLAY:
      return handleTextContainerUpdate(state, action);
    default:
      return { ...state };
  }
}

function getBlockType(editorState) {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return blockType;
}

function editorStateFilter(action, state, previousHistory) {
  const { type, value } = action;
  if (!previousHistory || type !== UPDATE_EDITOR_STATE) return true;

  const { textContainerIndex } = value;
  const container = state.textContainers[textContainerIndex];
  const pastContainer = previousHistory.textContainers[textContainerIndex];
  const currentContent = container.editorState.getCurrentContent().getPlainText();
  const pastContent = pastContainer.editorState.getCurrentContent().getPlainText();

  return currentContent !== pastContent ||
    getBlockType(container.editorState) !== getBlockType(pastContainer.editorState);
}

export default undoable(textReducer, { filter: editorStateFilter, debug: true });
