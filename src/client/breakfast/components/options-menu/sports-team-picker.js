'use strict';

import React, { Component, PropTypes } from 'react';

export default class SportsTeamPicker extends Component {
  static propTypes = {
    filter: PropTypes.string,
    filteredTeams: PropTypes.array,
    selectedTeam: PropTypes.string,
    teamScore: PropTypes.string,
    onTeamSelect: PropTypes.func,
    onFilterChange: PropTypes.func,
    onScoreChange: PropTypes.func,
  };

  teamSelect(team) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.props.onTeamSelect(team);
    };
  }

  renderFilteredTeams() {
    const { filteredTeams } = this.props;
    if (filteredTeams.length === 0) return null;
    return (
      <div className="sports-team-options">
        {filteredTeams.map((team) => (
          <div className="sports-team-option-container" onClick={this.teamSelect(team)}>
            <div className="sports-team-name">
              {team.searchTerm}
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { filter, selectedTeam, teamScore } = this.props;

    return (
      <div className="sports-team-picker">
        <div className="team-picker-container">
          <img src="/img/magnifying-glass.svg" alt="magnifying-glass" className="search-image" />
          <input
            className="team-picker"
            type="text"
            value={selectedTeam || filter}
            placeholder={'Detroit Lions'}
            name="sports-team-filter"
            onChange={(e) => { this.props.onFilterChange(e.target.value); }}
          />
        </div>
        {this.renderFilteredTeams()}
        <div className="team-score-container">
          <div className="team-score-text">Team Score</div>
          <input
            className="team-score-input"
            type="text"
            value={teamScore}
            placeholder={'Score'}
            onChange={(e) => { this.props.onScoreChange(`${e.target.value}`); }}
          />
        </div>
      </div>
    );
  }
}
