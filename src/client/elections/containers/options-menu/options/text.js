'use strict';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TEMPLATE_TYPE_QUOTE, TEMPLATE_TYPE_VERSUS, TEMPLATE_TYPE_LIST,
  updateSingleText, updateVersusText, updateListText, addListItem, removeListItem } from '../../../actions/templates';

class TextOptions extends Component {
  static propTypes = {
    Templates: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onSingleTextInput = this.onSingleTextInput.bind(this);
  }

  stripSpaces(text) { return text.replace(/\n/g, '') }

  onSingleTextInput(e) {
    var text = this.stripSpaces(e.target.value);
    this.props.actions.updateSingleText(text);
  }

  onVersusTextInput(textIndex) {
    return (e) => {
      var text = this.stripSpaces(e.target.value);
      this.props.actions.updateVersusText(textIndex, text);
    }
  }

  onListTextInput(textIndex) {
    return (e) => {
      var text = this.stripSpaces(e.target.value);
      this.props.actions.updateListText(textIndex, text);
    }
  }

  removeListItem(textIndex) {
    return (e) => {
      this.props.actions.removeListItem(textIndex);
    }
  }

  renderTextContent(text, templateType) {
    switch (templateType) {
      case TEMPLATE_TYPE_QUOTE:
      default:
        return (
          <div className='option-container'>
            <div className='option-container-title'>Quote/Fact</div>
            <textarea
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
            <textarea
              type='text'
              value={text[0]}
              onChange={this.onVersusTextInput(0)}
              />
            <div className='option-container-title'>Quote/Fact (2)</div>
            <textarea
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
                <div className='list-item'>
                  <textarea
                    type='text'
                    value={t}
                    onChange={this.onListTextInput(i)}
                    key={`list-input-${i}`}
                    style={{width: '90%'}}
                    />
                  { i <=2 ? null : <div className="remove-list-item" onClick={this.removeListItem(i)}><i className="fa fa-times"></i></div> }
                </div>
              ))
            }
            { text.length < 7 ? <div className='add-list-item' onClick={this.props.actions.addListItem}>Add Item</div> : null }
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
      addListItem,
      removeListItem
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);
