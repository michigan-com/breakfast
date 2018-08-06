'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { doneDownloading } from '../../breakfast/actions/downloading';
import { getPresentState } from '../../breakfast/selectors/present';
import { getImageMetrics } from '../selectors/templates';
import { TEMPLATE_TYPE_SINGLE, TEMPLATE_TYPE_VERSUS, TEMPLATE_TYPE_LIST } from '../actions/templates';
import { ElectionsTemplate } from '../components/templates';

const MAX_CANVAS_SIZE = 2097152;

class EditingCanvas extends Component {
  static propTypes = {
    Templates: PropTypes.object,
    Logo: PropTypes.object,
    imageMetrics: PropTypes.object,
    Downloading: PropTypes.object,
    Candidates: PropTypes.object,
    Uploads: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.markupContainer = null;
    this.electionsTemplate = null;

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

    var svg = this.electionsTemplate.getSVG();

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

    function inlineFonts (styleEl) {
      var urls = styleEl.innerHTML.match(/(\/fonts\/)(.+)(.ttf)/g)
      if (!urls) return;
      return Promise.all(urls.map(toDataURL)).then(data => {
        data.forEach((base64, i) => {
          styleEl.innerHTML = styleEl.innerHTML.replace(urls[i], base64)
        })
      })
    }

    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var img = new window.Image()
    var imagesToLoad = svg.querySelectorAll('image')
    canvas.width = svg.getAttribute('width')
    canvas.height = svg.getAttribute('height')
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
      img.src = svgToUrl(svg)
    } else {
      Promise.all(Array.from(imagesToLoad).map(el => el.getAttribute('xlink:href'))
        .map(toDataURL)
      ).then(data => {
        imagesToLoad.forEach((el, i) => {
          el.setAttribute('xlink:href', data[i])
        })
        return inlineFonts(svg.querySelector('#svg-styles'))
      }).then(() => img.setAttribute('src', svgToUrl(svg)))
    }
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

    return (
      <div className='elections-template-container'>
        <ElectionsTemplate
          logo={logo}
          text={text}
          candidates={candidates}
          imageMetrics={this.props.imageMetrics}
          templateName={variation.templateName}
          uploads={this.props.Uploads}
          ref={(e) => { if (e) this.electionsTemplate = e; }}
          />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { Templates, Logo, Downloading, Candidates, Uploads } = getPresentState(state);
  const imageMetrics = getImageMetrics(state);
  return { Templates, Logo, imageMetrics, Downloading, Candidates, Uploads};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      doneDownloading,
    }, dispatch),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(EditingCanvas);
