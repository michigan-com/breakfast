'use strict';


export const TEXT_WIDTH_CHANGE = 'TEXT_WIDTH_CHANGE';
export const TEXT_POS_CHANGE = 'TEXT_POS_CHANGE';

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
  textWidth: 100,
  textHeight: DEFAULT_TEXT_CONTAINER_HEIGHT,
  display: false,
};


function generateDefaultTextContainer(containerType = HEADER_TEXT_CONTAINER, display = false) {
  const textPos = { ...DEFAULT_TEXT_CONTAINER.textPos };
  switch (containerType) {
    case BODY_TEXT_CONTAINER:
      textPos.top = DEFAULT_TEXT_CONTAINER_HEIGHT;
      return { ...DEFAULT_TEXT_CONTAINER, containerType, textPos, display };
    case CAPTION_TEXT_CONTAINER:
      textPos.top = DEFAULT_TEXT_CONTAINER_HEIGHT * 2;
      return { ...DEFAULT_TEXT_CONTAINER, containerType, textPos, display };
    case HEADER_TEXT_CONTAINER:
    default:
      return { ...DEFAULT_TEXT_CONTAINER, display };
  }
}


export function textWidthChange(width) {
  return {
    type: TEXT_WIDTH_CHANGE,
    value: width,
  };
}

export function textPosChange(pos) {
  return {
    type: TEXT_POS_CHANGE,
    value: { ...pos },
  };
}

export const DEFAULT_TEXT = {
  textContainers: [
    generateDefaultTextContainer(HEADER_TEXT_CONTAINER, true),
    generateDefaultTextContainer(BODY_TEXT_CONTAINER, false),
    generateDefaultTextContainer(CAPTION_TEXT_CONTAINER, false),
  ],
};
