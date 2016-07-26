'use strict';

// TODO component-ify
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ASPECT_RATIOS, FIT_IMAGE, aspectRatio, getAspectRatioValue,
  } from '../actions/aspect-ratio';

class AspectRatioPicker extends Component {
  static propTypes = {
    Background: PropTypes.object.isRequired,
    currentRatio: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.aspectRatioChange = this.aspectRatioChange.bind(this);
    this.renderRatio = this.renderRatio.bind(this);
  }

  aspectRatioChange(ratio) {
    this.props.actions.aspectRatio(ratio);
  }

  renderRatio(ratio, index) {
    const backgroundImg = this.props.Background.backgroundImg;
    if (ratio === FIT_IMAGE && backgroundImg.img == null) return null;

    const height = 55;
    let style = { height: `${height}px` };
    style.width = 50 * getAspectRatioValue(this.props.Background, ratio);

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

function mapStateToProps(state) {
  return {
    Background: state.Background,
    currentRatio: state.Background.aspectRatio,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      aspectRatio,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AspectRatioPicker);
