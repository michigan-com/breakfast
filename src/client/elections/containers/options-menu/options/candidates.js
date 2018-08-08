'use strict';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { TEMPLATE_TYPE_VERSUS } from '../../../actions/templates';
import { updateCandidateName, updateCandidateParty, updateCandidateLocation, PARTIES } from '../../../actions/candidates';
import PartyPicker from '../../../components/party-picker';

class CandidatesOptions extends Component {
  static propTypes = {
    Candidates: PropTypes.object,
    Templates: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.changeCandidateParty = this.changeCandidateParty.bind(this);

  }

  changeCandidateName(i) {
    return (e) => {
      this.props.actions.updateCandidateName(e.target.value, i);
    }
  }

  changeCandidateParty(i) {
    return (party) => (
      (e) => (
        this.props.actions.updateCandidateParty(party, i)
      )
    )
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
        <PartyPicker
          partyOptions={PARTIES}
          currentParty={candidate.party}
          onPartyPick={this.changeCandidateParty(index)}
          />


        <div className='option-container-title'>Location</div>
        <input type='text' value={candidate.location} onChange={this.changeCandidateLocation(index)}/>
      </div>
    )
  }

  render() {
    const { activeTemplateType } = this.props.Templates;
    const { candidates } = this.props.Candidates;

    return (
      <div className='option-container'>
        <div className='option-title'>Candidate(s)</div>
        {candidates.map((c, i) => (this.renderCandidate(c, i)))}

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
