'use strict';

import MediumEditor from 'medium-editor';

import Store from '../../../store';
import { fontSizeChange } from '../../../actions/font';

export default class FontSizeSelector {
  constructor() {

    // Extending https://github.com/yabwe/medium-editor/blob/master/src/js/extensions/fontname.js
    this.extension = MediumEditor.extensions.form.extend({

      name: 'fontsize',
      action: 'fontSize',
      aria: 'Change Font Size',
      contentDefault: '&#xB1;', // ±
      contentFA: '<i class="fa fa-text-height"></i>',

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
          let options = Store.getState();
          this.showForm(options.Font.fontSizeMultiplier);
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

      showForm: function (fontSizeMultiplier) {
        var input = this.getInput();

        this.base.saveSelection();
        this.hideToolbarDefaultActions();
        this.getForm().style.display = 'block';
        this.setToolbarPosition();

        input.value = fontSizeMultiplier * 11;
        input.focus();
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
          input = doc.createElement('input'),
          close = doc.createElement('a'),
          save = doc.createElement('a'),
          option,
          options = Store.getState();

        // Font Name Form (div)
        form.className = 'medium-editor-toolbar-form';
        form.id = 'medium-editor-toolbar-form-fontsize-' + this.getEditorId();

        // Handle clicks on the form itself
        this.on(form, 'click', this.handleFormClick.bind(this));

        input.setAttribute('type', 'range');
        input.setAttribute('min', 1);
        input.setAttribute('max', 33);
        input.setAttribute('step', 1);
        input.setAttribute('value', options.Font.fontSizeMultiplier * 11);

        input.className = 'medium-editor-toolbar-input-range';
        input.id = 'font-size';
        form.appendChild(input);

        // Handle typing in the textbox
        this.on(input, 'input', this.handleFontSizeChange.bind(this));

        return form;
      },

      getInput: function () {
        return this.getForm().querySelector('input[type=range]');
      },

      handleFontSizeChange: function() {
        let input = this.getInput();

        Store.dispatch(fontSizeChange(input.value));
      },

      handleFormClick: function (event) {
        // make sure not to hide form when clicking inside the form
        event.stopPropagation();
      },
    });
  }
}
