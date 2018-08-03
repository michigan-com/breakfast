'use strict';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TEMPLATE_TYPE_VERSUS } from '../../../actions/templates';
import { updateCandidateName, updateCandidateParty, updateCandidateLocation } from '../../../actions/candidates';

class CandidatesOptions extends Component {
  static propTypes = {
    Candidates: PropTypes.object,
    Templates: PropTypes.object,
  }

  constructor(props) {
    super(props);

  }

  changeCandidateName(i) {
    return (e) => {
      this.props.actions.updateCandidateName(e.target.value, i);
    }
  }

  changeCandidateParty(i) {
    return (e) => {
      this.props.actions.updateCandidateParty(e.target.value, i);
    }
  }

  changeCandidateLocation(i) {
    return (e) => {
      this.props.actions.updateCandidateLocation(e.target.value, i);
    }
  }

  renderCandidate(candidate, index) {
    return (
      <div className='candidate option-container ' key={`editing-candidate-${index}`}>
        <div className='option-container-title'>Name</div>
        <input type='text' value={candidate.name} onChange={this.changeCandidateName(index)}/>

        <div className='option-container-title'>Party</div>
        <input type='text' value={candidate.party} onChange={this.changeCandidateParty(index)}/>

        <div className='option-container-title'>Location</div>
        <input type='text' value={candidate.location} onChange={this.changeCandidateLocation(index)}/>
      </div>
    )
  }

  render() {
    const { activeTemplateType } = this.props.Templates;
    const { candidates } = this.props.Candidates;

    var numCandidates = 1;
    if (activeTemplateType === TEMPLATE_TYPE_VERSUS) numCandidates = 2;
    return (
      <div className='option-container'>
        <div className='option-title'>Candidate(s)</div>
        {candidates.slice(0, numCandidates).map((c, i) => (this.renderCandidate(c, i)))}

      </div>
    )
  }
}

function mapStateToProps(state) {
  const {Candidates, Templates } = state;

  return { Candidates, Templates };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      updateCandidateName,
      updateCandidateParty,
      updateCandidateLocation,
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CandidatesOptions)
