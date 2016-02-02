'use strict';

import React from 'react';

import Store from '../store';
import { BACKGROUND_IMAGE } from '../actions/background';
import { ASPECT_RATIOS, FIT_IMAGE, aspectRatio, getAspectRatioValue } from '../actions/aspect-ratio';

export default class AspectRatioPicker extends React.Component {

  aspectRatioChange(ratio, e) {
    Store.dispatch(aspectRatio(ratio));
  }

  renderRatio(ratio, index) {
    if (ratio === FIT_IMAGE && this.props.backgroundType !== BACKGROUND_IMAGE) return null;

    let height = 55;
    let style = { height: `${height}px` };
    style.width = 50 / getAspectRatioValue(ratio);

    let className = `ratio-option`;
    if (ratio === this.props.currentRatio) className += ' active';
    return (
      <div className={ className }
          key={ `aspect-ratio-option-${index}` }
          onClick={ this.aspectRatioChange.bind(this, ratio) }>
        <div className='ratio-example' style={ style }></div>
        <div className='ratio-name'>{ ratio }</div>
      </div>
    )
  }

  render() {
    return (
      <div className='ratio-picker'>
        { ASPECT_RATIOS.map(this.renderRatio.bind(this)) }
      </div>
    )
  }
}
