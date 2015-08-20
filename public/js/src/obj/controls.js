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
    let backgroundClass = `option ${contentType === 'watermark' ? 'hidden' : ''}`;

    return (
      <div className='options'>
        <div className={ backgroundClass }>
        <PickerToggle color={ breakfast.state.backgroundColor } callback={ breakfast.backgroundColorChange.bind(breakfast) }/>
        </div>
        <div className='option'>
        <span className='file-upload' onClick={ this.triggerFileUpload.bind(this) }>Choose an image</span>
        <input type='file' name='image' id='image-upload' onChange={ this.fileUpload.bind(this) } ref='image-upload'/>
        </div>
      </div>
    )
  }

  render() {
    let breakfast = this.props.breakfast;
    return(
      <div className='controls'>
        <div className='control options'>
          <span className='label'>Font Size</span>
          <input type='range' min='10' max='60' value={ breakfast.state.fontSize } onChange={ breakfast.setFontSize.bind(breakfast) }/>
        </div>
        <div className='control font-color-picker'>
          <span className='label'>Font Color</span>
          <PickerToggle color={ breakfast.state.fontColor } callback={ breakfast.fontColorChange.bind(breakfast) }/>
        </div>
        <div className='control background'>
          <span className='label'>Background</span>
          { this.renderBackgroundOptions() }
        </div>
        <div className='control aspect-ratio'>
          <span className='label'>Aspect Ratio</span>
          <div className='options'>
            <div className='option'>
              <div className='aspect-ratio' onClick={ breakfast.aspectRatioChange.bind(breakfast, SIXTEEN_NINE)}>{ SIXTEEN_NINE }</div>
            </div>
            <div className='option'>
              <div className='aspect-ratio' onClick={ breakfast.aspectRatioChange.bind(breakfast, SQUARE) }>{ SQUARE }</div>
            </div>
          </div>
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
            <span className='picker-close' onClick= { this.hidePicker.bind(this) }>Close</span>
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
