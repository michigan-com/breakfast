import React from 'react';
import ReactCanvas from 'react-canvas';
import { clone } from '../lib/parse';
import { SIXTEEN_NINE, TWO_ONE, FIT_IMAGE, BACKGROUND_LOADING, BACKGROUND_IMAGE,
    BACKGROUND_COLOR } from '../lib/constants';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var measureText = ReactCanvas.measureText;
var Layer = ReactCanvas.Layer;

export default class Canvas extends React.Component {

  constructor(args) {
    super(args);

    this.canvasPadding = 20;
    this.canvasWidth = 650;
    window.onresize = function() {
      this.setState({ windowChange: true});
    }.bind(this);

    this.state = {
      backgroundPos: {
        top: 0,
        left: 0
      },

      mouseDown: false,
      lastMouseX: 0,
      lastMouseY: 0,

      backgroundType: this.props.options.backgroundType

    }
  }

  componentWillReceiveProps(nextProps) {
    let newState = {
      backgroundType: nextProps.options.backgroundType
    };

    if (nextProps.options.backgroundType === BACKGROUND_COLOR) {
      newState.backgroundPos = {
        top: 0,
        left: 0
      }
    }

    this.setState(newState);
  }

  componentWillUpdate(nextProps, nextState) {
  }

  getCanvasStyle() {
    let windowWidth = window.innerWidth;
    let cutoff = 1200; // The cutoff at which we begin calculating the width
    let canvasWidth = this.canvasWidth;

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

    let canvasHeight = canvasWidth;

    switch (this.props.options.aspectRatio) {
      case SIXTEEN_NINE:
        canvasHeight = canvasWidth * 9/16;
        break;
      case TWO_ONE:
        canvasHeight = canvasWidth * 1/2;
        break;
      case FIT_IMAGE:
        // Only deal with this aspect ratio if we've loaded an image up
        if (this.props.options.backgroundType !== BACKGROUND_IMAGE) {
          break;
        }
        let backgroundImg = this.props.options.backgroundImg;
        canvasHeight = canvasWidth  / (backgroundImg.width / backgroundImg.height);
    }

    return {
      width: canvasWidth,
      height: canvasHeight,
      textWidth: canvasWidth - 20,
    }
  }

  getCanvasNode() {
    return React.findDOMNode(this.refs.canvas);
  }

  getGroupStyle() {
    return {
      zIndex: 100
    }
  }

  getBackgroundStyle() {
    let canvasStyle = this.getCanvasStyle();

    let style = {
      zIndex: 1,
      top: this.state.backgroundPos.top,
      left: this.state.backgroundPos.left,
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

  getQuoteStyle() {
    let canvasStyle = this.getCanvasStyle();

    let textHeight = this.props.fontSize * 1.25;
    let font = ReactCanvas.FontFace(this.props.options.fontFace, '', {});
    return {
      text: {
        top: this.canvasPadding,
        left: 10,
        height: textHeight,
        lineHeight: textHeight,
        fontSize: this.props.fontSize,
        width: canvasStyle.textWidth,
        fontFace: font,
        color: this.props.options.fontColor
      },
      source: {
        top: 50 + 10,
        left: 10,
        height: textHeight,
        lineHeight: 20,
        fontSize: 15,
        width: canvasStyle.textWidth,
        color: this.props.options.fontColor
      }
    }
  }

  getListStyle() {
    let canvasStyle = this.getCanvasStyle();

    let headlineFontSize = 30;
    let headlineSize = 50;
    let font = ReactCanvas.FontFace(this.props.options.fontFace, '', {});

    let listItemSize = this.props.fontSize * 1.25;
    return {
      headline: {
        top: this.canvasPadding,
        left: this.canvasPadding,
        height: headlineSize,
        lineHeight: headlineSize,
        fontSize: headlineFontSize,
        width: canvasStyle.textWidth,
        fontFace: font,
        color: this.props.options.fontColor
      },
      listItem: {
        top: headlineSize + 10,
        left: this.canvasPadding * 2,
        height: listItemSize,
        lineHeight: listItemSize * 1.25,
        fontSize: this.props.fontSize,
        width: canvasStyle.textWidth - (this.canvasPadding * 2),
        fontFace: font,
        color: this.props.options.fontColor
      }
    }
  }

  getAttributionStyle() {
    let fontSize = 10;
    let font = ReactCanvas.FontFace(this.props.options.fontFace, '', {});
    return {
      fontSize,
      color: this.props.options.fontColor,
      fontFace: font,
      lineHeight: fontSize * 1.25
    }
  }

  getLogoStyle() {
    let aspectRatio = this.props.options.logo.aspectRatio ? this.props.options.logo.aspectRatio : 1;
    let canvasStyle = this.getCanvasStyle();
    let width;
    let height;

    if (aspectRatio > 1) {
      // The logo is wider than it is tall
      width = canvasStyle.width / 4;
      height = width / aspectRatio;
    } else if (aspectRatio <= 1) {
      height = canvasStyle.height / 8;
      width = height * aspectRatio;
    }

    return {
      height,
      width,
      top: canvasStyle.height - height,
      left: 0,
      zIndex: 100
    }
  }

  renderListItems() {
    let canvasStyle = this.getCanvasStyle();
    let listItemStyle = this.getListStyle().listItem;
    let headlineStyle = this.getListStyle().headline;
    let prevHeight = 0;
    let returnElements = [];

    // Render the headline
    let headline = this.props.canvasData.headline.toUpperCase();
    let headlineMetrics = measureText(headline, canvasStyle.width - this.canvasPadding,
          headlineStyle.fontFace, headlineStyle.fontSize, headlineStyle.lineHeight);
    prevHeight = headlineMetrics.height;
    returnElements.push(
      <Text className='headline' style={ headlineStyle }>{ headline }</Text>
    )

    // render the text input. Have to manually calculate starting point
    for (let i = 0; i < this.props.canvasData.items.length; i++) {
      let item = `• ${this.props.canvasData.items[i]}`;

      let listMetrics = measureText(item, canvasStyle.width - (this.canvasPadding * 4),
          listItemStyle.fontFace, listItemStyle.fontSize, listItemStyle.lineHeight);

      listItemStyle.height = listMetrics.height;
      listItemStyle.top += prevHeight;
      returnElements.push(
         <Text className='item' style={ clone(listItemStyle) }>{item}</Text>
      )

      prevHeight = listMetrics.height + (listItemStyle.lineHeight * .2);
    }

    return returnElements;
  }

  renderQuoteLine(item, index) {

    let style = this.getQuoteStyle().source
    style.top += style.height * index;
    return (
      <Text className='quote-text' style={ style }>{ item }</Text>
    )
  }

  renderQuote() {
    let canvasStyle = this.getCanvasStyle();
    let quoteStyle = this.getQuoteStyle();
    let quoteMetrics = measureText(this.props.canvasData.quote, canvasStyle.width - 50,
          quoteStyle.text.fontFace, quoteStyle.text.fontSize, quoteStyle.text.lineHeight);

    quoteStyle.text.height = quoteMetrics.height;
    quoteStyle.source.top = quoteStyle.text.height + quoteStyle.text.top + 20;
    return (
      <Group style={ this.getGroupStyle() }>
        <Text className='quote-text' style={ clone(quoteStyle.text) }>
          { this.props.canvasData.quote }
        </Text>
        <Text className='source' style={ clone(quoteStyle.source) }>
          { `- ${this.props.canvasData.source }` }
        </Text>
      </Group>
    )
  }

  renderList() {
    return (
      <Group style={ this.getGroupStyle() }>
        <Text className='headline'>
        </Text>
        { this.renderListItems.call(this) }
      </Group>
    )
  }

  renderPicture() {
    let canvasStyle = this.getCanvasStyle();
    let attributionStyle = this.getAttributionStyle();
    let attributionText = `${this.props.canvasData.photographer ? this.props.canvasData.photographer + ' / ' : ''}${this.props.canvasData.copyright}`;
    let metrics = measureText(attributionText, canvasStyle.width - 50,
          attributionStyle.fontFace, attributionStyle.fontSize, attributionStyle.lineHeight);

    // Draw in the bottom right hand corner of the canvas
    attributionStyle.height = metrics.height;
    attributionStyle.width = metrics.width;
    attributionStyle.top = canvasStyle.height - metrics.height - 5;
    attributionStyle.left = canvasStyle.width - metrics.width - 5;
    return(
      <Group style={ this.getGroupStyle() }>
        <Text className='attribution' style={ attributionStyle }>{ attributionText}</Text>
      </Group>
    )
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
    if (!logo.filename) {
      return;
    }

    let style = this.getLogoStyle();
    let logoUrl = `${window.location.origin}/logos/${logo.filename}`;
    return (
       <Image src={ logoUrl } style={ style }/>
    )
  }

  mouseDown(e) {
    //if (this.props.content.type !== 'watermark' || !this.props.options.backgroundImg.src) return;

    this.setState({
      mouseDown: true,
      lastMouseX: e.clientX,
      lastMouseY: e.clientY
    });
  }

  mouseUp(e) {
    this.setState({ mouseDown: false });
  }

  mouseMove(e) {
    if (!this.state.mouseDown) return;

    let movementX = this.state.lastMouseX - e.clientX;
    let movementY = this.state.lastMouseY - e.clientY;
    let newTop = this.state.backgroundPos.top - movementY;
    let newLeft = this.state.backgroundPos.left - movementX;

    this.setState({
      backgroundPos: {
        top: newTop,
        left: newLeft
      },
      lastMouseX: e.clientX,
      lastMouseY: e.clientY
    });
  }

  render() {
    let canvasElements = (<Text className='idk'> Haven't implemented this yet</Text>)
    let canvasStyle = this.getCanvasStyle();
    let contentType = this.props.content.type;

    if (contentType === 'quote') {
      canvasElements = this.renderQuote();
    } else if (contentType === 'list') {
      canvasElements = this.renderList();
    } else if (contentType === 'watermark') {
      canvasElements = this.renderPicture();
    }

    return (
      <div className='image'
          //onMouseDown={ this.mouseDown.bind(this) }
          //onMouseUp={ this.mouseUp.bind(this) }
          //onMouseMove={ this.mouseMove.bind(this) }
          style={ canvasStyle }
          ref='image'>
        <Surface className='quote'
            width={ canvasStyle.width }
            height={ canvasStyle.height }
            left={0}
            top={0}
            ref='canvas'>
          { this.renderBackground() }
          { canvasElements }
          { this.renderLogo() }
        </Surface>
      </div>
    )
  }
}
