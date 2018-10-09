'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import StyleButton from './button-style';

export default function InlineStyleControls(props) {
  const { inlineTypes, onToggle, currentInlineStyle } = props;

  return (
    <div className="inline-style-controls">
      {inlineTypes.map((type, index) =>
        <StyleButton
          label={type.label}
          style={type.style}
          onToggle={onToggle}
          active={currentInlineStyle.has(type.style)}
          key={`inline-style-${index}`}
        />
      )}
    </div>
  );
}

InlineStyleControls.propTypes = {
  inlineTypes: PropTypes.array,
  onToggle: PropTypes.func,
  currentInlineStyle: PropTypes.object,
};
