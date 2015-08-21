import React from 'react';
import ColorPicker from 'react-color';
import { SIXTEEN_NINE, SQUARE } from '../lib/constants';

export default class Controls extends React.Component {
  constructor(args) {
    super(args);
  }

  fileUpload(e) {
    this.props.breakfast.getFileContents(e, React.findDOMNode(this.refs['image-upload']));
  }

  triggerFileUpload() {
    let input = React.findDOMNode(this.refs['image-upload']);
    input.click();
  }

  logoChanged(logoInfo, index) {
    this.props.breakfast.logoChanged(index);
  }

  renderBackgroundOptions() {

    let breakfast = this.props.breakfast;
    let contentType = breakfast.state.contentType;
    let backgroundClass = `input-container ${contentType === 'watermark' ? 'hidden' : ''}`;

    return (
      <div>
        <div className={ backgroundClass }>
          <span className='label'>Color</span>
          <span className='input'>
            <PickerToggle color={ breakfast.state.backgroundColor } callback={ breakfast.backgroundColorChange.bind(breakfast) }/>
          </span>
        </div>
        <div className='input-container'>
          <span className='label'>File</span>
          <span className='input'>
            <span className='file-upload' onClick={ this.triggerFileUpload.bind(this) }>Choose image</span>
            <input type='file' name='image' id='image-upload' onChange={ this.fileUpload.bind(this) } ref='image-upload'/>
          </span>
        </div>
      </div>
    )
  }

  renderRatioOptions() {
    let breakfast = this.props.breakfast;
    let currentRatio = breakfast.state.aspectRatio;

    function renderRatioOption(ratio, key) {
      return (
        <div className={ `aspect-ratio ${currentRatio === ratio ? 'active' : ''}`}
          onClick={ breakfast.aspectRatioChange.bind(breakfast, ratio)}>
            { ratio }
        </div>
      )

    }
    return (
      <div className='ratio-options'>
        { breakfast.aspectRatios.map(renderRatioOption) }
      </div>
    )
  }

  render() {
    let breakfast = this.props.breakfast;
    return(
      <div className='controls'>
        <div className='section-title'>Options</div>
        <div className='control font'>
          <div className='input-title'>Font</div>
          <div className='input-container'>
            <span className='label'>Size</span>
            <span className='input'>
              <input type='range' min='10' max='60' value={ breakfast.state.fontSize } onChange={ breakfast.setFontSize.bind(breakfast) }/>
            </span>
          </div>
          <div className='input-container'>
            <span className='label'>Color</span>
            <span className='input'>
              <PickerToggle color={ breakfast.state.fontColor } callback={ breakfast.fontColorChange.bind(breakfast) }/>
            </span>
          </div>
        </div>
        <div className='control background'>
          <div className='input-title'>Background</div>
          { this.renderBackgroundOptions() }
        </div>
        <div className='control aspect-ratio'>
          <div className='input-title'>Aspect Ratio</div>
          { this.renderRatioOptions() }
        </div>
        <div className='control logo'>
          <div className='input-title'>Logo</div>
          <Select options={ this.props.logos } valueKey='name' onSelect={ this.logoChanged.bind(this) }/>
        </div>
      </div>

    )
  }
}

class PickerToggle extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      pickerHidden: true
    }
  }

  showPicker() {
    this.setState({ pickerHidden: false });
  }

  hidePicker() {
    this.setState({ pickerHidden: true });
  }

  renderPicker() {

    return (
      <div className='picker'>
          <span className='picker-open' onClick={ this.showPicker.bind(this) }>Pick Color</span>
          <div className={ `picker-container ${ this.state.pickerHidden ? 'hide' : ''}` }>
            <span className='picker-close' onClick= { this.hidePicker.bind(this) }>X</span>
            <ColorPicker className='color-picker' type='compact' color={ this.props.color } onChangeComplete={  this.props.callback }/>
          </div>
      </div>
    )
  }

  render() {
    return (
      <div className='picker-toggle'>
        { this.renderPicker() }
      </div>
    )
  }
}

class Select extends React.Component {
  constructor(args) {
    super(args);

    this.state = {
      optionsHidden: true,
      currentIndex: 0
    }
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

  getValue(option) {
    let valueKey = this.props.valueKey;
    if (!valueKey) valueKey = 'value';
    if (!valueKey in option) console.log(`Key ${valueKey} not found`);

    return option[valueKey];
  }

  renderOptions() {
    if (this.state.optionsHidden) return;

    function renderOption(option, index) {
      return (
        <div className={ `option ${index === this.state.currentIndex ? 'selected' : ''}` }
            onClick={ this.optionSelected.bind(this, index) }>
          { this.getValue(option) }
        </div>
      )
    }

    return (
      <div className='options'>
        { this.props.options.map(renderOption.bind(this)) }
      </div>
    )
  }

  render() {
    if (!this.props.options.length) {
      return;
    }

    let selected = this.props.options[this.state.currentIndex];
    return (
      <div className={ `select ${ this.state.optionsHidden ? '' : 'show' }`}>
        <div className='current-selection' onClick={ this.toggleOptions.bind(this) }>{ this.getValue(selected) }</div>
        { this.renderOptions() }
      </div>
    )
  }
}
