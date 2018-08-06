'use strict';

export const UPDATE_CANDIDATE_NAME = 'UPDATE_CANDIDATE_NAME';
export const UPDATE_CANDIDATE_PARTY = 'UPDATE_CANDIDATE_PARTY';
export const UPDATE_CANDIDATE_LOCATION = 'UPDATE_CANDIDATE_LOCATION';

export const CANIDATE_PARTY_D = 'DEMOCRAT';
export const CANIDATE_PARTY_R = 'REPUBLICAN';

const CANDIDATE = {
  name: '',
  party: '',
  location: '',
}

export function updateCandidateName(name = '', index=-1) {
  if (index < -1) return { type: 'noop' };

  return {
    type: UPDATE_CANDIDATE_NAME,
    value: {
      index,
      value: name,
    }
  }
}

export function updateCandidateParty(party = '', index = -1) {
  if (index < -1) return { type: 'noop' };

  return {
    type: UPDATE_CANDIDATE_PARTY,
    value: {
      index,
      value: party,
    }
  }
}

export function updateCandidateLocation(location = '', index = -1) {
  if (index < -1) return { type: 'noop' };

  return {
    type: UPDATE_CANDIDATE_LOCATION,
    value: {
      index,
      value: location,
    }
  }
}

export const DEFAULT_STATE = {
  candidates: [
    { ...CANDIDATE, name: 'Abraham Lincoln', party: 'R', location: 'Illinois' },
    { ...CANDIDATE, name: 'Barack Obama', party: 'D', location: 'Illinois' }
  ],
}
