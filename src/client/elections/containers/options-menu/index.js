'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import OptionChoice from '../../../breakfast/components/options-menu/option-choice';
import { optionSelect } from '../../../breakfast/actions/options-menu';
import { updateFilename, startDownloading } from '../../../breakfast/actions/downloading';
import BackgroundOptions from '../../../breakfast/containers/options-menu/options/background';
import LogoOptions from './options/logo';
import TextOptions from './options/text';
import CandidateOptions from './options/candidates';
import TemplateOptions from './options/templates';

class OptionsMenuComponent extends Component {
  static propTypes = {
    OptionsMenu: PropTypes.object.isRequired,
    Downloading: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  filenameChange = (e) => {
    const filename = e.target.value;
    this.props.actions.updateFilename(filename);
  }

  renderOptionsAsNeeded() {
    const { OptionsMenu } = this.props;
    const { selectedIndex, options } = OptionsMenu;
    if (selectedIndex < 0 || selectedIndex >= options.length) return null;

    const option = options[selectedIndex];
    let optionsElement = null;
    switch (option) {
      case 'logo':
        optionsElement = <LogoOptions />;
        break;
      case 'text':
        optionsElement = <TextOptions />;
        break;
      case 'candidates':
        optionsElement = <CandidateOptions />;
        break;
      case 'templates':
        optionsElement = <TemplateOptions />;
        break;
      default:
        optionsElement = null;
    }

    return (
      <div className="options-container">
        {optionsElement}
      </div>
    );
  }

  render() {
    const { OptionsMenu, Downloading } = this.props;
    let buttonClass = 'save-button';
    let saveButtonContent = 'Download File';
    if (window.innerWidth < 768) {
      saveButtonContent = '';
    } else if (Downloading.downloading) {
      buttonClass += ' downloading';
      saveButtonContent = 'Saving...';
    }

    return (
      <div className="options">
        <div className="options-menu-container">
          <div className="options-menu-container-title">
            <div className="options-menu-title-image">
              <img src="/img/menu-icon.svg" alt="Menu" />
            </div>
            <div className="options-menu-title-text">
              Layout Editor
            </div>
          </div>
          {OptionsMenu.options.map((option, index) => (
            <OptionChoice
              option={option}
              index={index}
              selected={OptionsMenu.selectedIndex === index}
              onClick={this.props.actions.optionSelect}
              key={`option-choice-${index}`}
            />
          ))}
          <div className="save-container">
            <p style={{ margin: 0 }}>Filename</p>
            <input
              placeholder="pic"
              type="text"
              ref="file-name"
              id="file-name"
              onChange={this.filenameChange}
            />
            <div
              className={buttonClass}
              onClick={this.props.actions.startDownloading}
            >
              <img src="/img/download.svg" alt="download" className="download-image" />
              {saveButtonContent}
            </div>
          </div>
        </div>
        {this.renderOptionsAsNeeded()}
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { OptionsMenu, Downloading } = state;
  return { OptionsMenu, Downloading };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      optionSelect,
      updateFilename,
      startDownloading,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsMenuComponent);
