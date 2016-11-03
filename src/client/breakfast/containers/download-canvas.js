'use strict';

import React, { PropTypes, Component } from 'react';
import xr from 'xr';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Canvas from './canvas';
import { userDataLoaded } from '../actions/user';

const MAX_CANVAS_SIZE = 2097152;

/**
 * Used to draw the canvas then download it
 */
class DownloadCanvas extends Component {
  static propTypes = {
    fileName: PropTypes.string.isRequired,
    downloadCallback: PropTypes.func,
    actions: PropTypes.object,
  };

  static defaultProps = {
    downloadCallback: () => {},
  };

  componentDidMount() {
    // TODO
    const canvas = this.refs.canvas.refs.wrappedInstance.getCanvasNode();
    let dataUri = canvas.toDataURL();
    let fileExtension = 'png';

    if (dataUri.length > MAX_CANVAS_SIZE) {
      const scaleDown = MAX_CANVAS_SIZE / dataUri.length;
      dataUri = canvas.toDataURL('image/jpeg', scaleDown);
      fileExtension = 'jpg';
    }

    const downloadImage = () => {
      const a = document.createElement('a');
      a.setAttribute('href', dataUri);
      a.setAttribute('download', `${this.props.fileName}.${fileExtension}`); // todo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (this.props.downloadCallback) this.props.downloadCallback();

      xr.get('/profile/data/')
        .then((data) => {
          this.props.actions.userDataLoaded(data);
        });
    };

    // even if we fail to save to s3, let them download the image
    xr.put('/save-image/', { imageData: dataUri })
      .then(downloadImage, downloadImage);
  }

  render() {
    return (
      <Canvas renderText ref="canvas" />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      userDataLoaded,
    }, dispatch),
  };
}

export default connect(() => ({}), mapDispatchToProps)(DownloadCanvas);
