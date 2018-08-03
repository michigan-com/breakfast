'use strict';

import { DEFAULT_STATE, UPDATE_CANDIDATE_NAME, UPDATE_CANDIDATE_PARTY, UPDATE_CANDIDATE_LOCATION } from '../../actions/candidates';

export default function candidates(state = DEFAULT_STATE, action) {
  const  { candidates } = state;
  if (!action.value) return state;

  const { index , value } = action.value;
  const newCandidates = [ ...candidates ];

  if (index < 0 || index >= candidates.length) return state;

  switch (action.type) {
    case UPDATE_CANDIDATE_NAME:
      newCandidates[index].name = value;
      return { candidates: [ ...newCandidates ] }
    case UPDATE_CANDIDATE_PARTY:
      newCandidates[index].party = value;
      return { candidates: [ ...newCandidates ] }
    case UPDATE_CANDIDATE_LOCATION:
      newCandidates[index].location = value;
      return { candidates: [ ...newCandidates ] }
  }
  return { ...state };
}
