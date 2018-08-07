'use strict';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';

import { TEMPLATE_TYPE_QUOTE, TEMPLATE_TYPE_VERSUS, TEMPLATE_TYPE_LIST } from '../../../actions/templates';
import { uploadImage, removeImage, activateSingleImage, deactivateSingleImage,
  activateSecondImage, deactivateSecondImage} from '../../../actions/uploads';

class UploadImages extends Component {

  static propTypes = {
    Uploads: PropTypes.object,
    Templates: PropTypes.object,
  }

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

  imageClick(imageIndex) {
    return (e) => {
      const { activeImageIndices } = this.props.Uploads
      const { activeTemplateType } = this.props.Templates;

      switch(activeTemplateType) {
        case TEMPLATE_TYPE_LIST:
        case TEMPLATE_TYPE_QUOTE:
          if (imageIndex === activeImageIndices[0]) this.props.actions.deactivateSingleImage();
          else this.props.actions.activateSingleImage(imageIndex);
          break
        case TEMPLATE_TYPE_VERSUS:
          if (imageIndex === activeImageIndices[0]) {
            this.props.actions.deactivateSingleImage();
            return;
          } else if (imageIndex === activeImageIndices[1]) {
            this.props.actions.deactivateSecondImage();
            return;
          }

          if (activeImageIndices[0] === -1) this.props.actions.activateSingleImage(imageIndex);
          else if (activeImageIndices[1] === -1) this.props.actions.activateSecondImage(imageIndex);
          else { /* TODO error message somehow */ }
          break
      }
    }
  }

  renderHelperText() {
    const { activeTemplateType } = this.props.Templates;
    var text = '';
    switch(activeTemplateType) {
      case TEMPLATE_TYPE_LIST:
      case TEMPLATE_TYPE_QUOTE:
        text = 'Pick one image for a background image (if applicable)';
        break
      case TEMPLATE_TYPE_VERSUS:
        text = 'Pick two images, one for each candidate';
        break
    }

    return (
      <div className='upload-directions'>{text}</div>
    )
  }

  render() {
    const { images } = this.props.Uploads;
    const { activeImageIndices } = this.props.Uploads;
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
          {this.renderHelperText()}
          <div className="upload-gallery">
            {
              images.map((image, index) => {
                var className = 'image-container';
                if (activeImageIndices.indexOf(index) >= 0) className += ' active';
                return (
                  <div className={className} key={`uploaded-image-${index}`} onClick={this.imageClick(index)}>
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
  const { Uploads, Templates } = state;
  return { Uploads, Templates };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      uploadImage,
      removeImage,
      activateSingleImage,
      activateSecondImage,
      deactivateSingleImage,
      deactivateSecondImage,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadImages);
