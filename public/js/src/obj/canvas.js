import React from 'react';
import ReactCanvas from 'react-canvas';
import { clone } from '../lib/parse';

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
  }

  getCanvasStyle() {
    let canvasWidth = 650;
    let canvasHeight = 650;
    if (this.props.aspectRatio === '16:9') {
      canvasHeight = canvasWidth * 9/16;
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
      top: 0,
      left: 0,
      width: canvasStyle.width,
      height: canvasStyle.height
    }

    if (this.props.background.type === 'color') {
      style.backgroundColor = this.props.background.color;
    }
    return style;
  }

  getQuoteStyle() {
    let canvasStyle = this.getCanvasStyle();

    let textHeight = this.props.fontSize * 1.25;
    let font = ReactCanvas.FontFace('Arial Black, Arial Bold, Gadget, sans-serif', '', {});
    return {
      text: {
        top: this.canvasPadding,
        left: 10,
        height: textHeight,
        lineHeight: textHeight,
        fontSize: this.props.fontSize,
        width: canvasStyle.textWidth,
        fontFace: font,
        color: this.props.fontColor
      },
      source: {
        top: 50 + 10,
        left: 10,
        height: textHeight,
        lineHeight: 20,
        fontSize: 15,
        width: canvasStyle.textWidth,
        color: 'grey'
      }
    }
  }

  getListStyle() {
    let canvasStyle = this.getCanvasStyle();

    let headlineFontSize = 30;
    let headlineSize = 50;
    let font = ReactCanvas.FontFace('Arial Black, Arial Bold, Gadget, sans-serif', '', {});

    let listItemSize = this.props.fontSize * 1.25;;
    return {
      headline: {
        top: this.canvasPadding,
        left: 10,
        height: headlineSize,
        lineHeight: headlineSize,
        fontSize: headlineFontSize,
        width: canvasStyle.textWidth,
        fontFace: font
      },
      listItem: {
        top: headlineSize + 10,
        left: 10 + 10,
        height: listItemSize,
        lineHeight: listItemSize,
        fontSize: this.props.fontSize,
        width: canvasStyle.textWidth,
        fontFace: font,
        color: this.props.fontColor
      }
    }

  }

  renderListItems() {
    let canvasStyle = this.getCanvasStyle();
    let listItemStyle = this.getListStyle().listItem;
    let prevHeight = 0;
    let returnElements = [];
    for (let i = 0; i < this.props.canvasData.items.length; i++) {
      let item = this.props.canvasData.items[i];

      let listMetrics = measureText(item, canvasStyle.width - 50, listItemStyle.fontFace,
          listItemStyle.fontSize, listItemStyle.lineHeight);

      listItemStyle.height = listMetrics.height;
      listItemStyle.top += prevHeight;
      returnElements.push(
         <Text className='item' style={ clone(listItemStyle) }>{item}</Text>
      )

      prevHeight = listMetrics.height;
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
    quoteStyle.source.top = quoteStyle.text.height + quoteStyle.text.top;
    return (
      <Group style={ this.getGroupStyle() }>
        <Text className='quote-text' style={ clone(quoteStyle.text) }>
          { this.props.canvasData.quote }
        </Text>
        <Text className='source' style={ clone(quoteStyle.source) }>
          { this.props.canvasData.source }
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

  renderBackground() {
    let type = this.props.background.type;
    let backgroundObj;
    if (type === 'color') {
      backgroundObj = (
        <Layer style={ this.getBackgroundStyle() }></Layer>
      )
    } else if (type === 'image') {
      backgroundObj = (
        <Image style={ this.getBackgroundStyle() } src={ this.props.background.src }/>
      )
    }

    return backgroundObj;
  }

  render() {
    let canvasElements = (<Text className='idk'> Haven't implemented this yet</Text>)
    let canvasStyle = this.getCanvasStyle();

    if (this.props.type === 'quote') {
      canvasElements = this.renderQuote();
    } else if (this.props.type === 'list') {
      canvasElements = this.renderList();
    }
    return (
      <Surface className='quote' width={ canvasStyle.width } height={ canvasStyle.height } left={0} top={0} ref='canvas'>
        { this.renderBackground() }
        { canvasElements }
      </Surface>
    )
  }
}
