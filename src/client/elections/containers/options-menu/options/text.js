'use strict';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TEMPLATE_TYPE_SINGLE, TEMPLATE_TYPE_VERSUS, TEMPLATE_TYPE_LIST, updateSingleText } from '../../../actions/templates';

class TextOptions extends Component {
  static propTypes = {
    Templates: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.singleTextInput = null;

    this.onSingleTextInput = this.onSingleTextInput.bind(this);
  }

  onSingleTextInput(e) {
    console.log(e.target.value);
    this.props.actions.updateSingleText(e.target.value);
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
              ref={(t) => { if (t) {
                this.singleTextInput = t;
              }
              }}
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
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);
