'use strict';

export function getLinesOfText(text, fontSize, lineHeight, lineWidth) {
  var words = text.split(' ');
  var lines = [];
  var currentLine = [];

  for (var word of words) {
    // TODO tighten this up. 0.64 is arbitrary
    var currentLineWidth = (currentLine.join(' ').length + ` ${word}`.length)  * (fontSize * 0.57);
    if (currentLineWidth > lineWidth) {
      lines.push(currentLine.join(' '));
      currentLine = [word];
    } else {
      currentLine.push(word);
    }
  }

  if (currentLine.length > 0) lines.push(currentLine.join(' '));

  return lines;
}
