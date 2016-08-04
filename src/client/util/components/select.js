'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export default class Select extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      optionsHidden: true,
      currentIndex: this.props.currentIndex ? this.props.currentIndex : 0,
    };

    this.htmlClass = this.props.htmlClass ? this.props.htmlClass : '';

    this.optionSelected = this.optionSelected.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
  }

  componentDidUpdate = () => {
    if (this.state.optionsHidden) return;

    const optionsObj = ReactDOM.findDOMNode(this.refs['select-options']);
    if (optionsObj.scrollHeight <= optionsObj.clientHeight) return;

    // Set scrollTop to make the selected index 2 from the top
    const step = optionsObj.scrollHeight / this.props.options.length;
    let scrollTop = step * this.state.currentIndex;
    if (this.state.currentIndex >= 2) scrollTop -= step * 2;
    else scrollTop = 0;

    optionsObj.scrollTop = scrollTop;
  }

  /**
   * Returns the currently selected value
   *
   */
  /**
   * Get the display value for a given option, override if you want a different
   * value
   *
   * @param {Object} option - Option to be displayed
   * @param {Number} index - Index of the option being rendered
   */
  getDisplayValue(option) {
    let valueKey = this.props.valueKey;
    if (!valueKey) valueKey = 'value';
    if (!(valueKey in option)) console.log(`Key ${valueKey} not found`);

    return option[valueKey];
  }

  /**
   * Override function to make custom style for each option
   */
  getStyle(/* option*/) {
    return {};
  }

  currentSelection() {
    return this.props.options[this.state.currentIndex];
  }

  toggleOptions() {
    this.setState({
      optionsHidden: !this.state.optionsHidden,
    });
  }

  optionSelected(index) {
    return () => {
      if (index < 0 || index >= this.props.options.length) {
        return;
      }

      this.setState({
        currentIndex: index,
        optionsHidden: true,
      });

      if (this.props.onSelect) {
        this.props.onSelect(this.props.options[index], index);
      }
    };
  }


  /**
   * Default rendering of an individual option. Override if you want a custom
   * rendering
   *
   * @param {Object} option - Object representing the choice
   * @param {Number} index - Index into the array of options that this specific
   *  option is
   * @return {Object} React object
   */
  renderOption(option, index) {
    return (
      <div
        className={`select-option ${index === this.state.currentIndex ? 'selected' : ''}`}
        key={`option-${index}`}
        onClick={this.optionSelected(index)}
        style={this.getStyle(option)}
      >
        {this.getDisplayValue(option, index)}
      </div>
    );
  }

  renderOptions() {
    if (this.state.optionsHidden) return null;
    const overlayStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };

    return (
      <div>
        <div className="overlay" onClick={this.toggleOptions} style={overlayStyle}></div>
        <div className="select-options" ref="select-options">
          {this.props.options.map(this.renderOption.bind(this))}
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.options.length) {
      return null;
    }

    const selected = this.props.options[this.state.currentIndex];
    return (
      <div className={`select ${this.htmlClass} ${this.state.optionsHidden ? '' : 'show'}`}>
        <div
          className="current-selection"
          onClick={this.toggleOptions}
          style={this.getStyle(selected)}
        >
          {this.getDisplayValue(selected, this.state.currentIndex)}
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}

Select.propTypes = {
  currentIndex: React.PropTypes.number,
  htmlClass: React.PropTypes.string,
  options: React.PropTypes.array.isRequired,
  onSelect: React.PropTypes.func,
  valueKey: React.PropTypes.string,
};

Select.defaultProps = {
  htmlClass: '',
  onSelect: () => { },
};
