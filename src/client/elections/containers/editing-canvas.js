'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { doneDownloading } from '../../breakfast/actions/downloading';
import { getPresentState } from '../../breakfast/selectors/present';
import { getImageMetrics } from '../selectors/templates';
import { TEMPLATE_TYPE_SINGLE, TEMPLATE_TYPE_VERSUS, TEMPLATE_TYPE_LIST } from '../actions/templates';
import { getLinesOfText } from './helpers/svg-text-line';

const MAX_CANVAS_SIZE = 2097152;

class EditingCanvas extends Component {
  static propTypes = {
    Templates: PropTypes.object,
    Logo: PropTypes.object,
    imageMetrics: PropTypes.object,
    Downloading: PropTypes.object,
    Candidates: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.markupContainer = null;
    this.svg = null;

    this.singleTextBlock = null;

    this.state = {
      downloading: false,
    }
  }

  _renderTemplateMarkup() {
    if (!this.markupContainer) return;

    const { activeTemplateType, templates } = this.props.Templates;
    if (!(activeTemplateType in templates)) return;

    const { activeVariationIndex, variations } = templates[activeTemplateType];

    if (activeVariationIndex < 0 || activeVariationIndex >= variations.length) {
      return;
    }

    this.markupContainer.innerHTML = variations[activeVariationIndex].markup
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

  renderText(text, templateType) {
    const { width, fontSize, lineHeight, height } = this.props.imageMetrics
    switch (templateType) {
      case TEMPLATE_TYPE_SINGLE:
        var lines = getLinesOfText(text[0], fontSize, lineHeight, width);
        var bottom = height * 0.8;
        var left = width * 0.05;
        var top = bottom - (lines.length * lineHeight * fontSize);

        return (
          <g>
            <rect className='text-container' x={ left / 2 } y={top - (fontSize * 1.5)} width={width * 0.95} height={(lines.length + 1.25) * fontSize } fill='white'></rect>
            <text x={left} y={top} width={width} className='text-block'>
              {lines.map((line, index) => (
                <tspan
                  x={left}
                  y={top + (index * fontSize * lineHeight)}
                  ref={(t) => {

                  }}
                  >{line}</tspan>
              ))}
            </text>
          </g>
        )

      default:
        return null;
    }
  }

  renderCandidates() {
    return null;
  }

  render() {
    const { activeTemplateType, templates } = this.props.Templates;
    const { width, height } = this.props.imageMetrics;
    const { candidates } = this.props.Candidates;
    if (!(activeTemplateType in templates)) return null;

    const { activeVariationIndex, text, variations } = templates[activeTemplateType]

    if (activeVariationIndex < 0 || activeVariationIndex >= variations.length) {
      return null;
    }

    const { logo } = this.props.Logo;
    const variation = variations[activeVariationIndex];

    const logoContainerHeight = 50;
    var logoWidth = width * 0.35;
    var logoHeight = logoWidth / logo.aspectRatio;
    var electionsLogoHeight =  logoContainerHeight * 0.3;

    if (logoHeight > (logoContainerHeight * 0.8)) {
      logoHeight = logoContainerHeight * 0.6;
      logoWidth = logoHeight * logo.aspectRatio;
    }

    return (
      <div className='elections-template-container'>
        <svg xmlns="http://www.w3.org/2000/svg" height={height} width={ width} ref={(s) => { this.svg = s;}}>
          <span className='markup-container' ref={ (c) => { this.markupContainer = c; this._renderTemplateMarkup() }}></span>
          <style>
            { `.logo-container {
              fill: white;
            }
            svg {
              background: rgb(56, 56, 56);
            }`}
          </style>
          { this.renderText(text, activeTemplateType) }
          { this.renderCandidates()}
          <rect x='0' y={height - logoContainerHeight} height={logoContainerHeight} width={width} className='logo-container'></rect>
          <image xlinkHref='/img/elections-logo.svg' height={electionsLogoHeight} y={height - electionsLogoHeight - ((logoContainerHeight - electionsLogoHeight) / 2)} x={width * 0.05}></image>
          <image xlinkHref={logo.imgObj ? logo.imgObj.src : ''} height={logoHeight} width={logoWidth} y={height - logoHeight - ((logoContainerHeight - logoHeight) / 2)} x={width - logoWidth - (width * 0.05)}></image>
        </svg>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { Templates, Logo, Downloading, Candidates } = getPresentState(state);
  const imageMetrics = getImageMetrics(state);
  return { Templates, Logo, imageMetrics, Downloading, Candidates };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      doneDownloading,
    }, dispatch),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(EditingCanvas);
