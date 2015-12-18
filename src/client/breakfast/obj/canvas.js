import React from 'react';
import ReactCanvas from 'react-canvas';

import { clone } from '../lib/parse';
import { SIXTEEN_NINE, TWO_ONE, FIT_IMAGE, FACEBOOK, FACEBOOK_COVER, BACKGROUND_LOADING,
  BACKGROUND_IMAGE, BACKGROUND_COLOR } from '../lib/constants';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var measureText = ReactCanvas.measureText;
var Layer = ReactCanvas.Layer;

export default class Canvas extends React.Component {

  constructor(args) {
    super(args);

    this.canvasWidth = 650;
    window.onresize = function() {
      this.setState({ windowChange: true});
    }.bind(this);

    this.state = {
      textPos: {
        top: 0,
        left: 0
      },

      mouseHover: false,
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

    this.setState(newState);
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
      case FACEBOOK:
        canvasHeight = canvasWidth * 1/1.911;
        break;
      case FACEBOOK_COVER:
        canvasHeight = canvasWidth * 0.370153;
        break;
      case FIT_IMAGE:
        // Only deal with this aspect ratio if we've loaded an image up
        if (this.props.options.backgroundType !== BACKGROUND_IMAGE) {
          break;
        }
        let backgroundImg = this.props.options.backgroundImg;
        canvasHeight = canvasWidth  / (backgroundImg.width / backgroundImg.height);
    }

    let textWidth = canvasWidth - (canvasHeight * .1);
    let content = this.props.content[this.props.content.type];
    if (content.options && content.options.width) {
      textWidth *= (content.options.width / 100);
    }

    return {
      width: canvasWidth,
      height: canvasHeight,
      textWidth,
      logoPadding: {
        top: canvasHeight * .05,
        right: canvasHeight * .05,
        bottom: canvasHeight * .05,
        left: canvasHeight * .05
      },
      padding: {
        // TODO think about this more. want to make it the equal padding all
        // the way around. Should we do relative height or width?
        top: (canvasHeight * .05) + this.state.textPos.top,
        right: canvasHeight * .05,
        bottom: canvasHeight * .05,
        left: (canvasHeight * .05) + this.state.textPos.left
      }
    }
  }

  getCanvasNode() {
    return React.findDOMNode(this.refs.canvas);
  }

  getGroupStyle() {
    let style = {
      zIndex: 10,
      top: this.state.textPos.top,
      left: this.state.textPos.left
    }

    if (this.props.content.type !== 'watermark' && this.state.mouseHover) {
      style.border = '1px solid black';
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

  getQuoteStyle() {
    let canvasStyle = this.getCanvasStyle();
    let fontSize = canvasStyle.height * (this.props.fontSize / 500);

    let textHeight = fontSize * 1.25;
    let font = ReactCanvas.FontFace(this.props.options.fontFace, '', {});

    let top = canvasStyle.padding.top;
    if (/^top/.test(this.props.options.logoLocation)) {
      let logoStyle = this.getLogoStyle();
      top += logoStyle.height * 2;
    }
    return {
      text: {
        top: top,
        left: canvasStyle.padding.left,
        height: textHeight,
        lineHeight: textHeight * 1.2,
        fontSize: fontSize,
        width: canvasStyle.textWidth,
        fontFace: font,
        color: this.props.options.fontColor
      },
      source: {
        top: canvasStyle.padding.top + 50,
        left: canvasStyle.padding.left + 20,
        height: textHeight,
        lineHeight: textHeight * 1.25,
        fontSize: fontSize * .75,
        width: canvasStyle.textWidth,
        fontFace: font,
        color: this.props.options.fontColor
      }
    }
  }

  getListStyle() {
    let canvasStyle = this.getCanvasStyle();

    // this.props.fontSize is a scale from 0-100. Max font size === 1/3 the canvas height
    let headlineFontSize = canvasStyle.height * (this.props.fontSize / 400);
    let headlineSize = headlineFontSize;
    let font = ReactCanvas.FontFace(this.props.options.fontFace, '', {});

    let listItemFontSize = canvasStyle.height * (this.props.fontSize / 600);
    let listItemHeight = listItemFontSize;

    let headlineTop = canvasStyle.padding.top;
    let listItemTop = headlineTop + headlineSize;
    if (/^top/.test(this.props.options.logoLocation)) {
      let logoStyle = this.getLogoStyle();
      headlineTop += logoStyle.height * 2;
      listItemTop += logoStyle.height * 2;
    }

    return {
      headline: {
        top: headlineTop,
        left: canvasStyle.padding.left,
        height: headlineSize,
        lineHeight: headlineSize * 1.15,
        fontSize: headlineFontSize,
        width: canvasStyle.textWidth,
        fontFace: font,
        color: this.props.options.fontColor
      },
      listItem: {
        top: listItemTop,
        left: canvasStyle.padding.left + 20,
        height: listItemHeight,
        lineHeight: listItemHeight * 1.3,
        fontSize: listItemFontSize,
        width: canvasStyle.textWidth,
        fontFace: font,
        color: this.props.options.fontColor
      }
    }
  }

  getAttributionStyle() {
    let fontSize = this.props.fontSize * .5;
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
    let padding = canvasStyle.logoPadding;
    switch (/^bottom/.test(this.props.options.logoLocation)) {
      case false:
        top = padding.top;
        break;
      case true:
        top = canvasStyle.height - (height) - (padding.top);
        break;
    }
    switch (/left$/.test(this.props.options.logoLocation)) {
      case true:
        left = padding.left;
        break;
      case false:
        left = canvasStyle.width - padding.right - width;
        break;
    }


    return { height, width, top, left, zIndex }
  }

  renderListItems() {
    let canvasStyle = this.getCanvasStyle();
    let headlineStyle = this.getListStyle().headline;
    let listItemStyle = this.getListStyle().listItem;
    let listItemBulletStyle = this.getListStyle().listItem;
    let prevHeight = 0;
    let returnElements = [];

    // Render the headline
    let headline = this.props.canvasData.headline;
    let headlineMetrics = measureText(headline, headlineStyle.width,
          headlineStyle.fontFace, headlineStyle.fontSize, headlineStyle.lineHeight);
    prevHeight = headlineMetrics.height;
    headlineStyle.height = headlineMetrics.height;
    returnElements.push(
      <Text className='headline' style={ headlineStyle }>{ headline }</Text>
    )

    // render the text input. Have to manually calculate starting point
    for (let i = 0; i < this.props.canvasData.items.length; i++) {
      let item = this.props.canvasData.items[i];

      let bulletType = this.props.content.list.options.bulletType;
      let bulletCharacter = '';
      if (bulletType === 'number') bulletCharacter = `${i+1}.`;
      else if (bulletType === 'bullet') bulletCharacter = '•';

      let bullet = `${bulletCharacter}  `;

      let bulletMetrics = measureText(bullet, canvasStyle.textWidth,
          listItemStyle.fontFace, listItemStyle.fontSize, listItemStyle.lineHeight);

      let listMaxWidth = listItemStyle.width - bulletMetrics.width - canvasStyle.padding.right;
      let listMetrics = measureText(item, listMaxWidth,
          listItemStyle.fontFace, listItemStyle.fontSize, listItemStyle.lineHeight);


      listItemBulletStyle.height = bulletMetrics.height;
      listItemBulletStyle.top += prevHeight;

      listItemStyle.height = listMetrics.height;
      listItemStyle.top += prevHeight;
      listItemStyle.left = listItemBulletStyle.left + bulletMetrics.width;

      returnElements.push(
        <Text className='item' style={ clone(listItemBulletStyle) } key={ `list-item-bullet-${i}`}>{bullet}</Text>
      )

      returnElements.push(
         <Text className='item' style={ clone(listItemStyle) } key={ `list-item-${i}` }>{item}</Text>
      )

      prevHeight = listMetrics.height + (listItemStyle.lineHeight * .5);
    }

    return returnElements;
  }

  renderQuote() {
    let canvasStyle = this.getCanvasStyle();
    let quoteStyle = this.getQuoteStyle();
    let quoteMetrics = measureText(this.props.canvasData.quote, canvasStyle.textWidth,
          quoteStyle.text.fontFace, quoteStyle.text.fontSize, quoteStyle.text.lineHeight);

    quoteStyle.text.height = quoteMetrics.height;
    quoteStyle.source.top = quoteStyle.text.height + quoteStyle.text.top + 20;
    return [(
      <Text className='quote-text' style={ clone(quoteStyle.text) }>
        { this.props.canvasData.quote }
      </Text>
    ), (
      <Text className='source' style={ clone(quoteStyle.source) }>
        { `- ${this.props.canvasData.source }` }
      </Text>
    )]
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
    attributionStyle.top = canvasStyle.height - metrics.height - canvasStyle.logoPadding.top;
    attributionStyle.left = canvasStyle.width - metrics.width - canvasStyle.logoPadding.right;
    return <Text className='attribution' style={ attributionStyle }>{ attributionText}</Text>;
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
    let newTop = this.state.textPos.top - movementY;
    let newLeft = this.state.textPos.left - movementX;

    this.setState({
      textPos: {
        top: newTop,
        left: newLeft
      },
      lastMouseX: e.clientX,
      lastMouseY: e.clientY
    });
  }

  renderCanvasElements() {
    let canvasElements = (<Text className='idk'> Haven't implemented this yet</Text>)
    let contentType = this.props.content.type;

    if (contentType === 'quote') {
      canvasElements = this.renderQuote();
    } else if (contentType === 'list') {
      canvasElements = this.renderListItems();
    } else if (contentType === 'watermark') {
      canvasElements = this.renderPicture();
    }

    return (
      <Group style={ this.getGroupStyle() }>
        { canvasElements }
      </Group>
    )
  }

  render() {
    let canvasStyle = this.getCanvasStyle();

    let className = 'image';
    if (this.state.hover) className += ' hover';

    return (
      <div className={ className }
          onMouseDown={ this.mouseDown.bind(this) }
          onMouseUp={ this.mouseUp.bind(this) }
          onMouseMove={ this.mouseMove.bind(this) }
          onMouseEnter={ () => { this.setState({ mouseHover: true }); } }
          onMouseLeave={ () => { this.setState({ mouseHover: false }); } }
          style={ canvasStyle }
          ref='image'>
        <Surface className='quote'
            width={ canvasStyle.width }
            height={ canvasStyle.height }
            left={0}
            top={0}
            ref='canvas'>
          { this.renderBackground() }
          { this.renderCanvasElements() }
          { this.renderLogo() }
        </Surface>
      </div>
    )
  }
}
