'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Editor, RichUtils } from 'draft-js';

import { textPosChange, textWidthChange, updateEditorState, updateFontFace,
  updateTextAlign, updateFontColor } from '../actions/text';
import { canvasMetricsSelector } from '../selectors/background';
import { getPresentState } from '../selectors/present';
import BlockStyleControls from '../components/editor-toolbar/block-style-controls';
import InlineStyleControls from '../components/editor-toolbar/inline-style-controls';
import FontPicker from '../components/editor-toolbar/font-picker';
import TextAlign from '../components/editor-toolbar/text-align';
import FontColorPicker from '../components/editor-toolbar/font-color-picker';

const MOVE_TYPE_POS = 'pos';
const MOVE_TYPE_WIDTH = 'width';

class TextOverlay extends React.Component {
  static propTypes = {
    Text: PropTypes.object,
    Font: PropTypes.object,
    canvas: PropTypes.object,
    actions: PropTypes.object,
    textContainerOptions: PropTypes.object.isRequired,
    textContainerIndex: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      initialized: false,

      mouseDown: false,
      lastMouseX: 0,
      lastMouseY: 0,

      origTextPos: null,
      origTextWidth: this.props.textContainerOptions.textWidth,
      textPos: { ...this.props.textContainerOptions.textPos },
    };

    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.onFontFaceChange = this.onFontFaceChange.bind(this);
    this.onTextAlignChange = this.onTextAlignChange.bind(this);
    this.onFontColorChange = this.onFontColorChange.bind(this);

    this.trackingTarget = document;

    document.addEventListener('mouseout', this.mouseOut);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseout', this.mouseOut);
  }

  getStyle() {
    const { canvas } = this.props;
    const { fontFace, textWidth, textAlign, fontColor } = this.props.textContainerOptions;
    let textWidthPx = (canvas.maxTextWidth * (textWidth / 100)) + canvas.textEditorPadding;
    textWidthPx /= 2;
    return {
      fontFamily: fontFace,
      width: `${textWidthPx}px`,
      textAlign,
      color: fontColor,
    };
  }

  getCurrentBlockType() {
    const { editorState } = this.props.textContainerOptions;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    return blockType;
  }

  /** Mouse events */
  mouseOut = (e) => {
    // http://stackoverflow.com/a/3187524/1337683
    e.stopPropagation();
    e.preventDefault();
    const target = e.relatedTarget || e.toElement;
    if (!target || target.nodeName === 'HTML') this.mouseUp();
  }

  mouseDown = (type) => {
    const moveType = type;

    return (e) => {
      e.stopPropagation();
      e.preventDefault();
      const clientX = e.clientX || e.changedTouches[0].clientX;
      const clientY = e.clientY || e.changedTouches[0].clientY;

      this.trackingTarget = e.target;
      this.trackMouseMovement(moveType);
      this.setState({
        mouseDown: true,
        lastMouseX: clientX,
        lastMouseY: clientY,

        origTextPos: { ...this.props.textContainerOptions.textPos },
        origTextWidth: this.props.textContainerOptions.textWidth,
      });
    };
  }

  mouseUp = () => {
    this.stopTrackingMouseMovement();
    this.setState({ mouseDown: false });
  }

  mouseMove = (type) => {
    const moveType = type;

    return (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!this.state.mouseDown) return;

      const { canvas } = this.props;

      const clientX = e.clientX || e.changedTouches[0].clientX;
      const clientY = e.clientY || e.changedTouches[0].clientY;


      const movementX = clientX - this.state.lastMouseX;
      const movementY = clientY - this.state.lastMouseY;

      // Figure out what to do with the new found information
      switch (moveType) {
        case MOVE_TYPE_POS: {
          const top = this.state.origTextPos.top + movementY;
          const left = this.state.origTextPos.left + movementX;
          this.props.actions.textPosChange(this.props.textContainerIndex, { top, left });
          break;
        }
        case MOVE_TYPE_WIDTH:
        default: {
          // cause we're scaled up, divide by two
          const maxTextWidth = canvas.maxTextWidth / 2;
          const percentChange = 100 * (movementX / maxTextWidth);
          const textWidthPercent = Math.round(percentChange + this.state.origTextWidth);
          this.props.actions.textWidthChange(this.props.textContainerIndex, textWidthPercent);
          break;
        }
      }
    };
  }

  trackMouseMovement = (type) => {
    this.mouseMoveCallback = this.mouseMove(type);
    document.body.addEventListener('mousemove', this.mouseMoveCallback);
    document.body.addEventListener('touchmove', this.mouseMoveCallback);
    document.body.addEventListener('mouseup', this.mouseUp);
    document.body.addEventListener('touchend', this.mouseUp);
  }

  stopTrackingMouseMovement = () => {
    document.body.removeEventListener('mousemove', this.mouseMoveCallback);
    document.body.removeEventListener('touchmove', this.mouseMoveCallback);
    document.body.removeEventListener('mouseup', this.mouseUp);
    document.body.removeEventListener('touchend', this.mouseUp);
  }

  /** End Mouse events */
  toggleBlockType(blockType) {
    const currentBlockType = this.getCurrentBlockType();
    if (blockType === 'text') {
      blockType = currentBlockType;
    } else if (blockType === currentBlockType) {
      return;
    }

    const { editorState } = this.props.textContainerOptions;
    this.props.actions.updateEditorState(
      this.props.textContainerIndex,
      RichUtils.toggleBlockType(editorState, blockType)
    );
  }

  toggleInlineStyle(inlineStyle) {
    const { editorState } = this.props.textContainerOptions;
    this.props.actions.updateEditorState(
      this.props.textContainerIndex,
      RichUtils.toggleInlineStyle(editorState, inlineStyle)
    );
  }

  onEditorChange(editorState) {
    this.props.actions.updateEditorState(this.props.textContainerIndex, editorState);
  }

  onFontFaceChange(fontFace) {
    this.props.actions.updateFontFace(this.props.textContainerIndex, fontFace);
  }

  onTextAlignChange(textAlign) {
    this.props.actions.updateTextAlign(this.props.textContainerIndex, textAlign);
  }

  onFontColorChange(fontColor) {
    this.props.actions.updateFontColor(this.props.textContainerIndex, fontColor.hex);
  }

  renderStyle() {
    const { Text } = this.props;
    const { blockTypeStyle } = Text;

    let style = [];
    for (const blockStyle of blockTypeStyle) {
      const { tagName, fontSize, marginBottom, lineHeight } = blockStyle;

      // Scale down for UI purposes
      const s = `{
        font-size: ${fontSize / 2}px !important;
        margin-bottom: ${marginBottom / 2}px !important;
        margin-top: 0;
        line-height: ${lineHeight / 2}px !important;
      }`;

      style.push(`.text-editor-container ${tagName}, .text-editor-container ${tagName} * ${s}`);
    }

    // style.push(`.text-editor-container { width: ${textWidthPx + canvas.textEditorPadding}px; }`);
    style.push(`
      .text-overlay-container .text-width-change {
      }`);

    return (<style>{style.join(' ')}</style>);
  }

  render() {
    const { canvas } = this.props;
    const { possibleBlockTypes, possibleInlineTypes, possibleTextAlignOptions } = this.props.Text;
    const { fontOptions } = this.props.Font;
    const { editorState, fontFace, fontColor, textAlign,
      textPos, textWidth } = this.props.textContainerOptions;
    const blockType = this.getCurrentBlockType();
    const currentInlineStyle = editorState.getCurrentInlineStyle();
    const canvasPadding = canvas.canvasPadding / 2;

    let textWidthPx = canvas.maxTextWidth * (textWidth / 100);
    // Have to scale things down on the DOM for better UI
    textWidthPx /= 2;

    let className = 'text-overlay-container';
    if (this.state.initialized) className += ' initialized';
    let style = this.getStyle();
    const textOverlayContainerStyle = {
      top: `${textPos.top}px`,
      left: `${textPos.left}px`,
      padding: `${canvasPadding}px`,
    };
    const moveTextStyle = {
      top: `${0}px`,
      left: '-40px',
    };
    const textWidthStyle = {
      top: '0px',
      left: `${textWidthPx + 4}px`,
    };
    const textOverlayStyle = {
      width: `${textWidthPx}px`,
    };
    return (
      <div className={className} style={textOverlayContainerStyle}>
        <div className="text-overlay">
          <div className="text-toolbar" style={textOverlayStyle}>
            <FontPicker
              fontOptions={fontOptions}
              currentFontFace={fontFace}
              onFontChange={this.onFontFaceChange}
            />
            <InlineStyleControls
              inlineTypes={possibleInlineTypes}
              currentInlineStyle={currentInlineStyle}
              onToggle={this.toggleInlineStyle}
            />
            <TextAlign
              currentJustifyIndex={possibleTextAlignOptions.indexOf(textAlign)}
              textAlignOptions={possibleTextAlignOptions}
              onChange={this.onTextAlignChange}
            />
            <BlockStyleControls
              blockTypes={possibleBlockTypes}
              currentActiveStyle={blockType}
              onToggle={this.toggleBlockType}
            />
            <FontColorPicker
              currentColor={fontColor}
              onChange={this.onFontColorChange}
            />

          </div>
          <div className="text-editor-container" style={style}>
            <Editor
              editorState={editorState}
              onChange={this.onEditorChange}
              style={style}
            />
          </div>
          <div
            className="move-text"
            onMouseDown={this.mouseDown(MOVE_TYPE_POS)}
            onTouchStart={this.mouseDown(MOVE_TYPE_POS)}
            style={moveTextStyle}
          ><i className="fa fa-arrows"></i></div>
          {this.renderStyle()}
          <div
            className="text-width-change"
            onMouseDown={this.mouseDown(MOVE_TYPE_WIDTH)}
            onTouchStart={this.mouseDown(MOVE_TYPE_WIDTH)}
            style={textWidthStyle}
          ><i className="fa fa-arrows-h"></i></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { Text, Font } = getPresentState(state);
  const canvas = canvasMetricsSelector(state);
  return { Text, Font, canvas };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      textPosChange,
      textWidthChange,
      updateFontFace,
      updateEditorState,
      updateTextAlign,
      updateFontColor,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, undefined,
    { withRef: true })(TextOverlay);
