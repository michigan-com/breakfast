'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import OptionChoice from '../../components/options-menu/option-choice';
import { optionSelect } from '../../actions/options-menu';
import { updateFilename, startDownloading } from '../../actions/downloading';
import BackgroundOptions from './options/background';
import AspectRatioOptions from './options/aspect-ratio';
import LogoOptions from './options/logo';
import TextContainerOptions from './options/text-containers';

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
      case 'background':
        optionsElement = <BackgroundOptions />;
        break;
      case 'aspect-ratio':
        optionsElement = <AspectRatioOptions />;
        break;
      case 'logo':
        optionsElement = <LogoOptions />;
        break;
      case 'text-containers':
        optionsElement = <TextContainerOptions />;
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
    if (Downloading.downloading) {
      buttonClass += ' downloading';
      saveButtonContent = 'Saving...';
    }

    return (
      <div className="options">
        <div className="options-menu-container">
          <div className="options-menu-container-title">Layout Editor</div>
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
