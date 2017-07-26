'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

export default class Select extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      optionsHidden: true,
      filter: '',
    };

    this.htmlClass = this.props.htmlClass ? this.props.htmlClass : '';

    this.optionSelected = this.optionSelected.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.renderOption = this.renderOption.bind(this);

    this.filter = null;
  }

  componentDidUpdate = (lastProps, lastState) => {
    if (this.state.optionsHidden) return;
    else if (lastState.optionsHidden && !this.state.optionsHidden && this.filter) this.filter.focus();

    const optionsObj = ReactDOM.findDOMNode(this.refs['select-options']);
    if (optionsObj.scrollHeight <= optionsObj.clientHeight) return;

    // Set scrollTop to make the selected index 2 from the top
    const step = optionsObj.scrollHeight / this.props.options.length;
    let scrollTop = step * this.props.currentIndex;
    if (this.props.currentIndex >= 2) scrollTop -= step * 2;
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
    return this.props.options[this.props.currentIndex];
  }

  toggleOptions() {
    this.setState({
      optionsHidden: !this.state.optionsHidden,
      filter: '',
    });
  }

  /**
   * Update the filter value based on text box input
   */
  updateFilter(e) {
    const filter = e.target.value;
    this.setState({ filter });
  }

  optionSelected(index) {
    return () => {
      if (index < 0 || index >= this.props.options.length) {
        return;
      }

      this.setState({
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
    if (this.state.filter) {
      let displayOption = false;
      Object.values(option).forEach((v) => {
        if (typeof v === 'string' && v.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1 && !displayOption) {
          displayOption = true;
        }
      });

      if (!displayOption) return null;
    }

    return (
      <div
        className={`select-option ${index === this.props.currentIndex ? 'selected' : ''}`}
        key={`option-${index}`}
        onClick={this.optionSelected(index)}
        style={this.getStyle(option)}
      >
        {this.getDisplayValue(option, index)}
      </div>
    );
  }

  renderSearchFilter() {
    if (this.state.optionsHidden || !this.props.displayFilter) return null;

    return (
      <div className="search-filter-container">
        <input
          type="text"
          value={this.state.filter}
          placeholder="Type to filter"
          onChange={this.updateFilter}
          ref={(r) => {
            if (!this.filter) r.focus();
            this.filter = r;
          }}
        />
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
      zIndex: 99,
    };

    return (
      <div>
        <div className="overlay" onClick={this.toggleOptions} style={overlayStyle}></div>
        <div className="select-options" ref="select-options">
          {this.props.options.map(this.renderOption)}
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.options.length) {
      return null;
    }

    const selected = this.props.options[this.props.currentIndex];
    return (
      <div className={`select ${this.htmlClass} ${this.state.optionsHidden ? '' : 'show'}`}>
        {this.renderSearchFilter()}
        <div
          className="current-selection"
          onClick={this.toggleOptions}
          style={this.getStyle(selected)}
        >
          {this.getDisplayValue(selected, this.props.currentIndex)}
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
  displayFilter: React.PropTypes.bool,
};

Select.defaultProps = {
  htmlClass: '',
  curretnIndex: 0,
  onSelect: () => { },
  displayFilter: false,
};
