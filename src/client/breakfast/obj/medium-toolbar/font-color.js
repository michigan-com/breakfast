'use strict';

import MediumEditor from 'medium-editor';

import OptionStore from '../../store/options';
import OptionActions from '../../actions/options';

let actions = new OptionActions();

export default class FontColorSelector {
  constructor(fonts) {
    this.fonts = fonts;

    // Extending https://github.com/yabwe/medium-editor/blob/master/src/js/extensions/fontname.js
    this.extension = MediumEditor.extensions.form.extend({

      name: 'fontcolor',
      action: 'fontcace',
      aria: 'Change Font Color',
      contentDefault: '&#xB1;', // ±
      contentFA: '<i class="fa fa-paint-brush"></i>',

      fonts: this.fonts,

      init: function () {
        MediumEditor.extensions.form.prototype.init.apply(this, arguments);
      },

      // Called when the button the toolbar is clicked
      // Overrides ButtonExtension.handleClick
      handleClick: function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.isDisplayed()) {
          // Get FontName of current selection (convert to string since IE returns this as number)
          let options = OptionStore.getOptions();
          this.showForm(options.fontFace);
        }

        return false;
      },

      // Called by medium-editor to append form to the toolbar
      getForm: function () {
        if (!this.form) {
          this.form = this.createForm();
        }
        return this.form;
      },

      // Used by medium-editor when the default toolbar is to be displayed
      isDisplayed: function () {
        return this.getForm().style.display === 'block';
      },

      hideForm: function () {
        this.getForm().style.display = 'none';
      },

      showForm: function (fontName) {

        this.base.saveSelection();
        this.hideToolbarDefaultActions();
        this.getForm().style.display = 'block';
        this.setToolbarPosition();

        let options = OptionStore.getOptions();
        this.getForm().className = this.getFormClassName(options.fontColor);
      },

      // Called by core when tearing down medium-editor (destroy)
      destroy: function () {
        if (!this.form) {
          return false;
        }

        if (this.form.parentNode) {
          this.form.parentNode.removeChild(this.form);
        }

        delete this.form;
      },

      // core methods

      doFormSave: function () {
        this.base.restoreSelection();
        this.base.checkSelection();
      },

      doFormCancel: function () {
        this.base.restoreSelection();
        this.base.checkSelection();
      },

      // form creation and event handling
      createForm: function () {
        var doc = this.document,
          form = doc.createElement('div'),
          option,
          options = OptionStore.getOptions();

        // Font Name Form (div)
        form.className = this.getFormClassName(options.fontColor);
        form.id = 'medium-editor-toolbar-form-fontname-' + this.getEditorId();

        // Handle clicks on the form itself
        this.on(form, 'click', this.handleFormClick.bind(this));

        let colors = ['black', 'white'];
        for (let color of colors) {
          var colorEl = doc.createElement('div');
          colorEl.className = `font-color-option ${color}`;
          this.on(colorEl, 'click', this.colorChangeCallback(color));

          form.appendChild(colorEl);
        }

        return form;
      },

      getFormClassName: function(color) {
        return`medium-editor-toolbar-form color-picker ${color}`;
      },

      getColorEl: function(color) {
        return this.getForm().querySelector(`.font-color-option.${color}`);
      },

      getSelect: function () {
        return this.getForm().querySelector('select.medium-editor-toolbar-select');
      },

      colorChangeCallback: function(c) {
        let color = c;
        return (e) => {
          this.getForm().className = this.getFormClassName(color);
          actions.fontColorChange(color);
        }
      },

      handleFormClick: function (event) {
        // make sure not to hide form when clicking inside the form
        event.stopPropagation();
      },
    });
  }
}
