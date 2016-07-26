'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import OptionChoice from '../components/options-menu/option-choice';
import { optionSelect } from '../actions/options-menu';

class OptionsMenuComponent extends Component {
  static propTypes = {
    OptionsMenu: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { OptionsMenu } = this.props;
    return (
      <div className="options-menu-container">
        {OptionsMenu.options.map((option, index) => (
          <OptionChoice
            option={option}
            index={index}
            selected={OptionsMenu.selectedIndex === index}
            onClick={this.props.actions.optionSelect}
            key={`option-choice-${index}`}
          />
        ))}
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { OptionsMenu } = state;
  return { OptionsMenu };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      optionSelect,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsMenuComponent);
