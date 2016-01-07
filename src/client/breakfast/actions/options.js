import xr from 'xr';
import Dispatcher from '../dispatcher';
import { actions } from '../lib/constants';
import OptionStore from '../store/options';

let Actions = actions.options;
let backgroundTypes = OptionStore.getBackgroundTypeOptions();

export default class OptionActions {

  fontSizeChange(size) {
    size = parseInt(size);
    if (isNaN(size)) return;

    Dispatcher.dispatch({
      type: Actions.fontSizeChange,
      value: size
    });
  }

  fontColorChange(color) {
    Dispatcher.dispatch({
      type: Actions.fontColorChange,
      value: color
    });
  }

  fontFaceChange(index) {
    let fonts = OptionStore.getFontOptions();

    if (index < 0 || index >= fonts.length) return;
    Dispatcher.dispatch({
      type: Actions.fontFaceChange,
      value: fonts[index]
    })
  }

  backgroundColorChange(color) {
    Dispatcher.dispatch({
      type: Actions.backgroundColorChange,
      value: color
    });
  }

  /**
   * Read a file using FileReader, and pass it along to the dispatcher
   *
   * @param {Object} file - File object from an <input type='file'
   */
  backgroundImageFileChange(file) {
    Dispatcher.dispatch({ type: Actions.backgroundImageLoading });

    let reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();

      img.onload = function() {
        Dispatcher.dispatch({
          type: Actions.backgroundImageChange,
          value: {
            src: reader.result,
            width: img.width,
            height: img.height
          }
        });
      }

      img.src = reader.result;

    }
    reader.readAsDataURL(file);
  }

  /**
   */
  removeBackgroundImage() {
    Dispatcher.dispatch({ type: Actions.removeBackgroundImage });
  }

  /**
   * Given a url for an image, fetch the image and read the file contents
   *
   * @param {String} url - Url for an image
   */
  backgroundImageUrlChange(url) {
    var img = new Image();

    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
      canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

      canvas.getContext('2d').drawImage(this, 0, 0);

      Dispatcher.dispatch({
        type: Actions.backgroundImageChange,
        value: {
          src: canvas.toDataURL('image/png'),
          url: url,
          width: img.width,
          height: img.height
        }
      });
    };

    img.src = url;
  }

  backgroundTypeChange(type) {
    if (backgroundTypes.indexOf(type) < 0) return;

    Dispatcher.dispatch({
      type: Actions.backgroundTypeChange,
      value: type
    });
  }

  aspectRatioChange(ratio) {
    Dispatcher.dispatch({
      type: Actions.aspectRatioChange,
      value: ratio
    });
  }

  logoChange(index) {
    Dispatcher.dispatch({
      type: Actions.logoChange,
      value: index
    });
  }

  logoColorChange(color) {
    Dispatcher.dispatch({
      type: Actions.logoColorChange,
      value: color
    });
  }

  logoLocationChange(corner) {
    Dispatcher.dispatch({
      type: Actions.logoLocationChange,
      value: corner
    });
  }

  /**
   * @param {Number} width - any value from [0-100]
   */
  textWidthChange(width) {
    Dispatcher.dispatch({
      type: Actions.textWidthChange,
      value: width
    })
  }

  textPosChange(newPos) {
    Dispatcher.dispatch({
      type: Actions.textPosChange,
      value: newPos
    });
  }
}
