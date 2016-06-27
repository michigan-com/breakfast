'use strict';

import MediumEditor from 'medium-editor';

import Store from '../../../store';
import { fontColorChange } from '../../../actions/font';

export default class FontColorSelector {
  constructor(fonts) {
    this.fonts = fonts;

    // Extending https://github.com/yabwe/medium-editor/blob/master/src/js/extensions/fontname.js
    this.Extension = MediumEditor.extensions.form.extend({

      name: 'fontcolor',
      action: 'fontcace',
      aria: 'Change Font Color',
      contentDefault: '&#xB1;', // ±
      contentFA: '<i class="fa fa-paint-brush"></i>',

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
      },

      showForm() {
        this.base.saveSelection();
        this.hideToolbarDefaultActions();
        this.getForm().style.display = 'block';
        this.setToolbarPosition();

        const options = Store.getState();
        this.getForm().className = this.getFormClassName(options.Font.fontColor);
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
        const options = Store.getState();

        // Font Name Form (div)
        form.className = this.getFormClassName(options.fontColor);
        form.id = `medium-editor-toolbar-form-fontname-${this.getEditorId()}`;

        // Handle clicks on the form itself
        this.on(form, 'click', this.handleFormClick.bind(this));

        const colors = ['black', 'white'];
        for (const color of colors) {
          const colorEl = doc.createElement('div');
          colorEl.className = `font-color-option ${color}`;
          this.on(colorEl, 'click', this.colorChangeCallback(color));

          form.appendChild(colorEl);
        }

        return form;
      },

      getFormClassName(color) {
        return `medium-editor-toolbar-form color-picker ${color}`;
      },

      getColorEl(color) {
        return this.getForm().querySelector(`.font-color-option.${color}`);
      },

      getSelect() {
        return this.getForm().querySelector('select.medium-editor-toolbar-select');
      },

      colorChangeCallback(c) {
        const color = c;
        return () => {
          this.getForm().className = this.getFormClassName(color);
          Store.dispatch(fontColorChange(color));
        };
      },

      handleFormClick(event) {
        // make sure not to hide form when clicking inside the form
        event.stopPropagation();
      },
    });
  }
}
