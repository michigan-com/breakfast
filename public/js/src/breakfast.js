import React from 'react';
import ReactCanvas from 'react-canvas';
import { wrapText, clone } from './lib/parse';

var Surface = ReactCanvas.Surface;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var Group = ReactCanvas.Group;
var measureText = ReactCanvas.measureText;

class PicEditor extends React.Component {
  constructor(args) {
    super(args);

    this.contentTypes = ['quote', 'list', 'picture'];
    this.state = {
      contentType: this.contentTypes[0],

      // Quote stuff
      quote: {
        quote: 'Test quote',
        source: 'Test source'
      },
      list: {
        headline: 'This is a headline',
        items: ['this is an item in the ist']
      }
    }

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
    let textHeight = 50;
    let textWidth = this.canvasWidth - 20;
    let font = ReactCanvas.FontFace('Arial Black, Arial Bold, Gadget, sans-serif', '', {});
    return {
      text: {
        top: this.canvasPadding,
        left: 10,
        height: textHeight,
        lineHeight: textHeight,
        fontSize: 20,
        width: textWidth,
        fontFace: font
      },
      source: {
        top: 50 + 10,
        left: 10,
        height: textHeight,
        lineHeight: 20,
        fontSize: 15,
        width: textWidth
      }
    }
  }

  getListStyle() {
    let headlineFontSize = 30;
    let headlineSize = 50;
    let textWidth = this.canvasWidth - 20;
    let font = ReactCanvas.FontFace('Arial Black, Arial Bold, Gadget, sans-serif', '', {});

    let listItemFontSize = 20;
    let listItemSize = 30;
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
        fontSize: listItemFontSize,
        width: textWidth,
        fontFace: font
      }
    }

  }

  contentTypeChange(contentType) {
    if (this.contentTypes.indexOf(contentType) === -1) {
      console.log('Invalid conent type ' + type);
      return;
    }

    this.setState({
      contentType
    });
  }

  quoteChanged() {
    let source = this.state.quote.source;
    this.setState({
      quote: {
        quote: React.findDOMNode(this.refs.quote).value,
        source
      }
    });
  }

  addListItem() {
    let list = clone(this.state.list);
    list.items.push('');
    this.setState({ list });
  }

  listItemChanged(ref, index) {
    if (index >= this.state.list.items.length) {
      console.log('Index out of range');
      return;
    } else if (!(ref in this.refs)) {
      console.log(`Ref ${ref} not found`);
      return;
    }

    let headline = this.state.list.headline;
    let items = this.state.list.items;
    items[index] = React.findDOMNode(this.refs[ref]).value;
    this.setState({
      items
    });
  }

  renderImageText() {


    function renderListItems() {
      let canvasStyle = this.getCanvasStyle();
      let listItemStyle = this.getListStyle().listItem;
      let prevHeight = 0;
      let returnElements = [];
      for (let i = 0; i < this.state.list.items.length; i++) {
        let item = this.state.list.items[i];

        let listMetrics = measureText(item, canvasStyle.width - 50, listItemStyle.fontFace,
            listItemStyle.fontSize, listItemStyle.lineHeight);

        listItemStyle.height = listMetrics.height;
        listItemStyle.top += prevHeight;
        returnElements.push(
           <Text className='item' style={ clone(listItemStyle) }> • {item}</Text>
        )

        prevHeight = listMetrics.height;
      }

      return returnElements;
    }

    function renderQuoteLine(item, index) {

      let style = this.getQuoteStyle().source
      style.top += style.height * index;
      console.log(style.top, style.height, index);
      return (
        <Text className='quote-text' style={ style }>{ item }</Text>
      )
    }

    if (this.state.contentType === 'quote') {

      let canvasStyle = this.getCanvasStyle();
      let quoteStyle = this.getQuoteStyle();
      let quoteMetrics = measureText(this.state.quote.quote, canvasStyle.width - 50,
            quoteStyle.text.fontFace, quoteStyle.text.fontSize, quoteStyle.text.lineHeight);

      quoteStyle.text.height = quoteMetrics.height;
      quoteStyle.source.top = quoteStyle.text.height + quoteStyle.text.top;
      return (
        <Group>
          <Text className='quote-text' style={ quoteStyle.text }>
            { this.state.quote.quote }
          </Text>
          <Text className='source' style={ quoteStyle.source }>
            { this.state.quote.source }
          </Text>
        </Group>
      )
    } else if (this.state.contentType === 'list') {

      return (
        <Group>
          <Text className='headline'>
          </Text>
          { renderListItems.call(this) }
        </Group>
      )
    }
    else {
      return (
        <div>Haven't implemented this yet</div>
      )
    }
  }

  renderTextInput() {

    function renderListItemInput(item, index) {
      let ref = 'list-item-' + index;
      return (
        <input type='text' ref={ ref } value={ item } onChange={ this.listItemChanged.bind(this, ref, index) }/>
      )
    }

    if (this.state.contentType === 'quote') {
      return (
        <div className='inputs'>
          <input type='text' ref='quote' placeholder={ this.state.quote.quote } onChange={ this.quoteChanged.bind(this) }/>
        </div>
      )
    } else if (this.state.contentType === 'list') {
      return (
        <div className='inputs'>
          { this.state.list.items.map(renderListItemInput.bind(this)) }
          <div className='add-item' onClick={ this.addListItem.bind(this) }>Add item</div>
        </div>
      )
    }
  }

  saveImage() {
    let canvas = React.findDOMNode(this.refs.canvas);
    let dataUri = canvas.toDataURL();

    var a = document.createElement('a');
    a.setAttribute('href',  dataUri);
    a.setAttribute('download', 'pic.png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  render() {

    return(
      <div className='pic-editor'>
        <div className='image-container'>
          <div className='image' ref='image'>
            <Surface className='quote' width={650} height={650} left={0} top={0} ref='canvas'>
              { this.renderImageText() }
            </Surface>
          </div>
        </div>
        <div className='controls-container'>
          <div className='content-type-selector'>
            <div className='content-type' onClick={ this.contentTypeChange.bind(this, 'quote') }>Quote</div>
            <div className='content-type' onClick={ this.contentTypeChange.bind(this, 'list') }>Fact List</div>
            <div className='content-type' onClick={ this.contentTypeChange.bind(this, 'image') }>Water Mark</div>
          </div>
          <div className='text-rendering'>
            { this.renderTextInput() }
          </div>
          <div className='save'>
            <button className='save' onClick={ this.saveImage.bind(this) }>Save</button>
          </div>
        </div>
      </div>
    )
  }
}

(function(){
  React.render(
    <PicEditor/>,
    document.getElementById('editor')
  )
})();

