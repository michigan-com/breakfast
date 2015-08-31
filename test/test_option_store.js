var SRC_ROOT = '../public/js/src';

import Chance from 'chance';
import { OptionStore } from '../public/js/src/store';
import { OptionActions } from '../public/js/src/actions';
import { equal, notEqual } from 'assert';

let chance = new Chance();

let options = OptionStore.getOptions();
let actions = new OptionActions();

let fontOptions = OptionStore.getFontOptions();

describe('Option flux workflow tests', function() {

  beforeEach(function() {
    options = OptionStore.getOptions();
  });

  it('Tests the font options', function() {
    // Font size
    let newFontSize = options.fontSize * 2;
    actions.fontSizeChange(newFontSize);
    let newOptions = OptionStore.getOptions();
    equal(newFontSize, newOptions.fontSize, 'Font size didn\'t update');

    // Font color
    let newColor = chance.color({ format: 'hex' });
    actions.fontColorChange(newColor);
    newOptions = OptionStore.getOptions();
    equal(newColor, newOptions.fontColor, 'New color doesn\'t match');


    // Font face
    let newFontFace = fontOptions[1];
    actions.fontFaceChange(1);
    newOptions = OptionStore.getOptions();
    equal(newFontFace, newOptions.fontFace, 'New fontface doesn\'t match');
  });

  it('Tests background options', function() {

  });
})
