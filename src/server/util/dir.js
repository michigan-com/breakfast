'use strict';

import Path from 'path';

const dirs = {
  root: null,
};

export default function dir(name, ...children) {
  const base = dirs[name];
  if (!base) {
    throw new Error(`Unknown dir "${base}"`);
  }
  if (children.length === 0) {
    return base;
  }
  return Path.join(base, ...children);
}

function init(rootPath) {
  dirs.root = rootPath;
}

function define(name, parent, ...children) {
  const path = dir(parent, ...children);
  dirs[name] = path;
  return path;
}

dir.init = init;
dir.define = define;
