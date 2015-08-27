import React from 'react';

export default class Select extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      optionsHidden: true,
      currentIndex: this.props.currentIndex ? this.props.currentIndex : 0
    }

    this.htmlClass = '';
  }

  toggleOptions() {
    this.setState({
      optionsHidden: !this.state.optionsHidden
    });
  }

  optionSelected(index) {
    if (index < 0 || index >= this.props.options.length) {
      return;
    }

    this.setState({
      currentIndex: index,
      optionsHidden: true
    });

    if (this.props.onSelect) {
      this.props.onSelect(this.props.options[index], index);
    }
  }

  /**
   * Get the display value for a given option, override if you want a different
   * value
   *
   * @param {Object} option - Option to be displayed
   * @param {Number} index - Index of the option being rendered
   */
  getDisplayValue(option, index) {
    let valueKey = this.props.valueKey;
    if (!valueKey) valueKey = 'value';
    if (!valueKey in option) console.log(`Key ${valueKey} not found`);

    return option[valueKey];
  }

  /**
   * Override function to make custom style for each option
   */
  getStyle(option) {
    return {};
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
      <div className={ `select-option ${index === this.state.currentIndex ? 'selected' : ''}` }
          key={ `option-${index}` }
          onClick={ this.optionSelected.bind(this, index) }
          style={ this.getStyle(option) }>
        { this.getDisplayValue(option, index) }
      </div>
    )
  }

  renderOptions() {
    if (this.state.optionsHidden) return;

    return (
      <div className='select-options'>
        { this.props.options.map(this.renderOption.bind(this)) }
      </div>
    )
  }

  render() {
    if (!this.props.options.length) {
      return;
    }

    let selected = this.props.options[this.state.currentIndex];
    return (
      <div className={ `select ${this.htmlClass} ${ this.state.optionsHidden ? '' : 'show' }`}>
        <div className='current-selection'
            onClick={ this.toggleOptions.bind(this) }
            style={ this.getStyle(selected) }>
          { this.getDisplayValue(selected, this.state.currentIndex) }
        </div>
        { this.renderOptions() }
      </div>
    )
  }
}

