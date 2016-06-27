'use strict';

import React from 'react';

import Store from '../store';
import { logoChange, logoColorChange, logoLocationChange } from '../actions/logo';
import Select from '../../util/components/select';
import CornerPicker from './subcomponents/corner-picker';

export default class LogoOptions extends React.Component {
  static ColorOptions = ['black', 'white'];
  constructor(props) {
    super(props);

    this.logoChanged = this.logoChanged.bind(this);
  }

  cornerChange = (corner) => {
    Store.dispatch(logoLocationChange(corner));
  }

  logoChanged = (logoInfo, index) => {
    Store.dispatch(logoChange(logoInfo, index, this.props.options.Logo.logoColor));
  }

  logoColorChange = (c) => {
    let logoColor;
    switch (c) {
      case 'black':
        logoColor = '#000';
        break;
      case 'white':
      default:
        logoColor = '#fff';
        break;
    }

    return () => {
      const logo = this.props.options.Logo.logo;
      Store.dispatch(logoColorChange(logo, logoColor));
    };
  }

  isActiveColor(color) {
    if (color === 'black') {
      return this.props.options.Logo.logoColor === '#000';
    } else if (color === 'white') {
      return this.props.options.Logo.logoColor === '#fff';
    }

    return false;
  }

  renderLogoSelect() {
    let logoSelect = null;
    const logoIndex = this.props.options.Logo.logoIndex;
    if (logoIndex === null) return null;

    let logos = this.props.options.Logo.logoOptions;
    const currentLogo = logos[logoIndex];

    if (logos.length > 1) {
      let currentIndex = 0;
      for (let i = 0; i < logos.length; i++) {
        const logo = logos[i];

        if (logo.filename === currentLogo.filename) {
          currentIndex = i;
          break;
        }
      }

      logoSelect = (
        <LogoSelect
          options={logos}
          valueKey="name"
          onSelect={this.logoChanged}
          currentIndex={currentIndex}
        />
      );
    }

    return logoSelect;
  }

  renderLogoColorPicker() {
    const options = this.props.options;
    const logoIndex = options.Logo.logoIndex;
    if (logoIndex === null) return null;

    const currentLogo = options.Logo.logo;
    const goodLogoCheck = /\.svg$/;

    if (!goodLogoCheck.test(currentLogo.filename) || currentLogo.noColor) {
      return (
        <div className="no-color">
          <p>This logo cannot be colored.</p>
          <p>Got a better logo? <a href="mailto:help@breakfast.im">Email us!</a></p>
        </div>
      );
    }

    let colorOptions = [];
    for (const color of LogoOptions.ColorOptions) {
      let colorClass = ` color ${color}`;
      if (this.isActiveColor(color)) colorClass += ' active';

      colorOptions.push(
        <div className="color-container" key={`logo-color-${color}`}>
          <div className={colorClass} onClick={this.logoColorChange(color)}></div>
        </div>
      );
    }

    return (
      <div className="color-options">
        {colorOptions}
      </div>
    );
  }

  render() {
    return (
      <div className="logo-options-container">
        <div className="title">Logos</div>
        <div className="logo-select-container">
          {this.renderLogoSelect()}
        </div>
        <div className="color-picker logo">
          {this.renderLogoColorPicker()}
        </div>
        <div className="corner-picker-container">
          <CornerPicker
            name="logo-color"
            callback={this.cornerChange}
            activeCorner={this.props.options.Logo.logoLocation}
          />
        </div>
      </div>
    );
  }
}


class LogoSelect extends Select {
  constructor(args) {
    super(args);
    this.htmlClass = 'logo-select';
  }

  getDisplayValue(option) {
    return (
      <img src={`/logos/${option.filename}`} title={option.name} alt={option.name} />
    );
  }
}

LogoOptions.propTypes = {
  options: React.PropTypes.shape(Store.getState()).isRequired,
};
