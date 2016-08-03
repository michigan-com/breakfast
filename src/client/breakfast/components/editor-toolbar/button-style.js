'use strict';

import React, { PropTypes, Component } from 'react';

export default class StyleButton extends Component {
  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onToggle(this.props.style);
  }

  getLabel() {
    const { style } = this.props;
    switch (style.toLowerCase()) {
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
        return this.props.label;
    }
  }

  render() {
    const className = ['block', 'style-control'];
    if (this.props.active) className.push('active');

    return (
      <div
        className={className.join(' ')}
        onMouseDown={this.onToggle}
      >
        {this.getLabel()}
      </div>
    );
  }
}

StyleButton.propTypes = {
  onToggle: PropTypes.func,
  active: PropTypes.bool,
  label: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
};

StyleButton.defaultProps = {
  onToggle: () => {},
};
