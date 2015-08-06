

/**
 * Given a collection of words and a canvas to render them to,
 * break up the text into an array of lines to be able to wrap the text on the
 * canvas element
 *
 * @param {Object} context - Canvas context (canvas.getContext('2d'))
 * @param {String} text - Text that will be wrapped on the canvas
 * @param {Number} maxWidth - Maximum width of a line of text
 * @return {Array} Text broken up into individual lines
 */
function wrapText(context, text, maxWidth) {
  let words = text.split(' ');
  let line = '';
  let lines = [];
  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }

  lines.push(line);
  return lines;
}

// http://stackoverflow.com/a/728694/1337683
function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

module.exports = {
  wrapText,
  clone
}
