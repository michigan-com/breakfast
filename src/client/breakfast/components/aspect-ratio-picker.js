'use strict';

import React from 'react';

import Store from '../store';
import { ASPECT_RATIOS, FIT_IMAGE, aspectRatio, getAspectRatioValue,
  } from '../actions/aspect-ratio';

export default class AspectRatioPicker extends React.Component {
  constructor(props) {
    super(props);
    this.aspectRatioChange = this.aspectRatioChange.bind(this);
    this.renderRatio = this.renderRatio.bind(this);
  }

  aspectRatioChange(ratio) {
    Store.dispatch(aspectRatio(ratio));
  }

  renderRatio(ratio, index) {
    const backgroundImg = this.props.options.Background.backgroundImg;
    if (ratio === FIT_IMAGE && backgroundImg.img == null) return null;

    const height = 55;
    let style = { height: `${height}px` };
    style.width = 50 * getAspectRatioValue(this.props.options.Background, ratio);

    let className = 'ratio-option';
    if (ratio === this.props.currentRatio) className += ' active';
    return (
      <div
        className={className}
        key={`aspect-ratio-option-${index}`}
        onClick={() => { this.aspectRatioChange(ratio); }}
      >
        <div className="ratio-example" style={style}></div>
        <div className="ratio-name">{ratio}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="ratio-picker">
        {ASPECT_RATIOS.map(this.renderRatio)}
      </div>
    );
  }
}

AspectRatioPicker.propTypes = {
  options: React.PropTypes.shape(Store.getState()).isRequired,
  currentRatio: React.PropTypes.string.isRequired,
};
