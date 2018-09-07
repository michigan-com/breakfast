
function isNeutral(candidate) {
  return candidate.party.abbr === 'neutral';
}

export function getCandidateText(candidate) {
  var neutral = isNeutral(candidate);
  var candidateInfo = `${neutral ? '' : candidate.party.abbr}`
  if (candidate.location)  {
    candidateInfo += neutral ? candidate.location : `-${candidate.location}`;
  }
  return candidateInfo
}
