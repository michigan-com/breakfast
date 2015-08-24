import React from 'react';
import ColorPicker from 'react-color';
import { SIXTEEN_NINE, SQUARE } from '../lib/constants';
import OptionActions from '../actions/options';
import { Select } from './components';

let actions = new OptionActions();

export default class Controls extends React.Component {
  constructor(args) {
    super(args);
  }

  componentDidMount() {
    this.logoChanged({}, 0);
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

    let breakfast = this.props.breakfast;
    let contentType = breakfast.state.contentType;
    let backgroundClass = `input-container ${contentType === 'watermark' ? 'hidden' : ''}`;

    return (
      <div>
        <div className={ backgroundClass }>
          <span className='label'>Color</span>
          <span className='input'>
            <PickerToggle color={ breakfast.state.backgroundColor }
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
                  actions.backgroundImageChange,
                  this.getFileFromInput.bind(this, 'image-upload') )} />
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
          onClick={ this.changeEvent.bind(this, actions.aspectRatioChange, function() { return ratio; }) }>
            { ratio }
        </div>
      )

    }
    return (
      <div className='ratio-options'>
        { breakfast.aspectRatios.map(renderRatioOption.bind(this)) }
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
              <input type='range' min='10' max='60' ref='font-size'
                  value={ breakfast.state.fontSize }
                  onChange={ this.changeEvent.bind(this,
                    actions.fontSizeChange,
                    this.getInputVal.bind(this, 'font-size')) }/>
            </span>
          </div>
          <div className='input-container'>
            <span className='label'>Color</span>
            <span className='input'>
              <PickerToggle color={ breakfast.state.fontColor }
                  callback={ this.colorChangeCallback(actions.fontColorChange) }/>
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
          <LogoSelect options={ this.props.logos } valueKey='name'
              onSelect={ this.logoChanged.bind(this) }/>
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

class LogoSelect extends Select {

}
