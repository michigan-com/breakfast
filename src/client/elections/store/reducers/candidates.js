'use strict';

import { DEFAULT_STATE, UPDATE_CANDIDATE_NAME, UPDATE_CANDIDATE_PARTY,
  UPDATE_CANDIDATE_LOCATION, UPDATE_CANDIDATE_IMAGE, UPDATE_CANDIDATE_IMAGE_PROPS,
  SWAP_CANDIDATES, UPDATE_CANDIDATE_TWITTER_HANDLE } from '../../actions/candidates';

export default function candidates(state = DEFAULT_STATE, action) {
  const  { candidates } = state;
  if (!action.value) return state;

  const { index , value } = action.value;
  const newCandidates = [ ...candidates ];
  const tempFirstCandidate = candidates[0];

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
    case UPDATE_CANDIDATE_IMAGE:
      newCandidates[index].photo = { ...value };
      return { candidates: [ ...newCandidates ] }
    case UPDATE_CANDIDATE_IMAGE_PROPS:
      newCandidates[index].photo.props = { ...value };
      return { candidates: [ ...newCandidates ] };
    case UPDATE_CANDIDATE_TWITTER_HANDLE:
      newCandidates[index].twitterHandle = value;
      return { candidates: [ ...newCandidates ] };
    case SWAP_CANDIDATES:
      newCandidates[0] = newCandidates[1];
      newCandidates[1] = tempFirstCandidate
      return { candidates: [ ...newCandidates ] };


  }
  return { ...state };
}
