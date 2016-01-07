'use strict';

import React from 'react';
import ReactCanvas from 'react-canvas';

import { clone } from '../../lib/parse';
import { SIXTEEN_NINE, TWO_ONE, FIT_IMAGE, FACEBOOK, FACEBOOK_COVER, BACKGROUND_LOADING,
  BACKGROUND_IMAGE, BACKGROUND_COLOR } from '../../lib/constants';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var measureText = ReactCanvas.measureText;
var Layer = ReactCanvas.Layer;

export default class Canvas extends React.Component {

  constructor(args) {
    super(args);

    window.onresize = () => {
      this.setState({ windowChange: true});
    }

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
    let canvasWidth = options.canvasWidth;

    if (windowWidth <= cutoff) {
      // 800px is the window size the media query cutoff
      if (windowWidth > 800) {
        // our SASS says that the width of the column is 2/3 of the screen
        // calculate 2/3 of the width, minus some for padding
        canvasWidth = (windowWidth * 2/3) * .8;
      } else {
        canvasWidth = windowWidth * .9;
      }
    }

    let canvasHeight = canvasWidth * this.props.options.aspectRatioValue;

    return {
      width: canvasWidth,
      height: canvasHeight,
      textWidth: options.textWidth,
    }
  }

  getCanvasNode() {
    return React.findDOMNode(this.refs.canvas);
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
    let zIndex = 10;

    if (aspectRatio > 1.5) {
      // The logo is wider than it is tall
      width = canvasStyle.width / 4;
      height = width / aspectRatio;
    } else if (aspectRatio <= 1.5) {
      height = canvasStyle.height / 8;
      width = height * aspectRatio;
    }

    let top = 0;
    let left = 0;
    let padding = this.props.options.canvasPadding;
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
      backgroundObj = (
        <Image style={ backgroundStyle } src={ this.props.options.backgroundImg.src }/>
      )
    }

    return backgroundObj;
  }

  renderLogo() {
    let logo = this.props.options.logo;
    let logoColor = this.props.options.logoColor.replace('#', '');
    if (!logo.filename) {
      return;
    }

    let style = this.getLogoStyle();
    let logoUrl = `${window.location.origin}/logos/${logo.filename}/?color=${logoColor}`;
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
      </Surface>
    )
  }
}
