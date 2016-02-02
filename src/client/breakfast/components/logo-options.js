'use strict';

import React from 'react';

import Store from '../store';
import { logoChange, logoColorChange, logoLocationChange } from '../actions/logo';
import Select from '../../util/components/select';
import CornerPicker from './subcomponents/corner-picker';

export default class LogoOptions extends React.Component {
  static ColorOptions = ['black', 'white'];

  cornerChange = (corner) => {
    Store.dispatch(logoLocationChange(corner));
  }

  logoChanged = (logoInfo, index) => {
    Store.dispatch(logoChange(index));
  }

  logoColorChange = (c) => {
    let color;
    switch (c) {
      case 'black':
        color = '#000';
        break;
      case 'white':
        color = '#fff';
        break;
    }

    return () => {
      Store.dispatch(logoColorChange(color));
    }
  }

  isActiveColor(color) {
    if (color === 'black') {
      return this.props.options.logoColor === '#000';
    } else if (color === 'white') {
      return this.props.options.logoColor === '#fff';
    }

    return false;
  }

  renderLogoSelect() {
    let logoSelect = null;
    let logos = this.props.options.logoOptions;
    let currentLogo = this.props.options.logo;

    if (logos.length > 1) {
      let currentIndex = 0;
      for (let i = 0; i < logos.length; i++) {
        let logo = logos[i];

        if (logo.filename === currentLogo.filename) {
          currentIndex = i;
          break;
        }
      }

      logoSelect = (
        <LogoSelect options={ logos } valueKey='name'
          onSelect={ this.logoChanged.bind(this) } currentIndex={ currentIndex }/>
      )
    }

    return logoSelect;
  }

  renderLogoColorPicker() {
    let options = this.props.options;
    let currentLogo = options.logo;
    let goodLogoCheck = /\.svg$/;

    if (!goodLogoCheck.test(currentLogo.filename) || currentLogo.noColor) {
      return (
        <div className='no-color'>
          <p>This logo cannot be colored.</p>
          <p>Got a better logo? <a href='mailto:help@breakfast.im'>Email us!</a></p>
        </div>
      )
    }

    let colorOptions = [];
    for (let color of LogoOptions.ColorOptions) {
      let colorClass = ` color ${color}`;
      if (this.isActiveColor(color)) colorClass += ' active';

      colorOptions.push(
        <div className='color-container' key={ `logo-color-${color}` }>
          <div className={ colorClass } onClick={ this.logoColorChange(color) }></div>
        </div>
      )
    }

    return (
      <div className='color-options'>
        { colorOptions }
      </div>
    )
  }

  render() {

    return (
      <div className='logo-options-container'>
        <div className='title'>Logos</div>
        <div className='logo-select-container'>
          { this.renderLogoSelect() }
        </div>
        <div className='color-picker logo'>
          { this.renderLogoColorPicker() }
        </div>
        <div className='corner-picker-container'>
          <CornerPicker name='logo-color'
            callback={ this.cornerChange }
            activeCorner= { this.props.options.logoLocation }/>
        </div>
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

