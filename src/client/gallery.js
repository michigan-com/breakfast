'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Masonry from 'react-masonry-component';

import xr from 'xr';

class Gallery extends React.Component {
  static defaultProps = { photos: [] }

  componentDidMount() {
    fetchPhotos();
  }

  renderPhoto(photo, index) {
    return (
      <div className='gallery-photo' key={ `gallery-photo-${index}` }>
        <img src={ photo.url }/>
      </div>
    )
  }

  render() {
    if (!this.props.photos.length) {
      return (
        <div className='no-photos'>
          Cookin' up some images...
        </div>
      )
    }

    return (
      <div className='photos-container'>
        <Masonry className='masonry'>
          { this.props.photos.slice(0, 20).map(this.renderPhoto) }
        </Masonry>
      </div>
    )
  }
}

function fetchPhotos(){
  xr.get('/get-all-images/')
    .then((resp) => {
      ReactDOM.render(
        <Gallery photos={ resp.photos }/>,
        document.getElementById('gallery')
      )
    }, (err) => {
      ReactDOM.render(
        <div>Oops! Something went wrong</div>,
        document.getElementById('gallery')
      )
    });
}

ReactDOM.render(
  <Gallery/>,
  document.getElementById('gallery')
)
