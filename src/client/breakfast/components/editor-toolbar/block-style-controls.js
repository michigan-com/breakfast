'use strict';

import React, {  Component } from 'react';
import PropTypes from 'prop-types';

import Select from '../../../util/components/select';

export default class BlockStyleControls extends Component {
  constructor(props) {
    super(props);
    this.onBlockStyleSelect = this.onBlockStyleSelect.bind(this);
  }

  onBlockStyleSelect(blockStyle) {
    this.props.onToggle(blockStyle.style);
  }

  render() {
    const { blockTypes, currentActiveStyle } = this.props;
    let selectIndex = 0;
    for (let i = 0; i < blockTypes.length; i++) {
      const blockType = blockTypes[i];
      if (blockType.style === currentActiveStyle) {
        selectIndex = i;
        break;
      }
    }

    return (
      <div className="block-style-controls">
        <BlockStyleSelect
          options={blockTypes}
          onSelect={this.onBlockStyleSelect}
          currentIndex={selectIndex}
        />
      </div>
    );
  }
}

class BlockStyleSelect extends Select {
  getLabel(blockStyle) {
    switch (blockStyle.style.toLowerCase()) {
      case 'ordered-list-item':
        return <img src="/img/ordered-list.svg" alt="ordered-list" />;
      case 'unordered-list-item':
        return <img src="/img/unordered-list.svg" alt="unordered-list" />;
      case 'bold':
        return <span style={{ fontWeight: 'bold' }}>B</span>;
      case 'italic':
        return <span style={{ fontStyle: 'italic ' }}>I</span>;
      case 'underline':
        return <span style={{ textDecoration: 'underline' }}>U</span>;

      default:
        return blockStyle.label;
    }
  }

  getDisplayValue(option) {
    return this.getLabel(option);
  }
}


BlockStyleControls.propTypes = {
  blockTypes: PropTypes.array,
  onToggle: PropTypes.func,
  currentActiveStyle: PropTypes.string,
};

BlockStyleControls.defaultProps = {
  onToggle: () => {},
};
