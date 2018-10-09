'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import Select from '../../../util/components/select';

export default function FontPicker(props) {
  const { fontOptions, onFontChange, currentFontFace } = props;
  let currentFontIndex = 0;
  for (let i = 0; i < fontOptions.length; i++) {
    const fontOption = fontOptions[i];
    if (fontOption === currentFontFace) {
      currentFontIndex = i;
      break;
    }
  }
  return (
    <div className="font-picker-container">
      <FontSelect
        options={fontOptions}
        onSelect={onFontChange}
        currentIndex={currentFontIndex}
      />
    </div>
  );
}

FontPicker.propTypes = {
  fontOptions: PropTypes.array,
  currentFontFace: PropTypes.string,
  onFontChange: PropTypes.func,
};


class FontSelect extends Select {
  constructor(props) {
    super(props);
    this.htmlClass = 'font-select';
  }
  getDisplayValue(font) {
    const style = {
      fontFamily: font,
    };
    return (
      <div style={style}>{font}</div>
    );
  }
}
