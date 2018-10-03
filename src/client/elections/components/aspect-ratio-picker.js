'use strict';

import React, { PropTypes } from 'react';

const RATIO_OPTION_WIDTH = 30;

export default function AspectRatioPicker(props) {
  const { availableAspectRatios, currentAspectRatio, onAspectRatioPick } = props;
  return (
    <div className='template-aspect-ratio-picker'>
      {
        availableAspectRatios.map((ratio, i) => {
          var containerClassName = 'aspect-ratio-container';
          var onClick = onAspectRatioPick;
          var style = { width: `${RATIO_OPTION_WIDTH}px`, height: `${RATIO_OPTION_WIDTH * ratio}px` };
          if (ratio === currentAspectRatio) {
            containerClassName += ' active';
            onClick = () => {};
          }
          return (
            <div className={containerClassName} key={`aspect-ratio-${ratio}`}>
              <eiv className='aspect-ratio' onClick={onClick(ratio)} style={style}></eiv>
            </div>
          )
        })
      }
    </div>
  )
}

AspectRatioPicker.propTypes = {
  availableAspectRatios: PropTypes.array,
  currentAspectRatio: PropTypes.number,
  onAspectRatioPick: PropTypes.func
}