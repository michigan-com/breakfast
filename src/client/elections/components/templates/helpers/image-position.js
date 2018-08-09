
/**
We position the image via a <input type='range' />, so we want to take that range
and map it to `peserveAspectRatio`

more data here: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
*/
export function imagePositionToAspectRatio(imagePosition = 1, imageAspectRatio = 1, containerAspectRatio = 1) {
  if (imageAspectRatio === containerAspectRatio) {
    return 'xMidYMix slice';
  }
  else if (imageAspectRatio > containerAspectRatio) {
    // If our image is wider than the container
    switch (imagePosition) {
      case '0':
        return 'xMinYMin slice';
      case '1':
      default:
        return 'xMidYMin slice';
      case '2':
        return 'xMaxYMin slice';
    }
  } else {
    // image is taller than the container
    switch (imagePosition) {
      case '0':
        return 'xMinYMin slice';
      case '1':
      default:
        return 'xMinYMid slice';
      case '2':
        return 'xMinYMax slice';
    }
  }


}
