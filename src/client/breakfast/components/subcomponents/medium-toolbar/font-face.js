'use strict';

import MediumEditor from 'medium-editor';

import Store from '../../../store';
import { fontFaceChange } from '../../../actions/font';

export default class FontFaceSelector {
  constructor(fonts) {
    this.fonts = fonts;

    // Extending https://github.com/yabwe/medium-editor/blob/master/src/js/extensions/fontname.js
    this.extension = MediumEditor.extensions.form.extend({

      name: 'fontface',
      action: 'fontFace',
      aria: 'Change Font Face',
      contentDefault: '&#xB1;', // ±
      contentFA: '<i class="fa fa-font"></i>',

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
        this.getSelect().value = '';
      },

      showForm: function (fontName) {
        var select = this.getSelect();

        this.base.saveSelection();
        this.hideToolbarDefaultActions();
        this.getForm().style.display = 'block';
        this.setToolbarPosition();

        select.value = fontName || '';
        select.focus();
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
          select = doc.createElement('select'),
          close = doc.createElement('a'),
          save = doc.createElement('a'),
          option;

        // Font Name Form (div)
        form.className = 'medium-editor-toolbar-form';
        form.id = 'medium-editor-toolbar-form-fontname-' + this.getEditorId();

        // Handle clicks on the form itself
        this.on(form, 'click', this.handleFormClick.bind(this));

        // Add font names
        for (var i = 0; i<this.fonts.length; i++) {
          let font = this.fonts[i];

          option = doc.createElement('option');
          option.innerHTML = font;
          option.value = font;
          option.setAttribute('style', `font-family: '${font}'`);

          select.appendChild(option);
        }

        select.className = 'medium-editor-toolbar-select';
        form.appendChild(select);

        // Handle typing in the textbox
        this.on(select, 'change', this.handleFontChange.bind(this));

        return form;
      },

      getSelect: function () {
        return this.getForm().querySelector('select.medium-editor-toolbar-select');
      },

      handleFontChange: function () {
        var font = this.getSelect().value;
        let index = this.fonts.indexOf(font);
        Store.dispatch(fontFaceChange(index));
        this.execAction('fontName', { name: font });
      },

      handleFormClick: function (event) {
        // make sure not to hide form when clicking inside the form
        event.stopPropagation();
      },
    });
  }
}
