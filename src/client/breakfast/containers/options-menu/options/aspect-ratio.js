'use strict';

// TODO component-ify
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TWO_ONE, SQUARE, FIT_IMAGE, aspectRatioChange, SNAPCHAT,
  } from '../../../actions/background';
import { getPresentState } from '../../../selectors/present';

class AspectRatioPicker extends Component {
  static propTypes = {
    Background: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  }

  static ratioPickerHeight = 35;

  constructor(props) {
    super(props);
    this.aspectRatioChange = this.aspectRatioChange.bind(this);
    this.renderRatio = this.renderRatio.bind(this);
  }

  aspectRatioChange(ratioIndex) {
    this.props.actions.aspectRatioChange(ratioIndex);
  }

  renderRatioInnards(ratio) {
    let innards = null;
    const style = { lineHeight: `${AspectRatioPicker.ratioPickerHeight}px` };
    const fbTwitterStyle = { width: '50%' };
    const instagramStyle = { width: '100%' };
    switch (ratio.name) {
      case TWO_ONE:
        innards = [
          <div className="image-container" key="aspect-ratio-twitter-img" style={fbTwitterStyle}>
            <img src="/img/twitter-icon.svg" alt="Twitter" />
          </div>,
          <div className="image-container" key="aspect-ratio-facebook-img" style={fbTwitterStyle}>
            <img src="/img/facebook-icon.svg" alt="Facebook" />
          </div>,
        ];
        break;
      case SQUARE:
        innards = (
          <div className="image-container" style={instagramStyle}>
            <img src="/img/instagram-icon.svg" alt="Instagram" />
          </div>
        );
        break;
      case SNAPCHAT:
        innards = (
          <div className="image-container" style={instagramStyle}>
            <img src="/img/snap-ghost.svg" alt="Instagram" />
          </div>
        );
        break;
      default:
        innards = <div style={style}>{ratio.name}</div>;
    }

    return (
      <div className="ratio-innards">
        {innards}
      </div>
    );
  }

  renderRatio(ratio, index) {
    const backgroundImg = this.props.Background.backgroundImg;
    if (ratio.name === FIT_IMAGE && backgroundImg.img == null) return null;

    const multiplier = ratio.name === SNAPCHAT ? 1.3 : 1;

    let style = { height: `${AspectRatioPicker.ratioPickerHeight * multiplier}px` };
    style.width = AspectRatioPicker.ratioPickerHeight * ratio.value * multiplier;

    let className = `ratio-option ${ratio.name}`;
    if (index === this.props.Background.aspectRatioIndex) className += ' active';
    return (
      <div
        className={className}
        key={`aspect-ratio-option-${index}`}
        onClick={() => { this.aspectRatioChange(index); }}
      >
        <div className="ratio-example" style={style}>
          {this.renderRatioInnards(ratio)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="ratio-picker">
        <div className="option-container">
          <div className="option-container-title">Choose A Social Post Size</div>
          {this.props.Background.aspectRatioOptions.map(this.renderRatio)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    Background: getPresentState(state).Background,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      aspectRatioChange,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AspectRatioPicker);
