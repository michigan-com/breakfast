'use strict';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';

import { TEMPLATE_TYPE_VERSUS } from '../../../actions/templates';
import { updateCandidateName, updateCandidateParty, updateCandidateLocation,
  updateCandidateImage, removeCandidateImage, updateCandidateImageProps,
  swapCandidates, PARTIES } from '../../../actions/candidates';
import PartyPicker from '../../../components/party-picker';

class CandidatesOptions extends Component {
  static propTypes = {
    Candidates: PropTypes.object,
    Templates: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  fileToImage = (file, index) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.addEventListener('load', () => {
        this.props.actions.updateCandidateImage(img, index);
      });
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }


  changeCandidateName = (i) => {
    return (e) => {
      this.props.actions.updateCandidateName(e.target.value, i);
    }
  }

  changeCandidateParty = (i) => {
    return (party) => (
      (e) => (
        this.props.actions.updateCandidateParty(party, i)
      )
    )
  }

  changeCandidateLocation = (i) => {
    return (e) => {
      this.props.actions.updateCandidateLocation(e.target.value, i);
    }
  }

  handleFileUpload = (index) => (
    (files) => {
      this.fileToImage(files[0], index);
    }
  )

  removeImage = (index) => (
    () => {
      this.props.actions.removeCandidateImage(index);
    }
  )

  imagePositionChange = (index) => {
    return (e) => {
      var props = { imagePosition: e.target.value };
      this.props.actions.updateCandidateImageProps(props, index);
    }
  }

  swapCandidates = () => {
    this.props.actions.swapCandidates();
  }

  renderCandidate(candidate, index) {
    const dropzoneStyle = {
      width: '90%',
      margin: '0 auto',
      height: '100px',
      border: '2px dashed black',
      textAlign: 'center'
    };

    return (
      <div className='candidate option-container ' key={`editing-candidate-${index}`}>
        <div className='option-container-title'>Name</div>
        <input type='text' value={candidate.name} onChange={this.changeCandidateName(index)}/>

        <div className='option-container-title'>Party</div>
        <PartyPicker
          partyOptions={PARTIES}
          currentParty={candidate.party}
          onPartyPick={this.changeCandidateParty(index)}
          />


        <div className='option-container-title'>Location</div>
        <input type='text' value={candidate.location} onChange={this.changeCandidateLocation(index)}/>

        <div className='candiate-upload-container'>
          {
            candidate.photo.img.src
            ?
            (<div className="image-container" key={`uploaded-image-${index}`}>
              <div className="remove-upload" onClick={this.removeImage(index)}><i className="fa fa-times"></i></div>
              <img src={candidate.photo.img.src} style={{width: '90%'}}/>
              <div className='candidate-image-positioning'>
                <input type='range' min='0' max='2' value={candidate.photo.props.imagePosition} onChange={this.imagePositionChange(index)}/>
              </div>
            </div>)
            :
            (<div>
              <span>Upload image</span>
              <Dropzone
                onDropAccepted={this.handleFileUpload(index)}
                accept="image/*"
                style={dropzoneStyle}
              >
                <p>DRAG & DROP</p>
                <p>your file or click to browse</p>
              </Dropzone>
            </div>)
          }
        </div>
        {index === 0 ?
          (<div className='swap-candidates-container'>
            <div className='swap-candidates' onClick={this.swapCandidates}>
              Swap <span className='swap-arrows'>⇆</span> Candidates
            </div>
          </div>)
        : null }
      </div>
    )
  }

  render() {
    const { activeTemplateType } = this.props.Templates;
    const { candidates } = this.props.Candidates;

    return (
      <div className='option-container'>
        <div className='option-title'>Candidates</div>
        {candidates.map((c, i) => (this.renderCandidate(c, i)))}

      </div>
    )
  }
}

function mapStateToProps(state) {
  const {Candidates, Templates } = state;

  return { Candidates, Templates };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      updateCandidateName,
      updateCandidateParty,
      updateCandidateLocation,
      updateCandidateImage,
      removeCandidateImage,
      updateCandidateImageProps,
      swapCandidates,
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CandidatesOptions)
