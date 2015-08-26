import Dispatcher from '../dispatcher';
import { actions } from '../lib/constants';
import OptionStore from '../store/options';
import logoInfo from '../lib/logoInfo.json';

let Actions = actions.options;
let logos = OptionStore.getLogoOptions();
let fonts = OptionStore.getFontOptions();
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
    if (index < 0 || index >= logos.length) return;

    // Clear out the current logo
    Dispatcher.dispatch({
      type: Actions.logoChange,
      filename: '',
      aspectRatio: 0.0
    });

    let logo = logos[index];
    let filename = logo.filename;

    if (!(filename in logoInfo)) {
      return;
    }

    let aspectRatio = logoInfo[filename].aspectRatio;

    setTimeout(function() {
      Dispatcher.dispatch({
        type: Actions.logoChange,
        filename,
        aspectRatio
      })
    }, 25);
  }
}
