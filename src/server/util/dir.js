import Path from 'path';

var dirs = {
  root: null
};

export default function dir(name, ...children) {
  var base = dirs[name];
  if (!base) {
    throw new Error(`Unknown dir "${base}"`);
  }
  if (children.length === 0) {
    return base;
  } else {
    return Path.join(base, ...children);
  }
}

function init(rootPath) {
  dirs['root'] = rootPath;
}

function define(name, parent, ...children) {
  var path = dir(parent, ...children);
  dirs[name] = path;
  return path;
}

dir.init = init;
dir.define = define;