'use strict';

export const UPDATE_CANDIDATE_NAME = 'UPDATE_CANDIDATE_NAME';
export const UPDATE_CANDIDATE_PARTY = 'UPDATE_CANDIDATE_PARTY';
export const UPDATE_CANDIDATE_LOCATION = 'UPDATE_CANDIDATE_LOCATION';

const PARTY = {
  name: '',
  abbr: '',
  color: '',
}

export const DEMOCRATIC_PARTY = {
  ...PARTY,
  name: 'Democrat',
  abbr: 'D',
  color: '#1665CF'
};

export const REPUBLICAN_PARTY = {
  ...PARTY,
  name: 'Republican',
  abbr: 'R',
  color: '#CD2D37'
};

export const INDEPENDENT = {
  ...PARTY,
  name: 'Independent',
  abbr: 'I',
  color: '#BA32A3'
}

export const PARTIES = [
  DEMOCRATIC_PARTY,
  REPUBLICAN_PARTY,
  INDEPENDENT,
]

const CANDIDATE = {
  name: '',
  party: { ...PARTY },
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

export function updateCandidateParty(party = { ...PARTY }, index = -1) {
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
    { ...CANDIDATE, name: 'Barack Obama', party: DEMOCRATIC_PARTY, location: 'Illinois' },
    { ...CANDIDATE, name: 'Abraham Lincoln', party: REPUBLICAN_PARTY, location: 'Illinois' }
  ],
}
