'use strict';

import React, { PropTypes } from 'react';

export default function OptionChoice(props) {
  const { option, onClick, index, selected } = props;
  const displayName = option.replace(/\-/g, ' ');
  const className = ['option-choice-container'];
  if (selected) className.push('selected');

  return (
    <div className={className.join(' ')} onClick={() => { onClick(index); }}>
      <div className="option-image-container">
        <img src={`/img/${option}.svg`} alt={displayName} />
      </div>
      <div className="display-name">{displayName}</div>
    </div>
  );
}

OptionChoice.propTypes = {
  option: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

OptionChoice.defaultProps = {
  onClick: () => {},
};
