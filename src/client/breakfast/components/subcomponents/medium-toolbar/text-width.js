'use strict';

import MediumEditor from 'medium-editor';

import Store from '../../../store';
import { textWidthChange } from '../../../actions/text';

export default class TextWidthSelector {
  constructor() {

    let maxTextWidth = Store.getState().Background.canvas.maxTextWidth;

    // Extending https://github.com/yabwe/medium-editor/blob/master/src/js/extensions/fontname.js
    this.extension = MediumEditor.extensions.form.extend({

      name: 'textwidth',
      action: 'textWidth',
      aria: 'Change Text Box Width',
      contentDefault: '&#xB1;', // ±
      contentFA: '<i class="fa fa-text-width"></i>',

      maxTextWidth: maxTextWidth,

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
          this.showForm();
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

      showForm: function () {
        let input = this.getInput();

        this.base.saveSelection();
        this.hideToolbarDefaultActions();
        this.getForm().style.display = 'block';
        this.setToolbarPosition();

        input.value = this.getTextWidthPercent();
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
          option;

        // Font Name Form (div)
        form.className = 'medium-editor-toolbar-form';
        form.id = 'medium-editor-toolbar-form-textwidth-' + this.getEditorId();

        // Handle clicks on the form itself
        this.on(form, 'click', this.handleFormClick.bind(this));

        input.setAttribute('type', 'range');
        input.setAttribute('min', 1);
        input.setAttribute('max', 100);
        input.setAttribute('step', 1);
        input.setAttribute('value', this.getTextWidthPercent());

        input.className = 'medium-editor-toolbar-input-range';
        input.id = 'text-width';
        form.appendChild(input);

        // Handle typing in the textbox
        this.on(input, 'input', this.handleTextWidthChange.bind(this));

        return form;
      },

      getInput: function () {
        return this.getForm().querySelector('input[type=range]');
      },

      getTextWidthPercent: function() {
        let options = Store.getState();

        return (options.Text.textWidth);
      },

      handleTextWidthChange: function() {
        let input = this.getInput();

        Store.dispatch(textWidthChange(input.value));
      },

      handleFormClick: function (event) {
        // make sure not to hide form when clicking inside the form
        event.stopPropagation();
      },
    });
  }
}
