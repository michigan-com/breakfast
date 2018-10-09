'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SportsTeamPicker extends Component {
  static propTypes = {
    filter: PropTypes.string,
    filteredTeams: PropTypes.array,
    selectedTeam: PropTypes.string,
    teamScore: PropTypes.string,
    onTeamSelect: PropTypes.func,
    onFilterChange: PropTypes.func,
    onScoreChange: PropTypes.func,
    onManualTeamInput: PropTypes.func,
  };

  teamSelect(team) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.props.onTeamSelect(team);
    };
  }

  renderFilteredTeams() {
    const { filteredTeams, filter, onManualTeamInput, selectedTeam } = this.props;
    if (filter === '' || selectedTeam) return null;

    const displayName = filter.length >= 22 ? `${filter.slice(0, 21)}...` : filter;
    return (
      <div className="sports-team-options">
        <div className="sports-team-option-container high-school" onClick={onManualTeamInput}>
          <div className="suggestion">
            {`Add "${displayName}"?`}
          </div>
        </div>
        {filteredTeams.map((team, i) => (
          <div
            className="sports-team-option-container"
            onClick={this.teamSelect(team)}
            key={`filtered-team-${i}`}
          >
            <div className="sport-team-logo">
              <img src={team.team_logo} alt={team.searchTerm} />
            </div>
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
