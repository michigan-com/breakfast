'use strict';

import React, { PropTypes } from 'react';

export default function FontSizeButton({ options, onFontSizeToggle, onFontSizeChange, active }) {
  return (
    <div className={'font-size'} onClick={onFontSizeToggle}>
      <img className="font-size-image" src="/img/text-size.svg" alt="Text Size" />
      <div className="font-size-option-container">
        {active ? options.map((option, i) => (
          <div
            className={`font-size-option ${option.toLowerCase()}`}
            onClick={((o) => ((e) => {
              e.preventDefault();
              e.stopPropagation();
              onFontSizeChange(o);
            }))(option)}
            key={`font-size-option-${i}`}
          >
            {'^'}
          </div>
        )) : null}
      </div>
    </div>
  );
}

FontSizeButton.propTypes = {
  onFontSizeChange: PropTypes.func,
  onFontSizeToggle: PropTypes.func,
  options: PropTypes.array,
  active: PropTypes.bool,
};
