'use strict';

import React from 'react';
import ColorPicker from 'react-color';
import { SIXTEEN_NINE, SQUARE, FIT_IMAGE, BACKGROUND_IMAGE, BACKGROUND_COLOR } from '../lib/constants';
import OptionActions from '../actions/options';
import { Select } from '../../util/components';
import CornerPicker from '../../util/components/corner-picker';

let actions = new OptionActions();

export default class Controls extends React.Component {
  constructor(args) {
    super(args);

    this.possibleOptions = ['font', 'background', 'logo'];

    this.state = {
      optionSelected: false,
      selectedOption: ''
    }

    this.defaultImage = `${window.location.origin}/img/default_image.jpg`
  }

  componentDidMount() {
    this.logoChanged({}, 0);
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.contentType === 'watermark' && this.props.contentType != 'watermark') {
    //   if (!nextProps.options.backgroundImg.src) {
    //     actions.backgroundImageUrlChange(this.defaultImage);
    //   } else {
    //     actions.backgroundTypeChange(BACKGROUND_IMAGE);
    //   }
    // } else if (nextProps.contentType !== 'watermark' && this.props.contentType === 'watermark'
    //             && this.props.options.backgroundImg.url === this.defaultImage) {
    //   actions.backgroundTypeChange(BACKGROUND_COLOR);
    // }
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

  cornerChange(corner) {
    this.changeEvent(actions.logoLocationChange, () => { return corner;  });
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

  renderBackgroundOptions() {
    let backgroundClass = `input-container`;

    return (
      <div className='option background'>
        <div className={ backgroundClass }>
          <span className='label'>Color</span>
          <span className='input'>
            <ColorPickerToggle color={ this.props.options.backgroundColor }
                callback={ this.colorChangeCallback(actions.backgroundColorChange) }
                name='background-color-picker'/>
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

  renderLogoOptions() {
    let logoSelect = null;
    if (this.props.logos.length > 1) {
      let currentIndex = 0;
      for (let i = 0; i < this.props.logos.length; i++) {
        let logo = this.props.logos[i];

        if (logo.filename === this.props.options.logo.filename) {
          currentIndex = i;
          break;
        }
      }

      logoSelect = (
        <div className='input-container'>
          <span className='label'>Logo</span>
          <span className='input'>
            <LogoSelect options={ this.props.logos } valueKey='name'
              onSelect={ this.logoChanged.bind(this) } currentIndex={ currentIndex }/>
          </span>
        </div>
      )
    }

    let colorPicker = (<div className='help-text'>This logo cannot be colored. Got another logo we can use? <a href='mailto:rwilliams@michigan.com,mvarano@michigan.com'>Email us!</a></div>);
    if (/svg$/.test(this.props.options.logo.filename)) {
        colorPicker = (
          <ColorPickerToggle color={ this.props.options.logoColor }
                callback={ this.colorChangeCallback(actions.logoColorChange) }
                name='logo-color-picker'/>
        )
    }

    return (
      <div className='option logo'>
        { logoSelect }
        <div className='input-container'>
          <span className='label'>Color</span>
          <span className='input'>{ colorPicker }</span>
        </div>
        <div className='input-container'>
          <span className='label'>Location</span>
          <span className='input'>
            <CornerPicker name='logo-color'
                      callback={ this.cornerChange.bind(this) }
                      activeCorner= { this.props.options.logoLocation }/>
          </span>
        </div>
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

    if (selectedOption === 'background') {
      optionContent = this.renderBackgroundOptions();
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
        { this.renderOptionSelect() }
        { content }
      </div>
    )
  }
}

class ColorPickerToggle extends React.Component {
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
            <ColorPicker className='color-picker' type='chrome'
                color={ this.props.color }
                onChange={ this.props.callback }
                key={ this.props.name }/>
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
      <img src={ `/logos/${option.filename}`} title={ option.name } alt={ option.name }/>
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

