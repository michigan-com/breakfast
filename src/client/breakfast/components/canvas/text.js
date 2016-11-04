'use strict';

/* eslint-disable no-param-reassign */

class TextChunk {
  constructor({ x, y, globalFont }) {
    this.words = [];
    this.length = 0;
    this.x = x || 0;
    this.y = y || 0;
    this.textLength = 0;
    this.globalFont = globalFont;
  }

  appendWholeWordPlusSpace = (word, font) => {
    if (this.words.length > 0) this.words.push({ word: ' ', font: this.globalFont });
    this.words.push({ word, font });
  }


  measureChunk = (context) => {
    const currentContextFont = context.font;
    let chunkWidth = 0;
    for (const word of this.words) {
      context.font = word.font;
      chunkWidth += context.measureText(word.word).width;
    }
    context.font = currentContextFont;
    return Math.round(chunkWidth);
  }

  measureChunkWithWord = (context, word, font) => {
    const currentContextFont = context.font;
    let chunkWidth = this.measureChunk(context);


    const testWord = this.words.length > 0 ? ` ${word}` : word;
    context.font = font;
    chunkWidth += context.measureText(testWord).width;

    context.font = currentContextFont;
    return Math.round(chunkWidth);
  }

  renderChunk = (context) => {
    let x = this.x;
    for (const word of this.words) {
      context.font = word.font;
      const wordLength = context.measureText(word.word).width;

      context.fillText(word.word, x, this.y);
      x += wordLength;
    }
  }
}

class TextChunkStore {
  constructor({ textAlign, textWidth }) {
    this.chunks = [];
    this.textAlign = textAlign;
    this.textWidth = textWidth;
  }

  addFullLineChunk(context, chunk) {
    const chunkWidth = chunk.measureChunk(context);
    switch (this.textAlign) {
      case 'center':
        chunk.x = chunk.x + ((this.textWidth - chunkWidth) / 2);
        break;
      case 'right':
        chunk.x = chunk.x + (this.textWidth - chunkWidth);
        break;
      default:
        chunk.x = chunk.x;
    }

    this.chunks.push(chunk);
  }

  drawTextChunks(context) {
    for (const chunk of this.chunks) {
      chunk.renderChunk(context);
    }
  }
}

function measureWord(context, word) {
  const metrics = context.measureText(word);
  return metrics.width;
}

function getStyleMetrics(blockType, blockTypeStyle) {
  for (const style of blockTypeStyle) {
    if (style.blockType.style === blockType) return style;
  }

  return blockTypeStyle[0];
}

/**
 * Draw an entire element's textContext to the canvas, accounting for text wrapping
 * Assumes font, fillStyle, and other cnavas context settings are previously set
 *
 * @param {Object} context - canvas 2d context
 * @param {Object} $el - DOMtastic element to draw
 * @param {Number} x - x value to draw text at
 * @param {Number} startY - starting top
 * @param {Number} textWidth - maximum allowable width the text can span
 * @param {Number} fontSize - so we know where to put the next line of text
 * @param {String} textAlign - how to align the text, will affect what x is drawn to
 * @return {Number} the x coordinate of the next line
 */
export function fillAllText(context, text, x, startY, textWidth, fontSize, textAlign) {
  let y = startY;
  let line = '';
  let lineWidth = 0;
  const currentText = text.split(' ');

  function getDrawX(lineToDraw) {
    if (textAlign === 'left') return x;

    const lineLength = measureWord(context, lineToDraw);
    let lineDelta = textWidth - lineLength;
    if (textAlign === 'center') lineDelta /= 2;

    return (x + lineDelta) + 5; // +5, idk
  }

  for (const word of currentText) {
    const append = !line ? word : ` ${word}`;
    const newLineWidth = lineWidth + Math.round(measureWord(context, append));
    if (newLineWidth >= textWidth && line) {
      const drawX = getDrawX(line);
      context.fillText(line, drawX, y);
      y += fontSize;

      line = word;
      lineWidth = measureWord(context, word);
    } else {
      line += append;
      lineWidth = newLineWidth;
    }
  }

  // Fill the remainder, if any
  const drawX = getDrawX(line);
  context.fillText(line, drawX, y);
  y += fontSize;
  return y;
}

function fillTextBlock(context, block, textPosX, startY, textWidth, fontInfo, textAlign) {
  const { fontWeight, fontFace, fontSize, lineHeight } = fontInfo;
  const text = block.getText();
  const characterList = block.getCharacterList();
  const makeFont = (contextFontWeight, italic) => {
    let fontStyle = `${contextFontWeight}`;
    if (italic) fontStyle += ' italic';
    return `${fontStyle} ${fontSize}px ${fontFace}`;
  };

  const globalFont = makeFont(fontWeight, false);
  const chunkStore = new TextChunkStore({ textAlign, textWidth });
  let currentX = textPosX;
  let currentY = startY;
  let currentChunk = new TextChunk({ x: currentX, y: currentY, globalFont });
  let currentWord = '';
  let currentFont = globalFont;
  for (let i = 0; i < text.length; i++) {
    const currentChar = text[i];

    let inlineItalic = false;
    let inlineFontWeight = fontWeight;
    const style = characterList.get(i).getStyle();
    style.forEach((value) => {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'italic') inlineItalic = true;
      else inlineFontWeight = lowerValue;
    });

    const currentCharFont = makeFont(inlineFontWeight, inlineItalic);

    const lengthIfAppened = currentChunk.measureChunkWithWord(context, currentWord, currentFont);
    if (currentCharFont !== currentFont) {
      if (currentWord) {
        currentChunk.appendWholeWordPlusSpace(currentWord, currentFont);
        currentWord = '';
      }

    // If the length is 99% or more of the textWidth, create a new
    // this was done for cornercase purposes, where the HTML input would show one thing
    // but we would render something else. It came down to about 0.5%
    } else if ((lengthIfAppened / textWidth) > 0.993) {
      if (currentChunk.words.length === 0) {
        currentChunk.appendWholeWordPlusSpace(currentWord, currentFont);
        currentWord = '';
      }

      chunkStore.addFullLineChunk(context, currentChunk);
      currentY += lineHeight;
      currentX = textPosX;

      currentChunk = new TextChunk({ x: currentX, y: currentY, globalFont });
      if (currentChar === ' ') {
        currentChunk.appendWholeWordPlusSpace(currentWord, currentFont);
        currentWord = '';
      }
    } else if (currentChar === ' ') {
      // Append to the chunk cause we have a new word
      currentChunk.appendWholeWordPlusSpace(currentWord, currentFont);
      currentWord = '';
    }

    if (currentChar !== ' ') currentWord = `${currentWord}${currentChar}`;
    currentFont = currentCharFont;
  }

  // leftovers
  if (currentWord) {
    const lengthIfAppened = currentChunk.measureChunkWithWord(context, currentWord, currentFont);
    if (lengthIfAppened > textWidth) {
      chunkStore.addFullLineChunk(context, currentChunk);
      currentY += lineHeight;
      currentX = textPosX;

      currentChunk = new TextChunk({ x: currentX, y: currentY, globalFont });
    }
    currentChunk.appendWholeWordPlusSpace(currentWord, currentFont);
  }

  if (currentChunk.words.length > 0) chunkStore.addFullLineChunk(context, currentChunk);
  chunkStore.drawTextChunks(context);
  return currentY + lineHeight;
}

export default function updateText(context, canvasStyle, fontOptions,
    blockTypeStyle, textContainer) {
  const { editorState, textPos, fontFace, fontColor, textWidth, textAlign } = textContainer;
  const canvasPadding = canvasStyle.padding;
  const blocks = editorState.getCurrentContent().getBlocksAsArray();
  const canvasTextWidth = canvasStyle.maxTextWidth * (textWidth / 100) + canvasStyle.textEditorPadding;

  const textPosPx = {
    top: textPos.top * (canvasStyle.height / 2),
    left: textPos.left * (canvasStyle.width / 2),
  };

  // Scale up for real drawing
  let y = canvasPadding + (textPosPx.top * 2) - 1;
  const x = canvasPadding + (textPosPx.left * 2);
  const listPadding = 40 * 2;

  context.fillStyle = fontColor;
  context.textBaseline = 'top';

  let listCount = 0;
  for (const block of blocks) {
    const blockType = block.getType();
    const styleMetrics = getStyleMetrics(blockType, blockTypeStyle);

    const fontInfo = {
      fontWeight: styleMetrics.fontWeight === 'normal' ? '' : styleMetrics.fontWeight,
      fontSize: styleMetrics.fontSize,
      lineHeight: styleMetrics.lineHeight,
      fontFace,
    };

    if (/(unordered|ordered)-list-item/.test(blockType)) {
      context.font = `${fontInfo.fontWeight} ${fontInfo.fontSize}px ${fontInfo.fontFace}`;
      const bullet = /unordered/.test(blockType) ? '•' : `${++listCount}.`;
      const bulletLength = measureWord(context, bullet);
      const bulletX = x + (listPadding * 0.75) - bulletLength;
      const textX = x + listPadding;
      const bulletTextWidth = canvasTextWidth - listPadding;

      context.fillText(bullet, bulletX, y);
      y = fillTextBlock(context, block, textX, y, bulletTextWidth, fontInfo, textAlign);

      y += styleMetrics.marginBottom * 0.93; // idk!
    } else {
      y = fillTextBlock(context, block, x, y, canvasTextWidth, fontInfo, textAlign);

      if (/header-/.test(blockType)) {
        y += styleMetrics.marginBottom;
      }
    }
  }
}
