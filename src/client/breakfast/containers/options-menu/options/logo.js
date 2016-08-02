'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { logoChange, logoColorChange, logoLocationChange } from '../../../actions/logo';
import Select from '../../../../util/components/select';
import CornerPicker from '../../../components/corner-picker';


class LogoOptions extends Component {
  static ColorOptions = ['black', 'white'];
  static propTypes = {
    Logo: PropTypes.object,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.logoChanged = this.logoChanged.bind(this);
  }

  cornerChange = (corner) => {
    this.props.actions.logoLocationChange(corner);
  }

  logoChanged = (logoInfo, index) => {
    const { Logo } = this.props;
    this.props.actions.logoChange(logoInfo, index, Logo.logoColor);
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
      const { Logo } = this.props;
      this.props.actions.logoColorChange(Logo.logo, logoColor);
    };
  }

  isActiveColor(color) {
    const { Logo } = this.props;
    if (color === 'black') {
      return Logo.logoColor === '#000';
    } else if (color === 'white') {
      return Logo.logoColor === '#fff';
    }

    return false;
  }

  renderLogoSelect() {
    const { Logo } = this.props;
    const logoIndex = Logo.logoIndex;
    let logoSelect = null;
    if (logoIndex === null) return null;

    let logos = Logo.logoOptions;
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
    const { Logo } = this.props;
    const logoIndex = Logo.logoIndex;
    if (logoIndex === null) return null;

    const currentLogo = Logo.logo;
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
        <div className="option-container">
          <div className="option-container-title">Add your news logo</div>
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
              activeCorner={this.props.Logo.logoLocation}
            />
          </div>
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

function mapStateToProps(state) {
  const { Logo } = state;
  return { Logo };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      logoChange,
      logoColorChange,
      logoLocationChange,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoOptions);
