'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { logoChange, logoColorChange, logoLocationChange, toggleLogoFavorite,
  DARK_LOGO_COLOR } from '../../../actions/logo';
import Select from '../../../../util/components/select';
import CornerPicker from '../../../components/corner-picker';
import { getPresentState } from '../../../selectors/present';


class LogoOptions extends Component {
  static ColorOptions = [DARK_LOGO_COLOR, 'white'];
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
        logoColor = '#fff';
        break;
      default:
        logoColor = c;
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
          toggleFavorite={this.props.actions.toggleLogoFavorite}
          currentIndex={currentIndex}
          displayFilter
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
      const style = { backgroundColor: color };
      let colorClass = ' color';
      if (this.isActiveColor(color)) colorClass += ' active';


      colorOptions.push(
        <div className="color-container" key={`logo-color-${color}`}>
          <div className={colorClass} onClick={this.logoColorChange(color)} style={style}></div>
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

  favoriteButtonClick(name, favorite) {
    return (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.props.toggleFavorite(name, !favorite);
    };
  }

  getDisplayValue(option) {
    const starSrc = option.favorite ? '/img/star-active.svg' : '/img/star-inactive.svg';

    return (
      <div className="logo-display-value">
        <img
          src={starSrc}
          className="favorite-button"
          onClick={this.favoriteButtonClick(option.name, option.favorite)}
        />
        <img className="logo-image" src={`/logos/${option.filename}`} title={option.name} alt={option.name} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Logo } = getPresentState(state);
  return { Logo };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      logoChange,
      logoColorChange,
      logoLocationChange,
      toggleLogoFavorite,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoOptions);
