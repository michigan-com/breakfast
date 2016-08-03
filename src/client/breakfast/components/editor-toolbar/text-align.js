'use strict';

import React, { PropTypes } from 'react';

import Select from '../../../util/components/select';

export default function TextAlign(props) {
  const { textAlignOptions, onChange, currentJustifyIndex } = props;

  return (
    <div className="justify-options">
      <JustifySelect
        options={textAlignOptions}
        currentIndex={currentJustifyIndex}
        onSelect={onChange}
      />
    </div>
  );
}

TextAlign.propTypes = {
  textAlignOptions: PropTypes.array,
  currentJustifyIndex: PropTypes.number,
  onChange: PropTypes.func,
};

class JustifySelect extends Select {
  getDisplayValue(option) {
    switch (option) {
      case 'left':
      default:
        return <img src="/img/left.svg" alt="Left Justify" />;
      case 'center':
        return <img src="/img/center.svg" alt="Center Justify" />;
      case 'right':
        return <img src="/img/right.svg" alt="Right Justify" />;
    }
  }
}
