import React from 'react';
import ColorPicker from 'react-color';
import { SIXTEEN_NINE, SQUARE, FIT_IMAGE, BACKGROUND_IMAGE } from '../lib/constants';
import OptionActions from '../actions/options';
import { Select } from './components';

let actions = new OptionActions();

export default class Controls extends React.Component {
  constructor(args) {
    super(args);

    this.possibleOptions = ['font', 'background', 'aspect ratio', 'logo'];

    this.state = {
      optionSelected: false,
      selectedOption: ''
    }
  }

  componentDidMount() {
    this.logoChanged({}, 0);
  }

  /**
   * When a top-level option is selected
   */
  selectOption(selectedOption) {
    if (this.possibleOptions.indexOf(selectedOption) < 0) return;

    this.setState({
      optionSelected: true,
      selectedOption
    });
  }

  closeOption() {
    this.setState({
      optionSelected: false,
      selectedOption: ''
    })
  }

  /**
   * Used to emit events through the dispatcher. Takes and event callback,
   * and an optional ref to pull the value from
   *
   * @memberof Content
   * @param {Function} action - Action that gets executed to update the store.
   *  See ../actions/content.js for more details on available actions
   * @param {Function} getter - Function used to get the value(s) to be passed
   *  to the action() function. getter() must return a single argument, or an
   *  array of arguments
   */
  changeEvent(action, getter) {
    let args;

    if (getter && typeof getter === 'function') {
      args = getter();
    }

    if (Array.isArray(args)) {
      action.apply(action, args);
    } else {
      action(args);
    }
  }

  triggerFileUpload() {
    let input = React.findDOMNode(this.refs['image-upload']);
    input.click();
  }

  logoChanged(logoInfo, index) {
    this.changeEvent(actions.logoChange, () => { return index; });
  }

  fontFaceChanged(fontFace, index) {
    this.changeEvent(actions.fontFaceChange, () => { return index; });
  }

  /**
   * Closure used for color change callbacks. Store an actions and return the
   * callback that will be called by the color picker
   *
   * @param {Function} action - Action in the OptionActions class
   */
  colorChangeCallback(action) {
    let changeEvent = this.changeEvent;

    return function(color) {
      changeEvent(action, () => { return `#${color.hex}`; });
    }
  }

  /**
   * Given a React ref to an <input type='file'> obj, get the file from the
   * object and return it
   *
   * @param {String} ref - string used to find obj in this.refs[]. Must be
   *    <input type='file'> object
   * @returns {Object/null} - First possible file object if the ref exists and
   *    has files, null otherwise
   */
  getFileFromInput(ref) {
    if (!(ref in this.refs)) return null;

    let input = React.findDOMNode(this.refs[ref]);
    if (!input.files || !input.files.length) return null;

    return input.files[0];
  }

  /**
   * Given a ref to an <input> object, get the object and return its .value
   * attribute. Can be used in this.changeEvent() as a getter
   *
   * @memberof Content
   * @param {String} ref - React ref. Will look in this.refs for the ref. NOTE
   *  must refer to an <input> object
   * @return {String} Value of the <input> object defined by ref
   */
  getInputVal(ref) {
    let value;
    if (ref && ref in this.refs) {
      value = React.findDOMNode(this.refs[ref]).value;
    }

    return value;
  }

  renderFontOptions() {
    let options = this.props.options;
    let currentIndex = 0;
    for (var i = 0; i < this.props.fonts.length; i++) {
      let font = this.props.fonts[i];
      if (this.props.options.fontFace === font) {
        currentIndex = i;
        break;
      }
    }

    return (
      <div className='option font'>
        <div className='input-title'>Font</div>
        <div className='input-container'>
          <span className='label'>Size</span>
          <span className='input'>
            <input type='range' min='10' max='60' ref='font-size'
                value={ options.fontSize }
                onChange={ this.changeEvent.bind(this,
                  actions.fontSizeChange,
                  this.getInputVal.bind(this, 'font-size')) }/>
          </span>
        </div>
        <div className='input-container'>
          <span className='label'>Color</span>
          <span className='input'>
            <PickerToggle color={ options.fontColor }
                callback={ this.colorChangeCallback(actions.fontColorChange) }/>
          </span>
        </div>
        <div className='input-container'>
          <span className='label'>Face</span>
          <span className='input'>
            <FontSelect options={ this.props.fonts }
                onSelect={ this.fontFaceChanged.bind(this) }
                currentIndex={ currentIndex }/>
          </span>
        </div>
      </div>
    )
  }

  renderBackgroundOptions() {

    let contentType = this.props.contentType;
    let backgroundClass = `input-container ${contentType === 'watermark' ? 'hidden' : ''}`;

    return (
      <div className='option background'>
        <div className='input-title'>Background</div>
        <div className={ backgroundClass }>
          <span className='label'>Color</span>
          <span className='input'>
            <PickerToggle color={ this.props.options.backgroundColor }
                callback={ this.colorChangeCallback(actions.backgroundColorChange) }/>
          </span>
        </div>
        <div className='input-container'>
          <span className='label'>File</span>
          <span className='input'>
            <span className='file-upload' onClick={ this.triggerFileUpload.bind(this) }>Choose image</span>
            <input type='file'
                name='image'
                id='image-upload'
                ref='image-upload'
                onChange={ this.changeEvent.bind(this,
                  actions.backgroundImageFileChange,
                  this.getFileFromInput.bind(this, 'image-upload') )} />
          </span>
        </div>
      </div>
    )
  }

  renderRatioOptions() {
    let currentRatio = this.props.options.aspectRatio;

    function renderRatioOption(ratio, key) {
      switch(ratio) {
        case FIT_IMAGE:
          if (this.props.options.backgroundType !== BACKGROUND_IMAGE) return null;
        case SQUARE:
          if (this.props.contentType === 'watermark') return null;
      }

      return (
        <div className={ `aspect-ratio ${currentRatio === ratio ? 'active' : ''}`}
          key={ ratio }
          onClick={ this.changeEvent.bind(this, actions.aspectRatioChange, function() { return ratio; }) }>
            { ratio }
        </div>
      )
    }

    return (
      <div className='option aspect-ratio'>
        <div className='input-title'>Aspect Ratio</div>
        <div className='ratio-options'>
          { this.props.aspectRatios.map(renderRatioOption.bind(this)) }
        </div>
      </div>
    )
  }

  renderLogoOptions() {
    let currentIndex = 0;
    for (let i = 0; i < this.props.logos.length; i++) {
      let logo = this.props.logos[i];

      if (logo.filename === this.props.options.logo.filename) {
        currentIndex = i;
        break;
      }
    }

    return (
      <div className='option logo'>
        <div className='input-title'>Logo</div>
        <LogoSelect options={ this.props.logos } valueKey='name'
            onSelect={ this.logoChanged.bind(this) } currentIndex={ currentIndex }/>
      </div>
    )
  }
  /**
   * Render the buttons to select which option to use
   */
  renderOptionSelect() {
    function renderOption(option, index) {
      let className = 'option-select';
      let callback = this.selectOption.bind(this, option);
      if (this.state.optionSelected && this.state.selectedOption === option) {
        className += ' active';
        callback = this.closeOption.bind(this);
      }

      return (
        <div className={ className } onClick={ callback } key={ option }>{ option }</div>
      )

    }

    return(
      <div className='option-select-container'>
        { this.possibleOptions.map(renderOption.bind(this)) }
      </div>
    )
  }

  /**
   * When an option is selected, render the option
   */
  renderSelectedOption() {
    let selectedOption = this.state.selectedOption;
    let optionContent;

    if (selectedOption === 'font') {
      optionContent = this.renderFontOptions();
    } else if (selectedOption === 'background') {
      optionContent = this.renderBackgroundOptions();
    } else if (selectedOption === 'aspect ratio') {
      optionContent = this.renderRatioOptions();
    } else if (selectedOption === 'logo') {
      optionContent = this.renderLogoOptions();
    }

    return (
      <div className='option-container'>
        { optionContent }
      </div>
    )
  }

  render() {
    let content;
    if (this.state.optionSelected) {
      content = this.renderSelectedOption();
    }

    return (
      <div className='options'>
        <div className='section-title'>Options</div>
        { this.renderOptionSelect() }
        { content }
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
            <ColorPicker className='color-picker' type='chrome' color={ this.props.color } onChangeComplete={  this.props.callback }/>
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

class LogoSelect extends Select {
  constructor(args) {
    super(args);

    this.htmlClass = 'logo-select';
  }

  getDisplayValue(option, index) {
    return (
      <img src={ `/logos/000000/${option.filename}`} title={ option.name } alt={ option.name }/>
    )
  }
}

class FontSelect extends Select {
  /**
   * this.props.options are just going to be an array of strings, so just
   * return the string
   *
   * @param {String} option - Font face to render
   * @param {Number} index - Index of the option
   */
  getDisplayValue(option, index) { return option; }

  getStyle(option) {
    return {
      fontFamily: option
    }
  }
}
