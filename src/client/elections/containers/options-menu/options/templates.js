'use strict';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TEMPLATE_TYPE_SINGLE, TEMPLATE_TYPE_VERSUS, TEMPLATE_TYPE_LIST,
  selectTemplateVariation } from '../../../actions/templates';

class Templates extends Component {
  static propTypes: {
    Templates: PropTypes.object,
  }

  _selectTemplate(templateType, variationIndex) {
    return (e) => {
      this.props.actions.selectTemplateVariation(templateType, variationIndex);
    }
  }

  render() {
    const { templates, activeTemplateType } = this.props.Templates;
    return (
      <div className='template-picker'>
        {
          Object.keys(templates).map((templateType, i) => {
            return (
              <div className={`option-container ${templateType}`} key={`template-type-${templateType}`}>
                <div className='option-container-title'>{`${templateType} Templates`}</div>
                <div className='variation-options'>
                {
                  templates[templateType].variations.map((variation, index) => {
                    var className = 'variation-option';
                    if (templateType === activeTemplateType && index === templates[templateType].activeVariationIndex) {
                      className += ' active';
                    }
                    return (
                      <div className={className} key={`variation-${index}`} onClick={this._selectTemplate(templateType, index)}>
                        {variation.templateName}
                      </div>
                    )
                  })
                }
              </div>
            </div>
            )
          })
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { Templates } = state;
  return { Templates };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      selectTemplateVariation,
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Templates);
