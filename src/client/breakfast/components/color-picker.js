'use strict';

import React from 'react';
import PropTypes from 'prop-types';
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
