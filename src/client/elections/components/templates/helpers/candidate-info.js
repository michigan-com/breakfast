
function hidePartyAbbr(candidate) {
  return candidate.party.abbr === 'neutral' || candidate.party.abbr.toLowerCase() === 'o';
}

export function getCandidateText(candidate) {
  var neutral = hidePartyAbbr(candidate);
  var candidateInfo = `${neutral ? '' : candidate.party.abbr}`
  if (candidate.location)  {
    candidateInfo += neutral ? candidate.location : `-${candidate.location}`;
  }
  return candidateInfo
}
