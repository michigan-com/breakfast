'use strict';

import React, { PropTypes } from 'react';
import { CompactPicker } from 'react-color';

export default function ColorPicker(props) {
  return (
    <div className="color-picker">
    </div>
  );
}

ColorPicker.propTypes = {
  currentColor: PropTypes.string,
  backgroundColorChange: PropTypes,
};
