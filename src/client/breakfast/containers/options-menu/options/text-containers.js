'use strict';

import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { HEADER_TEXT_CONTAINER, BODY_TEXT_CONTAINER, CAPTION_TEXT_CONTAINER,
  updateEditorDisplay } from '../../../actions/text';
import { filterTeams, selectTeam, scoreChange, toggleSportsScore, timeChange,
    scorePositionChange, DEFAULT_TEAM_SCORE } from '../../../actions/sports';
import { getPresentState } from '../../../selectors/present';
import { filteredTeamsSelector } from '../../../selectors/sports';
import SportsTeamPicker from '../../../components/options-menu/sports-team-picker';
import RadioToggle from '../../../components/radio-toggle';

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

  onTeamSelect = (index) => (
    (team) => {
      const teamData = {
        ...DEFAULT_TEAM_SCORE,
        teamName: team.searchTerm,
        teamAbbr: team.team_abbr,
        logoUrl: team.team_logo,
      };
      this.props.actions.selectTeam(teamData, index);
    }
  )

  onFilterChange = (index) => (
    (filter) => {
      this.props.actions.filterTeams(filter, index);
    }
  )

  onScoreChange = (index) => (
    (score) => {
      this.props.actions.scoreChange(score, index);
    }
  )

  onToggleSportsScore = (show) => {
    this.props.actions.toggleSportsScore(show);
  }

  onScorePositionChange = (index) => (
    () => {
      this.props.actions.scorePositionChange(index);
    }
  )

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

  renderTeamFilters() {
    const { Sports, filteredTeams } = this.props;
    const { scoreData, filter, filterTeamIndex, positionOptions, currentPositionIndex } = Sports;

    let pickerTeams = [];
    if (filter.length > 2) pickerTeams = filteredTeams.slice(0, 5);

    const sportsStuff = [];
    if (Sports.showSports) {
      const positionData = [];
      for (let i = 0; i < positionOptions.length; i++) {
        const position = positionOptions[i];
        const className = ['position-option-container'];
        if (i === currentPositionIndex) className.push('active');
        positionData.push(
          <div
            className={className.join(' ')}
            onClick={this.onScorePositionChange(i)}
            key={`score-position-option-${i}`}
          >
            <div className="position-option">
              <div className="position-option-image-container">
                <img src={`/img/score-align-${position}.svg`} alt={position} />
              </div>
              <div className="text">{position}</div>
            </div>
          </div>
        );
      }

      sportsStuff.push(
        <div className="option-container">
          <div className="option-container-title">Score Layout</div>
          {positionData}
        </div>
      );

      for (let i = 0; i < scoreData.teams.length; i++) {
        const team = scoreData.teams[i];
        sportsStuff.push(
          <div className="option-container" key={`sports-team-picker-${i}`}>
            <div className="option-container-title">{`Team ${i}`}</div>
            <SportsTeamPicker
              filter={i === filterTeamIndex ? filter : team.teamName}
              filteredTeams={i === filterTeamIndex ? pickerTeams : []}
              selectedTeam={team.teamName}
              teamScore={scoreData.teamScores[i]}
              onTeamSelect={this.onTeamSelect(i)}
              onFilterChange={this.onFilterChange(i)}
              onScoreChange={this.onScoreChange(i)}
              key={`sports-team-filter-${i}`}
            />
          </div>
        );
      }

      sportsStuff.push(
        <div className="option-container">
          <div className="option-container-title">Time (Quarter, Inning, etc)</div>
          <input
            type="text"
            name="time"
            value={scoreData.time}
            placeholder={"Half Time"}
            onChange={(e) => { this.props.actions.timeChange(`${e.target.value}`); }}
          />
        </div>
      );
    }

    return (
      <div className="sports-score">
        <RadioToggle
          label={"Add Sports Score"}
          active={Sports.showSports}
          onToggle={this.onToggleSportsScore}
        />
        {sportsStuff}
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
        <div className="option-container">
          <div className="option-container-title">Sports Score</div>
          {this.renderTeamFilters()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Text, Sports } = getPresentState(state);
  const filteredTeams = filteredTeamsSelector(state);
  return { Text, Sports, filteredTeams };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      updateEditorDisplay,
      filterTeams,
      selectTeam,
      scoreChange,
      toggleSportsScore,
      timeChange,
      scorePositionChange,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextContainerOptions);
