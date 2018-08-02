'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { doneDownloading } from '../../breakfast/actions/downloading';
import { getPresentState } from '../../breakfast/selectors/present';
import { getImageMetrics } from '../selectors/templates';
import { TEMPLATE_TYPE_SINGLE, TEMPLATE_TYPE_DOUBLE, TEMPLATE_TYPE_LIST } from '../actions/templates';

const MAX_CANVAS_SIZE = 2097152;

class EditingCanvas extends Component {
  static propTypes = {
    Templates: PropTypes.object,
    Logo: PropTypes.object,
    imageMetrics: PropTypes.object,
    Downloading: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.markupContainer = null;
    this.svg = null;

    this.state = {
      downloading: false,
    }
  }

  _renderTemplateMarkup() {
    if (!this.markupContainer) return;

    const { activeTemplateIndex, templates } = this.props.Templates;
    if (activeTemplateIndex < 0 || activeTemplateIndex >= templates.length) {
      return;
    }

    this.markupContainer.innerHTML = templates[activeTemplateIndex].markup
  }

  renderText(template) {
    switch (template.type) {
      case TEMPLATE_TYPE_SINGLE:
        return (
          <text x='0' y='100' className='text-block'>
            { template.candidates[0].text[0] }
          </text>
        )

      default:
        return null;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.Downloading.downloading && nextProps.Downloading.downloading && !this.state.downloading) {
      this.downloadImage();
    }
  }

  downloadImage() {
    this.setState({ downloading: true })
    const { downloading, filename } = this.props.Downloading;

    function svgToUrl (svg) {
      var svgString = new window.XMLSerializer().serializeToString(svg)
      var svgBlob = new window.Blob([svgString], {type: 'image/svg+xml;'})
      return window.URL.createObjectURL(svgBlob)
    }

    function toDataURL (url) {
      var reader = new window.FileReader()
      return window.fetch(url).then(res => res.blob()).then(blob => {
        return new Promise((resolve, reject) => {
          reader.onloadend = function () {
            resolve(reader.result)
          }
          reader.readAsDataURL(blob)
        })
      })
    }

    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var img = new window.Image()
    var imagesToLoad = this.svg.querySelectorAll('image')
    canvas.width = this.svg.getAttribute('width')
    canvas.height = this.svg.getAttribute('height')
    img.addEventListener('load', () => {

      ctx.drawImage(img, 0, 0)

      let dataUri = canvas.toDataURL();

      let fileExtension = 'png';

      if (dataUri.length > MAX_CANVAS_SIZE) {
        const scaleDown = MAX_CANVAS_SIZE / dataUri.length;
        dataUri = canvas.toDataURL('image/jpeg', scaleDown);
        fileExtension = 'jpg';
      }
      const a = document.createElement('a');
      a.setAttribute('href', dataUri);

      a.setAttribute('download', `${filename}.${fileExtension}`); // todo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.props.actions.doneDownloading();
      this.setState({ downloading: false });
    });

    if (!imagesToLoad) {
      emitter.emit('log:debug', 'no need to inline images')
      img.src = svgToUrl(this.svg)
    } else {
      Promise.all(Array.from(imagesToLoad).map(el => el.getAttribute('xlink:href'))
        .map(toDataURL)
      ).then(data => {
        imagesToLoad.forEach((el, i) => {
          el.setAttribute('xlink:href', data[i])
        })
        // return inlineFonts(this.svg.querySelector('#svg-styles'))
      }).then(() => img.setAttribute('src', svgToUrl(this.svg)))
    }
  }

  render() {
    const { activeTemplateIndex, templates } = this.props.Templates;
    const { width, height } = this.props.imageMetrics;
    if (activeTemplateIndex < 0 || activeTemplateIndex >= templates.length) {
      return null;
    }

    const { logo } = this.props.Logo;
    const template = templates[activeTemplateIndex];

    return (
      <div className='elections-template-container'>
        <svg xmlns="http://www.w3.org/2000/svg" height={height} width={ width} ref={(s) => { this.svg = s;}}>
          <span className='markup-container' ref={ (c) => { this.markupContainer = c; this._renderTemplateMarkup() }}></span>
          <style>
            { `.logo-container {
              fill: white;
            }`}
          </style>
          { this.renderText(template) }

          <rect x='0' y='180' height='20' width='200' className='logo-container'>
          </rect>
          <image xlinkHref={logo.imgObj ? logo.imgObj.src : ''} height='20' width='100' y='180' x='100'></image>
        </svg>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { Templates, Logo, Downloading } = getPresentState(state);
  const imageMetrics = getImageMetrics(state);
  return { Templates, Logo, imageMetrics, Downloading };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      doneDownloading,
    }, dispatch),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(EditingCanvas);
