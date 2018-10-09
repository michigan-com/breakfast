'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default function RadioToggle(props) {
  const buttonClass = ['radio-toggle-button-container'];
  if (props.active) buttonClass.push('active');

  return (
    <div className="radio-toggle-container">
      <div className="radio-label">{props.label || 'Toggle'}</div>
      <div
        className={buttonClass.join(' ')}
        onClick={() => { props.onToggle(!props.active); }}
      >
        <div className="radio-toggle-button">
          <div className="button-knob"></div>
        </div>
      </div>
    </div>
  );
}

RadioToggle.propTypes = {
  label: PropTypes.string,
  active: PropTypes.bool,
  onToggle: PropTypes.func,
};
