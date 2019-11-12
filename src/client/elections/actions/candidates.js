'use strict';

export const UPDATE_CANDIDATE_NAME = 'UPDATE_CANDIDATE_NAME';
export const UPDATE_CANDIDATE_PARTY = 'UPDATE_CANDIDATE_PARTY';
export const UPDATE_CANDIDATE_LOCATION = 'UPDATE_CANDIDATE_LOCATION';
export const UPDATE_CANDIDATE_IMAGE = 'UPDATE_CANDIDATE_IMAGE';
export const UPDATE_CANDIDATE_IMAGE_PROPS = 'UPDATE_CANDIDATE_IMAGE_PROPS';
export const SWAP_CANDIDATES = 'SWAP_CANDIDATES';

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

export const GREEN_PARTY = {
  ...PARTY,
  name: 'Green',
  abbr: 'G',
  color: '#008700'
};

export const LIBERTARIAN_PARTY= {
  ...PARTY,
  name: 'Libertarian',
  abbr: 'L',
  color: '#F1751D'
};

export const OTHER = {
  ...PARTY,
  name: 'Independent',
  abbr: 'I',
  color: '#057D78'
};



export const PARTIES = [
  DEMOCRATIC_PARTY,
  REPUBLICAN_PARTY,
  GREEN_PARTY,
  LIBERTARIAN_PARTY,
  OTHER
]

const UPLOAD = {
  img: {},
  height: 0,
  width: 0,
  props: {
    imagePosition: 1, // three steps: 0, 1, 2 -> left, center, right
  },
  aspectRatio: 0.0,
};


const CANDIDATE = {
  name: '',
  party: { ...PARTY },
  location: '',
  photo: { ...UPLOAD },
}

/**
 * After reading an image file, add it to the `images` array.
 *
 * @param img {Object} - `Image` object, e.g. `img = new Image()`. Will read width and height for aspect ratio
 */
export function updateCandidateImage(img, index=-1) {
  const aspectRatio = img.width / img.height;
  const height = aspectRatio > 1 ? 0.2 : 0.4;
  const width = aspectRatio * height;

  const value = { ...UPLOAD, img, height, width, aspectRatio };
  return {
    type: UPDATE_CANDIDATE_IMAGE,
    value: {
      index,
      value
    }
  };
}

export function removeCandidateImage(index=-1) {
  return {
    type: UPDATE_CANDIDATE_IMAGE,
    value: {
      index,
      value: { ...UPLOAD }
    }
  }
}

export function updateCandidateImageProps(props={}, index=-1) {
  return {
    type: UPDATE_CANDIDATE_IMAGE_PROPS,
    value: {
      index,
      value: { ...props },
    }
  }
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

export function swapCandidates() {
  return {
    type: SWAP_CANDIDATES,
    value: {},
  }
}

export const DEFAULT_STATE = {
  candidates: [
    { ...CANDIDATE, name: 'Elizabeth Warren', party: DEMOCRATIC_PARTY, location: 'Massachusetts' },
    { ...CANDIDATE, name: 'Donald Trump', party: REPUBLICAN_PARTY, location: 'Florida' }
  ],
}
