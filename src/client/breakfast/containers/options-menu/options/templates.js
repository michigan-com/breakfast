'use strict';

// TODO component-ify
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getPresentState } from '../../../selectors/present';
import { bindActionCreators } from 'redux';

import { TWO_ONE, SQUARE, SNAPCHAT, aspectRatioChange } from '../../../actions/background';

class templatesPicker extends Component {


  constructor(props) {
    super(props);
    this.templateGenerator = this.templateGenerator.bind(this);
  }

  templateGenerator(ratio, index){

    let className = "";

    let img = null;

    

    switch (ratio.name) {
      case SQUARE:
        className = 'instagram-template'
        img = (<div>
                <img src="/img/instagram-grey.svg" alt="Instagram" />
                <img src="/img/instagram-selected.svg" alt="Instagram" className="active"/></div>)
        break;
      case TWO_ONE:
        className = 'face-tweet-template';
        img = [
                <img src="/img/twitter-grey.svg" alt="twitter" key="twitter-grey"/>,
                <img src="/img/facebook-grey.svg" alt="facebook" key="facebook-grey"/>,        
                <img src="/img/twitter-selected.svg" alt="twitter" className="active" key="twitter-selected"/>,
                <img src="/img/facebook-selected.svg" alt="facebook" className="active" key="facebook-selected"/>,
              ]
        break;
      case SNAPCHAT:
        className = 'snapchat-template';
        img = (<div>
                <img src="/img/snapchat-grey.svg" alt="snapchat" />
                <img src="/img/snapchat-selected.svg" alt="snapchat" className="active"/>
              </div>)
        break;
      default:
        return null;
        break;
    }

    if (index === this.props.Background.aspectRatioIndex) className += ' selected';

    return (
      <div className={`${className} template-btn`} key={`template-generator-${index}`} onClick={() => { this.props.actions.aspectRatioChange(index); }}>
        {img}   
      </div>
    );
  }

  render() {
    return (
      <div className="layout-picker-container">
        <div className="layout-picker">
          <div className="layout-picker-title">Layout</div>
          <div className="divider-line"></div>
          <div className="template-container">
            {this.props.Background.aspectRatioOptions.map(this.templateGenerator)}
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(templatesPicker);
