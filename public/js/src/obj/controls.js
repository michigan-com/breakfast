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

  changeLogo(e) {
    this.props.breakfast.logoChanged(e.target.selectedIndex);
  }

  renderLogoSelect(logoObj, index) {
    return(
      <option value={ index }>{ logoObj.name }</option>
    )
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
          <select className='logo-picker' onChange={ this.changeLogo.bind(this) }>
            { this.props.logos.map(this.renderLogoSelect.bind(this)) }
          </select>
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
