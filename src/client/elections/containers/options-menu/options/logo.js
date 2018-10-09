'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { logoChange, logoColorChange, logoLocationChange, toggleLogoFavorite,
  DARK_LOGO_COLOR } from '../../../../breakfast/actions/logo';
import Select from '../../../../util/components/select';
import CornerPicker from '../../../../breakfast/components/corner-picker';
import { getPresentState } from '../../../../breakfast/selectors/present';


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

  render() {
    return (
      <div className="logo-options-container">
        <div className="option-container">
          <div className="option-container-title">Add your news logo</div>
          <div className="logo-select-container">
            {this.renderLogoSelect()}
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
        <img className="logo-image" src={`/logos/${option.filename}?color=404040`} title={option.name} alt={option.name} />
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
