'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';

import { uploadImage, removeImage } from '../../../actions/uploads';

class UploadImages extends React.Component {

  fileToImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.addEventListener('load', () => {
        this.props.actions.uploadImage(img);
      });
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  handleFileUpload = (files) => {
    for (const file of files) {
      this.fileToImage(file);
    }
  }

  removeImage(imageIndex) {
    return (e) => {
      this.props.actions.removeImage(imageIndex);
    };
  }

  render() {
    const { images } = this.props.Uploads;
    const dropzoneStyle = {
      width: '90%',
      margin: '0 auto',
      height: '100px',
      border: '2px dashed black',
    };
    return (
      <div className="upload-container">
        <div className="option-container">
          <div className="option-container-title">Upload</div>
          <div className="file-upload">
            <Dropzone
              onDropAccepted={this.handleFileUpload}
              multiple
              accept="image/*"
              style={dropzoneStyle}
            >
              <p>DRAG & DROP</p>
              <p>your file or click to browse</p>
            </Dropzone>
          </div>
        </div>

        <div className="option-container">
          <div className="upload-gallery">
            {
              images.map((image, index) => {
                return (
                  <div className="image-container" key={`uploaded-image-${index}`}>
                    <div className="remove-upload" onClick={this.removeImage(index)}><i className="fa fa-times"></i></div>
                    <img src={image.img.src} />
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Uploads } = state;
  return { Uploads };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      uploadImage,
      removeImage,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadImages);
