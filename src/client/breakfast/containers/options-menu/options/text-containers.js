'use strict';

import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { HEADER_TEXT_CONTAINER, BODY_TEXT_CONTAINER, CAPTION_TEXT_CONTAINER,
  updateEditorDisplay } from '../../../actions/text';
import { getPresentState } from '../../../selectors/present';

class TextContainerOptions extends Component {
  static propTypes = {
    Sports: PropTypes.object,
    Text: PropTypes.object,
    filteredTeams: PropTypes.array,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.renderTextContainerButton = this.renderTextContainerButton.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
  }

  getButtonImage(containerType) {
    switch (containerType) {
      case HEADER_TEXT_CONTAINER:
      default:
        return <img src="/img/header.svg" alt="Header" />;
      case BODY_TEXT_CONTAINER:
        return <img src="/img/body.svg" alt="Body" />;
      case CAPTION_TEXT_CONTAINER:
        return <img src="/img/caption.svg" alt="Caption" />;
    }
  }

  toggleDisplay(index) {
    return () => {
      const textContainer = this.props.Text.textContainers[index];
      this.props.actions.updateEditorDisplay(index, !textContainer.display);
    };
  }

  renderTextContainerButton(container, index) {
    const textContainerButtonClass = ['text-container-button-container'];
    if (container.display) textContainerButtonClass.push('show');

    return (
      <div className={textContainerButtonClass.join(' ')} key={`text-container-button-${index}`}>
        <div className="text-container-button">
          <div className="text-container-button-image" onClick={this.toggleDisplay(index)}>
            {this.getButtonImage(container.containerType)}
          </div>
          <div className="text-container-button-text">{container.containerType}</div>
        </div>
      </div>
    );
  }

  render() {
    const { Text } = this.props;
    const { textContainers } = Text;

    return (
      <div className="text-container-options">
        <div className="option-container">
          <div className="option-container-title">Add up to three containers</div>
            {textContainers.map(this.renderTextContainerButton)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Text } = getPresentState(state);
  return { Text };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      updateEditorDisplay,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextContainerOptions);
