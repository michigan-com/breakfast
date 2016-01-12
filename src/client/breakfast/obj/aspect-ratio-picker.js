'use strict';

import React from 'react';

import Dispatcher from '../dispatcher';
import OptionActions from '../actions/options';
import OptionStore from '../store/options';
import { FIT_IMAGE, BACKGROUND_IMAGE} from '../lib/constants';

let actions = new OptionActions();

export default class AspectRatioPicker extends React.Component {

  aspectRatioChange(ratio, e) {
    actions.aspectRatioChange(ratio);
  }

  renderRatio(ratio, index) {
    if (ratio === FIT_IMAGE) {
      let store = OptionStore.getOptions();
      if (store.backgroundType !== BACKGROUND_IMAGE) return null;
    }

    let height = 55;
    let style = { height: `${height}px` };
    style.width = 50 / OptionStore.getAspectRatioValue(ratio);

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
