'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TEMPLATE_TYPE_QUOTE, TEMPLATE_TYPE_VERSUS, TEMPLATE_TYPE_LIST,
  TEMPLATE_TYPE_RESULTS, TEMPLATE_TYPE_DATA, TEMPLATE_TYPE_FACT_CHECK, 
  updateSingleText, updateNumberValue, updateVersusText, updateListText,
  updateResultsText, addListItem, removeListItem, toggleValue, updateStateValue,
  TEMPLATE_TYPE_FACT } from '../../../actions/templates';
import { stateFaceOptions } from '../../../actions/states';
import StatePicker from '../../../components/state-picker';

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

  onResultsTextInput(textIndex) {
    return (e) => {
      var text = this.stripSpaces(e.target.value);
      this.props.actions.updateResultsText(textIndex, text);
    }
  }

  onListTextInput(textIndex) {
    return (e) => {
      var text = this.stripSpaces(e.target.value);
      this.props.actions.updateListText(textIndex, text);
    }
  }

  onUpdateNumberValue(numberIndex) {
    return (e) => {
      var text = this.stripSpaces(e.target.value);
      this.props.actions.updateNumberValue(numberIndex, text);
    }
  }


  removeListItem(textIndex) {
    return (e) => {
      this.props.actions.removeListItem(textIndex);
    }
  }

  renderTextContent(activeTemplate, templateType) {
    const { text, numbers, toggle } = activeTemplate;
    const variation = activeTemplate.variations[activeTemplate.activeVariationIndex];

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
      case TEMPLATE_TYPE_FACT_CHECK:
        return (
          <div>
            <div className='option-container'>
              <div className='option-container-title'>Fact</div>
              <textarea
                type='text'
                value={text[0]}
                onChange={this.onSingleTextInput}></textarea>
            </div>
                
            <div className='option-container'>
              <div className='option-container-title'>True/False</div>
              <input type='checkbox' checked={toggle} name='true/false' onChange={this.props.actions.toggleValue}/>
            </div>
          </div>
        )
      case TEMPLATE_TYPE_VERSUS:
        return (
          <div>
            <div className='option-container'>
              <div className='option-container-title'>Quote/Fact (1)</div>
              <textarea
                type='text'
                value={text[0]}
                onChange={this.onVersusTextInput(0)}
                />
            </div>
            <div className='option-container'>
              <div className='option-container-title'>Quote/Fact (2)</div>
              <textarea
                type='text'
                value={text[1]}
                onChange={this.onVersusTextInput(1)}
                />
            </div>

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
                  { i <= 2 ? null : <div className="remove-list-item" onClick={this.removeListItem(i)}><i className="fa fa-times"></i></div> }
                </div>
              ))
            }
            { text.length < 7 ? <div className='add-list-item' onClick={this.props.actions.addListItem}>Add Item</div> : null }
          </div>
        )
      case TEMPLATE_TYPE_RESULTS:
        if (activeTemplate.activeVariationIndex === 0) {
          return (
            <div>
              <div className='option-container'>
                <div className='option-container-title'>Left Percent</div>
                <input type='number' value={numbers[0]} onChange={this.onUpdateNumberValue(0)}/>
              </div>
              <div className='option-container'>
                <div className='option-container-title'>Right Percent</div>
                <input type='number' value={numbers[1]} onChange={this.onUpdateNumberValue(1)}/>
              </div>
            </div>
          )
        } else {
          return (
            <div>
              <div className='option-container'>
                <div className='option-container-title'>Blurb</div>
                <textarea type='text' value={text[0]} onChange={this.onSingleTextInput}/>
              </div>
              <div className='option-container'>
                <div className='option-container-title'>State</div>
                <StatePicker options={stateFaceOptions} currentIndex={activeTemplate.selectedStateIndex} onSelect={this.props.actions.updateStateValue}/>
              </div>
            </div>
          )
        }
      case TEMPLATE_TYPE_DATA:
        return (
          <div className='option-container'>
            <div className='option-container-title'>Seat Count</div>
            <input type='number' value={numbers[0]} onChange={this.onUpdateNumberValue(0)}/>
            <div className='option-container-title'>Seat Count</div>
            <input type='number' value={numbers[1]} onChange={this.onUpdateNumberValue(1)}/>
            <div className='option-container-title'>Blurb Text</div>
            <textarea type='text' value={text[0]} onChange={this.onSingleTextInput}/>
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
        {this.renderTextContent(activeTemplate, activeTemplateType)}
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
      updateResultsText,
      updateNumberValue,
      addListItem,
      removeListItem,
      toggleValue,
      updateStateValue
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);
