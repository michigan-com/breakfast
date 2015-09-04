import assign from 'object-assign';

class Field {
  /**
   * Create a field to be rendered in HTML via the renderInput mixin (see
   * views/util/form.jade)
   *
   * @param {Object} opts - Options to be rendered. Possible options
   *    opts.type {String} - (Optional) Type attribute of <input> tag that will
   *        be rendered. Default="text"
   *    opts.name {String} - Name attribute of <input>
   *    opts.errors {Array} - (Optional) Array of errors from a previously-submitted
   *        form. Default=[]
   *    opts.value {String} - (Optional) Value to be displayed in the <input>.
   *        Default=''
   *    opts.placeholder {String} - (Optional) Placeholder attribute for the
   *        <input>. Default=opts.name.toTitleCase()
   *    opts.label {String} - (Optional) Text label explaining the field. Default=opts.name
   *    opts.classes {Array} - (Optional) Array of classes to add to the containing form
   *        field
   */
  constructor(opts) {
    let defaultOptions = {
      type: 'text',
      errors: [],
      label: opts.name,
      value: '',
      placeholder: opts.name,
      classes: []
    };

    this.options = assign({}, defaultOptions, opts);

    // Deal with class strings
    if (this.options.classes.indexOf('form-field') < 0) {
      this.options.classes.push('form-field');
    }
    if (this.options.type === 'hidden') {
      this.options.classes.push('hidden');
    }

    this.options.classString = this.options.classes.join(' ');
  }
}

module.exports = {
  Field
}
