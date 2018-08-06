'use strict';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TEMPLATE_TYPE_SINGLE, TEMPLATE_TYPE_VERSUS, TEMPLATE_TYPE_LIST,
  updateSingleText, updateVersusText } from '../../../actions/templates';

class TextOptions extends Component {
  static propTypes = {
    Templates: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onSingleTextInput = this.onSingleTextInput.bind(this);
  }

  onSingleTextInput(e) {
    this.props.actions.updateSingleText(e.target.value);
  }

  onVersusTextInput(textIndex) {
    return (e) => {
      this.props.actions.updateVersusText(textIndex, e.target.value);
    }
  }

  renderTextContent(text, templateType) {
    switch (templateType) {
      case TEMPLATE_TYPE_SINGLE:
      default:
        return (
          <div className='option-container'>
            <div className='option-container-title'>Quote/Fact</div>
            <input
              type='text'
              value={text[0]}
              onChange={this.onSingleTextInput}
              />
          </div>
        )
      case TEMPLATE_TYPE_VERSUS:
        return (
          <div className='option-container'>
            <div className='option-container-title'>Quote/Fact (1)</div>
            <input
              type='text'
              value={text[0]}
              onChange={this.onVersusTextInput(0)}
              />
            <div className='option-container-title'>Quote/Fact (2)</div>
            <input
              type='text'
              value={text[1]}
              onChange={this.onVersusTextInput(1)}
              />
          </div>
        )
    }
  }

  render() {
    const { activeTemplateType, templates } = this.props.Templates;
    if (!(activeTemplateType in templates)) return null;
    const activeTemplate = templates[activeTemplateType];

    return (
      <div className='text-content'>
        {this.renderTextContent(activeTemplate.text, activeTemplateType)}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { Templates } = state;
  return { Templates }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      updateSingleText,
      updateVersusText,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);
