'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactCanvas from 'react-canvas';

import { clone } from '../../lib/parse';
import { SIXTEEN_NINE, TWO_ONE, FIT_IMAGE, FACEBOOK, FACEBOOK_COVER, BACKGROUND_LOADING,
  BACKGROUND_IMAGE, BACKGROUND_COLOR } from '../../lib/constants';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var FontFace = ReactCanvas.FontFace;
var measureText = ReactCanvas.measureText;
var Layer = ReactCanvas.Layer;

export default class Canvas extends React.Component {

  constructor(args) {
    super(args);

    // TODO push this into store?
    // window.onresize = () => {
    //   this.setState({ windowChange: true});
    // }

    this.state = {
      backgroundType: this.props.options.backgroundType
    }
  }

  componentWillReceiveProps(nextProps) {
    let newState = {
      backgroundType: nextProps.options.backgroundType
    };

    this.setState(newState);
  }

  getCanvasStyle() {
    let options = this.props.options;
    let windowWidth = window.innerWidth;
    let cutoff = 1200; // The cutoff at which we begin calculating the width
    let canvasWidth = options.canvas.canvasWidth;
    let canvasHeight = canvasWidth * this.props.options.aspectRatioValue;

    return {
      width: canvasWidth,
      height: canvasHeight,
      textWidth: options.canvas.textWidth,
    }
  }

  getAttributionStyle() {
    let options = this.props.options;
    let attribution = options.backgroundImg.attribution;
    let canvasStyle = this.getCanvasStyle();

    let fontFace = FontFace(options.fontFace, '', {});
    let fontSize = canvasStyle.height / 25; // lets try this
    let lineHeight = fontSize;
    let textWidth = canvasStyle.width;

    let textMetrics = measureText(attribution, textWidth, fontFace, fontSize, lineHeight);

    let color = options.fontColor;
    let height = fontSize;
    let width = textMetrics.width;
    let zIndex = 1000;

    let top = 0;
    let left = 0;
    let padding = options.canvas.canvasPadding;
    switch (/^bottom/.test(options.backgroundImg.attributionLocation)) {
      case false:
        top = padding;
        break;
      case true:
        top = canvasStyle.height - (height) - (padding);
        break;
    }
    switch (/left$/.test(options.backgroundImg.attributionLocation)) {
      case true:
        left = padding;
        break;
      case false:
        left = canvasStyle.width - padding - width;
        break;
    }

    return { top, left, fontFace, fontSize, lineHeight, height, width, color, zIndex }
  }

  getCanvasNode() {
    return ReactDOM.findDOMNode(this.refs.canvas);
  }

  getTextGroupStyle() {
    let style = {
      zIndex: 10
    }

    return style;
  }

  getBackgroundStyle() {
    let canvasStyle = this.getCanvasStyle();

    let style = {
      zIndex: 1,
      top: 0,
      left: 0,
      width: canvasStyle.width,
      height: canvasStyle.height
    }

    if (this.props.options.backgroundType === BACKGROUND_COLOR) {
      style.backgroundColor = this.props.options.backgroundColor;
    } else if (this.props.options.backgroundType === BACKGROUND_IMAGE) {
      style.backgroundColor = '#000000';
    }
    return style;
  }

  getLogoStyle() {
    let aspectRatio = this.props.options.logo.aspectRatio ? this.props.options.logo.aspectRatio : 1;
    let canvasStyle = this.getCanvasStyle();
    let width;
    let height;
    let zIndex = 1000;

    if (aspectRatio > 2.0) {
      // The logo is wider than it is tall
      width = canvasStyle.width / 4;
      height = width / aspectRatio;
    } else if (Math.abs(aspectRatio - 1.0) <= 0.1) {
      // The logo is roughly square
      height = canvasStyle.height / 6;
      width = height * aspectRatio;
    } else if (aspectRatio <= 2.0) {
      height = canvasStyle.height / 8;
      width = height * aspectRatio;
    }

    let top = 0;
    let left = 0;
    let padding = this.props.options.canvas.canvasPadding;
    switch (/^bottom/.test(this.props.options.logoLocation)) {
      case false:
        top = padding;
        break;
      case true:
        top = canvasStyle.height - (height) - (padding);
        break;
    }
    switch (/left$/.test(this.props.options.logoLocation)) {
      case true:
        left = padding;
        break;
      case false:
        left = canvasStyle.width - padding - width;
        break;
    }


    return { height, width, top, left, zIndex }
  }

  renderBackground() {
    let type = this.props.options.backgroundType;
    let backgroundObj;
    let backgroundStyle = this.getBackgroundStyle();
    let layerStyle = {
      zIndex: backgroundStyle.zIndex
    }

    if (type === BACKGROUND_COLOR) {
      backgroundObj = (
        <Layer style={ this.getBackgroundStyle() }></Layer>

      )
    } else if (type === BACKGROUND_IMAGE) {
      let options = {
        backgroundColor: '#ffffff',
        focusPoint: {
          x: 0,
          y: 0
        }
      };
      backgroundObj = (
        <Image style={ backgroundStyle } src={ this.props.options.backgroundImg.src } options={ options }/>
      )
    }

    return backgroundObj;
  }

  renderAttribution() {
    let options = this.props.options;
    if (options.backgroundType !== BACKGROUND_IMAGE) return null;

    let style = this.getAttributionStyle();
    return (
      <Text style={ style } key='photo-attribute'>{ options.backgroundImg.attribution }</Text>
    )
  }

  renderLogo() {
    let options = this.props.options;
    let logo = options.logo;
    let logoColor = this.props.options.logoColor.replace('#', '');
    if (!logo.filename) {
      return;
    }

    let style = this.getLogoStyle();
    let logoUrl = `${window.location.origin}/logos/${logo.filename}`;
    let badLogoCheck = /-dark|-light/;
    if (!badLogoCheck.exec(logo.filename) && logoColor != '000') {
      let color = options.logoColor.replace('#', '');
      logoUrl += `?color=${color}`;
    }
    return (
       <Image src={ logoUrl } style={ style } key={ logoUrl }/>
    )
  }

  /**
   * Extend this function in order to render more elements in the canvas
   */
  renderContent() {
    if (!this.props.textContent || !this.props.textContent.length) return null;

    return (
      <Group style={ this.getTextGroupStyle() }>
        { this.props.textContent }
      </Group>
    )
  }

  render() {
    let canvasStyle = this.getCanvasStyle();

    return (
      <Surface className='quote'
          width={ canvasStyle.width }
          height={ canvasStyle.height }
          left={0}
          top={0}
          ref='canvas'>
        { this.renderBackground() }
        { this.renderContent() }
        { this.renderLogo() }
        { this.renderAttribution() }
      </Surface>
    )
  }
}
