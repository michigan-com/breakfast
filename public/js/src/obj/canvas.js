import React from 'react';
import ReactCanvas from 'react-canvas';
import { clone } from '../lib/parse';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var measureText = ReactCanvas.measureText;

export default class Canvas extends React.Component {

  constructor(args) {
    super(args);

    this.canvasPadding = 20;
    this.canvasWidth = 650;
    this.canvasHeight = 650;
  }

  getCanvasStyle() {
    return {
      width: this.canvasWidth,
      height: this.canvasHeight,
      textWidth: this.canvasWidth - 20,
    }
  }

  getQuoteStyle() {
    let textHeight = this.props.fontSize * 1.25;
    let textWidth = this.canvasWidth - 20;
    let font = ReactCanvas.FontFace('Arial Black, Arial Bold, Gadget, sans-serif', '', {});
    return {
      text: {
        top: this.canvasPadding,
        left: 10,
        height: textHeight,
        lineHeight: textHeight,
        fontSize: this.props.fontSize,
        width: textWidth,
        fontFace: font
      },
      source: {
        top: 50 + 10,
        left: 10,
        height: textHeight,
        lineHeight: 20,
        fontSize: 15,
        width: textWidth,
        color: 'grey'
      }
    }
  }

  getListStyle() {
    let headlineFontSize = 30;
    let headlineSize = 50;
    let textWidth = this.canvasWidth - 20;
    let font = ReactCanvas.FontFace('Arial Black, Arial Bold, Gadget, sans-serif', '', {});

    let listItemSize = this.props.fontSize * 1.25;;
    return {
      headline: {
        top: this.canvasPadding,
        left: 10,
        height: headlineSize,
        lineHeight: headlineSize,
        fontSize: headlineFontSize,
        width: textWidth,
        fontFace: font
      },
      listItem: {
        top: headlineSize + 10,
        left: 10 + 10,
        height: listItemSize,
        lineHeight: listItemSize,
        fontSize: this.props.fontSize,
        width: textWidth,
        fontFace: font
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
      console.log(listItemStyle.fontSize);
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
    console.log(style.top, style.height, index);
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
      <Group>
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
      <Group>
        <Text className='headline'>
        </Text>
        { this.renderListItems.call(this) }
      </Group>
    )
  }


  render() {
    if (this.props.type === 'quote') {
      return this.renderQuote();
    } else if (this.props.type === 'list') {
      return this.renderList();
    } else {
      return (
        <Text className='idk'> Haven't implemented this yet</Text>
      )
    }
  }
}
