'use strict';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TEMPLATE_TYPE_QUOTE, TEMPLATE_TYPE_VERSUS, TEMPLATE_TYPE_LIST,
  updateSingleText, updateVersusText, updateListText, addListItem } from '../../../actions/templates';

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

  onListTextInput(textIndex) {
    return (e) => {
      this.props.actions.updateListText(textIndex, e.target.value)
    }
  }

  renderTextContent(text, templateType) {
    switch (templateType) {
      case TEMPLATE_TYPE_QUOTE:
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
      case TEMPLATE_TYPE_LIST:
        return (
          <div className='option-container'>
            <div className='option-container-title'>List</div>
            {
              text.map((t, i) => (
                <input
                  type='text'
                  value={t}
                  onChange={this.onListTextInput(i)}
                  key={`list-input-${i}`}
                  />
              ))
            }
            <div className='add-list-item' onClick={this.props.actions.addListItem}>+</div>
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
      updateListText,
      addListItem
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);
