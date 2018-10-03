
function shouldHidePartyAbbr(candidate) {
  return candidate.party.abbr === 'hidePartyAbbr' || candidate.party.abbr.toLowerCase() === 'o';
}

export function getCandidateText(candidate) {
  var hidePartyAbbr = shouldHidePartyAbbr(candidate);
  var candidateInfo = `${hidePartyAbbr ? '' : candidate.party.abbr}`
  if (candidate.location)  {
    candidateInfo += hidePartyAbbr ? candidate.location : `-${candidate.location}`;
  }
  return candidateInfo
}
