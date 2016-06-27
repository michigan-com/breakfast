'use strict';

import MediumEditor from 'medium-editor';

import Store from '../../../store';
import { fontFaceChange } from '../../../actions/font';

export default class FontFaceSelector {
  constructor(fonts) {
    this.fonts = fonts;

    // Extending https://github.com/yabwe/medium-editor/blob/master/src/js/extensions/fontname.js
    this.Extension = MediumEditor.extensions.form.extend({

      name: 'fontface',
      action: 'fontFace',
      aria: 'Change Font Face',
      contentDefault: '&#xB1;', // ±
      contentFA: '<i class="fa fa-font"></i>',

      fonts: this.fonts,

      init(...args) {
        MediumEditor.extensions.form.prototype.init.apply(this, args);
      },

      // Called when the button the toolbar is clicked
      // Overrides ButtonExtension.handleClick
      handleClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.isDisplayed()) {
          // Get FontName of current selection (convert to string since IE returns this as number)
          const options = Store.getState();
          this.showForm(options.Font.fontFace);
        }

        return false;
      },

      // Called by medium-editor to append form to the toolbar
      getForm() {
        if (!this.form) {
          this.form = this.createForm();
        }
        return this.form;
      },

      // Used by medium-editor when the default toolbar is to be displayed
      isDisplayed() {
        return this.getForm().style.display === 'block';
      },

      hideForm() {
        this.getForm().style.display = 'none';
        this.getSelect().value = '';
      },

      showForm(fontName) {
        const select = this.getSelect();

        this.base.saveSelection();
        this.hideToolbarDefaultActions();
        this.getForm().style.display = 'block';
        this.setToolbarPosition();

        select.value = fontName || '';
        select.focus();
      },

      // Called by core when tearing down medium-editor (destroy)
      destroy() {
        if (!this.form) {
          return false;
        }

        if (this.form.parentNode) {
          this.form.parentNode.removeChild(this.form);
        }

        delete this.form;
        return true;
      },

      // core methods

      doFormSave() {
        this.base.restoreSelection();
        this.base.checkSelection();
      },

      doFormCancel() {
        this.base.restoreSelection();
        this.base.checkSelection();
      },

      // form creation and event handling
      createForm() {
        const doc = this.document;
        const form = doc.createElement('div');
        const select = doc.createElement('select');

        // Font Name Form (div)
        form.className = 'medium-editor-toolbar-form';
        form.id = `medium-editor-toolbar-form-fontname-${this.getEditorId()}`;

        // Handle clicks on the form itself
        this.on(form, 'click', this.handleFormClick.bind(this));

        // Add font names
        for (const font of this.fonts) {
          const option = doc.createElement('option');
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

      getSelect() {
        return this.getForm().querySelector('select.medium-editor-toolbar-select');
      },

      handleFontChange() {
        const font = this.getSelect().value;
        Store.dispatch(fontFaceChange(font));
        // this.execAction('fontName', { name: font });
      },

      handleFormClick(event) {
        // make sure not to hide form when clicking inside the form
        event.stopPropagation();
      },
    });
  }
}
