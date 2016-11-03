
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getPresentState } from '../selectors/present';

class UserGeneratedImage extends Component {
  static propTypes = {
    url: PropTypes.string,
    photoName: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      photoLoaded: false,
    };
  }

  componentDidMount() {
    this.loadImage();
  }

  loadImage() {
    const { url } = this.props;
    const i = new Image();
    i.onload = () => { this.setState({ photoLoaded: true }); };
    i.src = url;
  }

  render() {
    const { url, photoName } = this.props;
    const src = this.state.photoLoaded ? url : '/img/background.svg';

    let download = null;
    if (this.state.photoLoaded) {
      download = <a className="download" download={photoName} href={url}>Download</a>;
    }
    return (
      <div className="image-container">
        <img src={src} alt={`${photoName}`} />
        {download}
      </div>
    );
  }

}

function Profile({ user, userPhotos, orgPhotoCount }) {
  if (user === null) {
    return (
      <div className="profile-container">
        <h3>Loading info...</h3>
      </div>
    );
  }

  const blurbs = [`You've produced ${userPhotos.length} photos`];
  if (orgPhotoCount) {
    const orgPercent = Math.round((userPhotos.length / orgPhotoCount) * 100);
    blurbs.push(`You've contributed ${orgPercent}% of your publications photos created by Breakfast`);
  }
  return (
    <div className="profile-container">
      <div className="user-info-container">
        <Link className="back-button-container" to="/breakfast/">
          <i className="fa fa-chevron-left"></i>Back to Photo Editor
        </Link>
        <h2>{`Hey, ${user.email}!`}</h2>
        {blurbs.map((blurb, i) => (
          <p key={`blurb-${i}`}>{blurb}</p>
        ))}
      </div>
      <div className="user-photos-container">
        {userPhotos.map((photo, i) => (
          <UserGeneratedImage
            url={`https://michigan-breakfast.s3.amazonaws.com/${photo.photo}`}
            photoName={photo.photo}
            key={`image-${i}`}
          />
        ))}
      </div>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.object,
  userPhotos: PropTypes.array,
  orgPhotoCount: PropTypes.number,
  actions: PropTypes.object,
};

Profile.defaultProps = {
  user: { email: '' },
  userPhotos: [],
  orgPhotoCount: 0,
};

function mapStateToProps(state) {
  return { ...getPresentState(state).User };
}


export default connect(mapStateToProps)(Profile);
