'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Masonry from 'react-masonry-component';

import xr from 'xr';

class Gallery extends React.Component {
  static defaultProps = { photos: [] }
  static numToLoad = 1;

  constructor(props) {
    super(props);

    this.state = {
      layoutComplete: false,
      doneLoading: false,
      numLoaded: 0,
      numToLoad: 0,
      totalPhotos: this.props.photos.length,
    };
  }

  componentDidMount() {
    this.loadImages();
    this.refs.masonry.masonry.on('layoutComplete', this.layoutComplete.bind(this));
  }

  layoutComplete = (items) => {
    this.state.numLoaded = items.length;
    this.loadImages();
  }

  loadImages = () => {
    const numRemaining = this.state.totalPhotos - this.state.numLoaded;
    if (numRemaining === 0) return;

    const numToLoad = numRemaining > Gallery.numToLoad ? Gallery.numToLoad : numRemaining;

    const index = this.state.numLoaded;
    const photoToLoad = this.props.photos[index];
    const image = new Image();
    image.onload = () => {
      this.setState({ numToLoad });
    };
    image.src = photoToLoad.url;
  }

  renderPhoto = (photo, index) => {
    const photoClass = 'gallery-photo';

    const url = photo.url;
    return (
      <div className={photoClass} key={`gallery-photo-${index}`}>
        <img src={url} alt={`${url}`} />
      </div>
    );
  }

  render() {
    let photoContainerClass = 'photos-container';
    let masonryClass = 'masonry';
    if (this.state.numLoaded < this.state.totalPhotos) masonryClass += ' loading';
    const photos = this.props.photos.slice(0, this.state.numLoaded + this.state.numToLoad);

    let masonryOptions = {
      itemSelector: '.gallery-photo',
    };

    return (
      <div className={photoContainerClass}>
        <Masonry
          className={masonryClass}
          options={masonryOptions}
          ref="masonry"
        >
            {photos.map(this.renderPhoto)}
        </Masonry>
      </div>
    );
  }
}

Gallery.propTypes = {
  photos: React.PropTypes.array,
};

function fetchPhotos() {
  xr.get('/get-all-images/')
    .then((resp) => {
      let photos = resp.photos;

      photos = photos.sort(() => (Math.random() - Math.random()));

      ReactDOM.render(
        <Gallery photos={photos.slice(0, 30)} key={'gallery-loaded'} />,
        document.getElementById('gallery')
      );
    }, () => {
      ReactDOM.render(
        <div>Oops! Something went wrong</div>,
        document.getElementById('gallery')
      );
    });
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Gallery />,
    document.getElementById('gallery')
  );

  fetchPhotos();
});
