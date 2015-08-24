import Dispatcher from '../dispatcher';
import { actions } from '../lib/constants';
import OptionStore from '../store/options';

let Actions = actions.options;
let logos = OptionStore.getLogoOptions();

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
  backgroundImageChange(file) {
    Dispatcher.dispatch({ type: Actions.backgroundImageLoading });

    let reader = new FileReader();
    reader.onload = function(e) {
      Dispatcher.dispatch({
        type: Actions.backgroundImageChange,
        value: reader.result
      });
    }

    reader.readAsDataURL(file);
  }

  aspectRatioChange(ratio) {
    Dispatcher.dispatch({
      type: Actions.aspectRatioChange,
      value: ratio
    });
  }

  logoChange(index) {
    if (index < 0 || index >= logos.length) return;

    // Clear out the current logo
    Dispatcher.dispatch({
      type: Actions.logoChange,
      filename: '',
      aspectRatio: 0.0
    });

    let logo = logos[index];
    let filename = logo.filename;
    let setNewImage = function(filename, aspectRatio) {
      Dispatcher.dispatch({
        type: Actions.logoChange,
        filename,
        aspectRatio
      });
    };

    // Load the image into the DOM for usage
    let i = document.createElement('img');
    i.src = `/img/${filename}`;
    i = document.getElementById('img-cache').appendChild(i);

    i.onload = function() {
      let aspectRatio = (i.scrollWidth / i.scrollHeight);
      setNewImage(filename, aspectRatio);
    }

  }
}
