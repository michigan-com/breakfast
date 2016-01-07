'use strict';

import React from 'react';

import OptionActions from '../../actions/options';
import Select from '../../../util/components/select';
import CornerPicker from '../../../util/components/corner-picker';

let actions = new OptionActions();

export default class LogoOptions extends React.Component {
  cornerChange = (corner) => {
    actions.logoLocationChange(corner);
  }

  logoChanged = (logoInfo, index) => {
    actions.logoChange(index);
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
  render() {

    return (
      <div className='logo-options-container'>
        <div className='title'>Logos</div>
        <div className='logo-select-container'>
          { this.renderLogoSelect() }
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

