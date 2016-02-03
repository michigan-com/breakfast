'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactCanvas from 'react-canvas';

import Store from '../../store';
import { BACKGROUND_COLOR, BACKGROUND_IMAGE } from '../../actions/background';
import { logoAspectRatioFound } from '../../actions/logo';

var Surface = ReactCanvas.Surface;
var CanvasImage = ReactCanvas.Image;
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
      backgroundType: this.props.options.Background.backgroundType
    }
  }

  componentWillReceiveProps(nextProps) {
    let newState = {
      backgroundType: nextProps.options.Background.backgroundType
    };

    this.setState(newState);
  }

  getCanvasStyle() {
    let canvas = this.props.options.AspectRatio.canvas;
    let windowWidth = window.innerWidth;
    let cutoff = 1200; // The cutoff at which we begin calculating the width
    let canvasWidth = canvas.canvasWidth;
    let canvasHeight = canvasWidth * this.props.options.AspectRatio.aspectRatioValue;

    return {
      width: canvasWidth,
      height: canvasHeight,
      maxTextWidth: canvas.maxTextWidth,
    }
  }

  getAttributionStyle() {
    let options = this.props.options;
    let canvas = options.AspectRatio.canvas;
    let attribution = options.Attribution.attribution;
    let canvasStyle = this.getCanvasStyle();

    let fontFace = FontFace(options.Font.fontFace, '', {});
    let fontSize = canvasStyle.height / 25; // lets try this
    let lineHeight = fontSize;
    let textWidth = canvasStyle.width;

    let textMetrics = measureText(attribution, textWidth, fontFace, fontSize, lineHeight);

    let color = options.Attribution.attributionColor;
    let height = fontSize;
    let width = textMetrics.width;
    let zIndex = 1000;

    let top = 0;
    let left = 0;
    let padding = canvas.canvasPadding;
    switch (/^bottom/.test(options.Attribution.attributionLocation)) {
      case false:
        top = padding;
        break;
      case true:
        top = canvasStyle.height - (height) - (padding);
        break;
    }
    switch (/left$/.test(options.Attribution.attributionLocation)) {
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

    if (this.props.options.Background.backgroundType === BACKGROUND_COLOR) {
      style.backgroundColor = this.props.options.Background.backgroundColor;
    } else if (this.props.options.Background.backgroundType === BACKGROUND_IMAGE) {
      style.backgroundColor = '#000000';
    }
    return style;
  }

  getLogoStyle() {
    let options = this.props.options;
    let logoIndex = options.Logo.logoIndex;
    if (logoIndex === null || logoIndex > options.Logo.logoOptions.length || logoIndex < 0) return {};

    let logo = options.Logo.logoOptions[logoIndex];
    let aspectRatio = logo.aspectRatio ? logo.aspectRatio : 1;
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
    let padding = options.AspectRatio.canvas.canvasPadding;
    switch (/^bottom/.test(options.Logo.logoLocation)) {
      case false:
        top = padding;
        break;
      case true:
        top = canvasStyle.height - (height) - (padding);
        break;
    }
    switch (/left$/.test(options.Logo.logoLocation)) {
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
    let type = this.props.options.Background.backgroundType;
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
        <CanvasImage style={ backgroundStyle } src={ this.props.options.Background.backgroundImg.src } options={ options }/>
      )
    }

    return backgroundObj;
  }

  renderAttribution() {
    let options = this.props.options;
    if (options.Background.backgroundType !== BACKGROUND_IMAGE) return null;

    let style = this.getAttributionStyle();
    return (
      <Text style={ style } key='photo-attribute'>{ options.Attribution.attribution }</Text>
    )
  }

  renderLogo() {
    let options = this.props.options;
    let logoIndex = options.Logo.logoIndex;
    if (logoIndex === null || logoIndex > options.Logo.logoOptions) return null;

    let logo = options.Logo.logoOptions[logoIndex];
    let logoColor = this.props.options.Logo.logoColor.replace('#', '');
    if (!logo.filename) {
      return null;
    } else if (!logo.aspectRatio) {

      // This is a .png, we need to find the aspect ratio of this thing before we can use it
      let filename = logo.filename;
      let i = new Image();
      i.onload = ((index) => {
        return () => {
          let aspectRatio = i.width / i.height;
          Store.dispatch(logoAspectRatioFound(index, aspectRatio));
        }
      })(logoIndex)
      i.src = `${window.location.origin}/logos/${filename}`;

      return null;
    }

    let style = this.getLogoStyle();
    let logoUrl = `${window.location.origin}/logos/${logo.filename}`;
    let goodLogoCheck = /\.svg$/;
    if (goodLogoCheck.test(logo.filename) && !logo.noColor) {
      let color = options.Logo.logoColor.replace('#', '');
      logoUrl += `?color=${color}`;
    }
    return (
       <CanvasImage src={ logoUrl } style={ style } key={ logoUrl }/>
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
