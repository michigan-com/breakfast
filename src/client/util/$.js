import { $ } from 'domtastic/commonjs/selector';
import { on, off } from 'domtastic/commonjs/event';
import { val } from 'domtastic/commonjs/dom/extra';
import { addClass, hasClass, removeClass, toggleClass } from 'domtastic/commonjs/dom/class';
import { html } from 'domtastic/commonjs/dom/html';

$.fn = { on, off, val, addClass, hasClass, removeClass, toggleClass, html };

module.exports = $;

