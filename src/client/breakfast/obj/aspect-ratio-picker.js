'use strict';

import React from 'react';

import Dispatcher from '../dispatcher';
import OptionActions from '../actions/options';
import { FIT_IMAGE } from '../lib/constants';

let actions = new OptionActions();

export default class AspectRatioPicker extends React.Component {

  aspectRatioChange(ratio, e) {
    actions.aspectRatioChange(ratio);
  }

  renderRatio(ratio, index) {
    if (ratio === FIT_IMAGE) return null;

    let height = 55;
    let style = { height: `${height}px` };
    let values = this.props.aspectRatioValues;
    if (index < values.length) {
      style.width = 50 / values[index];
    }

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
        { this.props.aspectRatios.map(this.renderRatio.bind(this)) }
      </div>
    )
  }
}
