(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],2:[function(require,module,exports){
/**
 * @module Class
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

/**
 * Add a class to the element(s)
 *
 * @param {String} value Space-separated class name(s) to add to the element(s).
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').addClass('bar');
 *     $('.item').addClass('bar foo');
 */

function addClass(value) {
    if (value && value.length) {
        _util.each(value.split(' '), _each.bind(this, 'add'));
    }
    return this;
}

/**
 * Remove a class from the element(s)
 *
 * @param {String} value Space-separated class name(s) to remove from the element(s).
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').removeClass('bar');
 *     $('.items').removeClass('bar foo');
 */

function removeClass(value) {
    if (value && value.length) {
        _util.each(value.split(' '), _each.bind(this, 'remove'));
    }
    return this;
}

/**
 * Toggle a class at the element(s)
 *
 * @param {String} value Space-separated class name(s) to toggle at the element(s).
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').toggleClass('bar');
 *     $('.item').toggleClass('bar foo');
 */

function toggleClass(value) {
    if (value && value.length) {
        _util.each(value.split(' '), _each.bind(this, 'toggle'));
    }
    return this;
}

/**
 * Check if the element(s) have a class.
 *
 * @param {String} value Check if the DOM element contains the class name. When applied to multiple elements,
 * returns `true` if _any_ of them contains the class name.
 * @return {Boolean} Whether the element's class attribute contains the class name.
 * @example
 *     $('.item').hasClass('bar');
 */

function hasClass(value) {
    return (this.nodeType ? [this] : this).some(function (element) {
        return element.classList.contains(value);
    });
}

/**
 * Specialized iteration, applying `fn` of the classList API to each element.
 *
 * @param {String} fnName
 * @param {String} className
 * @private
 */

function _each(fnName, className) {
    _util.each(this, function (element) {
        return element.classList[fnName](className);
    });
}

/*
 * Export interface
 */

exports.addClass = addClass;
exports.removeClass = removeClass;
exports.toggleClass = toggleClass;
exports.hasClass = hasClass;
},{"../util":9}],3:[function(require,module,exports){
/**
 * @module DOM (extra)
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var _index = require('./index');

var _selectorIndex = require('../selector/index');

/**
 * Append each element in the collection to the specified element(s).
 *
 * @param {Node|NodeList|Object} element What to append the element(s) to. Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').appendTo(container);
 */

function appendTo(element) {
    var context = typeof element === 'string' ? _selectorIndex.$(element) : element;
    _index.append.call(context, this);
    return this;
}

/*
 * Empty each element in the collection.
 *
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').empty();
 */

function empty() {
    return _util.each(this, function (element) {
        return element.innerHTML = '';
    });
}

/**
 * Remove the collection from the DOM.
 *
 * @return {Array} Array containing the removed elements
 * @example
 *     $('.item').remove();
 */

function remove() {
    return _util.each(this, function (element) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });
}

/**
 * Replace each element in the collection with the provided new content, and return the array of elements that were replaced.
 *
 * @return {Array} Array containing the replaced elements
 */

function replaceWith() {
    return _index.before.apply(this, arguments).remove();
}

/**
 * Get the `textContent` from the first, or set the `textContent` of each element in the collection.
 *
 * @param {String} [value]
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').text('New content');
 */

function text(value) {

    if (value === undefined) {
        return this[0].textContent;
    }

    _util.each(this, function (element) {
        return element.textContent = '' + value;
    });

    return this;
}

/**
 * Get the `value` from the first, or set the `value` of each element in the collection.
 *
 * @param {String} [value]
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('input.firstName').value('New value');
 */

function val(value) {

    if (value === undefined) {
        return this[0].value;
    }

    _util.each(this, function (element) {
        return element.value = value;
    });

    return this;
}

/*
 * Export interface
 */

exports.appendTo = appendTo;
exports.empty = empty;
exports.remove = remove;
exports.replaceWith = replaceWith;
exports.text = text;
exports.val = val;
},{"../selector/index":8,"../util":9,"./index":5}],4:[function(require,module,exports){
/**
 * @module HTML
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

/*
 * Get the HTML contents of the first element, or set the HTML contents for each element in the collection.
 *
 * @param {String} [fragment] HTML fragment to set for the element. If this argument is omitted, the HTML contents are returned.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').html();
 *     $('.item').html('<span>more</span>');
 */

function html(fragment) {

  if (typeof fragment !== 'string') {
    var element = this.nodeType ? this : this[0];
    return element ? element.innerHTML : undefined;
  }

  _util.each(this, function (element) {
    return element.innerHTML = fragment;
  });

  return this;
}

/*
 * Export interface
 */

exports.html = html;
},{"../util":9}],5:[function(require,module,exports){
/**
 * @module DOM
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var _selectorIndex = require('../selector/index');

var forEach = Array.prototype.forEach;

/**
 * Append element(s) to each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to append to the element(s).
 * Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').append('<p>more</p>');
 */

function append(element) {
    if (this instanceof Node) {
        if (typeof element === 'string') {
            this.insertAdjacentHTML('beforeend', element);
        } else {
            if (element instanceof Node) {
                this.appendChild(element);
            } else {
                var elements = element instanceof NodeList ? _util.toArray(element) : element;
                forEach.call(elements, this.appendChild.bind(this));
            }
        }
    } else {
        _each(this, append, element);
    }
    return this;
}

/**
 * Place element(s) at the beginning of each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to place at the beginning of the element(s).
 * Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').prepend('<span>start</span>');
 */

function prepend(element) {
    if (this instanceof Node) {
        if (typeof element === 'string') {
            this.insertAdjacentHTML('afterbegin', element);
        } else {
            if (element instanceof Node) {
                this.insertBefore(element, this.firstChild);
            } else {
                var elements = element instanceof NodeList ? _util.toArray(element) : element;
                forEach.call(elements.reverse(), prepend.bind(this));
            }
        }
    } else {
        _each(this, prepend, element);
    }
    return this;
}

/**
 * Place element(s) before each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to place as sibling(s) before to the element(s).
 * Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').before('<p>prefix</p>');
 */

function before(element) {
    if (this instanceof Node) {
        if (typeof element === 'string') {
            this.insertAdjacentHTML('beforebegin', element);
        } else {
            if (element instanceof Node) {
                this.parentNode.insertBefore(element, this);
            } else {
                var elements = element instanceof NodeList ? _util.toArray(element) : element;
                forEach.call(elements, before.bind(this));
            }
        }
    } else {
        _each(this, before, element);
    }
    return this;
}

/**
 * Place element(s) after each element in the collection.
 *
 * @param {String|Node|NodeList|Object} element What to place as sibling(s) after to the element(s). Clones elements as necessary.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.items').after('<span>suf</span><span>fix</span>');
 */

function after(element) {
    if (this instanceof Node) {
        if (typeof element === 'string') {
            this.insertAdjacentHTML('afterend', element);
        } else {
            if (element instanceof Node) {
                this.parentNode.insertBefore(element, this.nextSibling);
            } else {
                var elements = element instanceof NodeList ? _util.toArray(element) : element;
                forEach.call(elements.reverse(), after.bind(this));
            }
        }
    } else {
        _each(this, after, element);
    }
    return this;
}

/**
 * Clone a wrapped object.
 *
 * @return {Object} Wrapped collection of cloned nodes.
 * @example
 *     $(element).clone();
 */

function clone() {
    return _selectorIndex.$(_clone(this));
}

/**
 * Clone an object
 *
 * @param {String|Node|NodeList|Array} element The element(s) to clone.
 * @return {String|Node|NodeList|Array} The cloned element(s)
 * @private
 */

function _clone(element) {
    if (typeof element === 'string') {
        return element;
    } else if (element instanceof Node) {
        return element.cloneNode(true);
    } else if ('length' in element) {
        return [].map.call(element, function (el) {
            return el.cloneNode(true);
        });
    }
    return element;
}

/**
 * Specialized iteration, applying `fn` in reversed manner to a clone of each element, but the provided one.
 *
 * @param {NodeList|Array} collection
 * @param {Function} fn
 * @param {Node} element
 * @private
 */

function _each(collection, fn, element) {
    var l = collection.length;
    while (l--) {
        var elm = l === 0 ? element : _clone(element);
        fn.call(collection[l], elm);
    }
}

/*
 * Export interface
 */

exports.append = append;
exports.prepend = prepend;
exports.before = before;
exports.after = after;
exports.clone = clone;
},{"../selector/index":8,"../util":9}],6:[function(require,module,exports){
/**
 * @module Events
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var _selectorClosest = require('../selector/closest');

/**
 * Shorthand for `addEventListener`. Supports event delegation if a filter (`selector`) is provided.
 *
 * @param {String} eventNames List of space-separated event types to be added to the element(s)
 * @param {String} [selector] Selector to filter descendants that delegate the event to this element.
 * @param {Function} handler Event handler
 * @param {Boolean} useCapture=false
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').on('click', callback);
 *     $('.container').on('click focus', '.item', handler);
 */

function on(eventNames, selector, handler, useCapture) {
    var _this = this;

    if (typeof selector === 'function') {
        handler = selector;
        selector = null;
    }

    var parts = undefined,
        namespace = undefined,
        eventListener = undefined;

    eventNames.split(' ').forEach(function (eventName) {

        parts = eventName.split('.');
        eventName = parts[0] || null;
        namespace = parts[1] || null;

        eventListener = proxyHandler(handler);

        _util.each(_this, function (element) {

            if (selector) {
                eventListener = delegateHandler.bind(element, selector, eventListener);
            }

            element.addEventListener(eventName, eventListener, useCapture || false);

            getHandlers(element).push({
                eventName: eventName,
                handler: handler,
                eventListener: eventListener,
                selector: selector,
                namespace: namespace
            });
        });
    }, this);

    return this;
}

/**
 * Shorthand for `removeEventListener`.
 *
 * @param {String} eventNames List of space-separated event types to be removed from the element(s)
 * @param {String} [selector] Selector to filter descendants that undelegate the event to this element.
 * @param {Function} handler Event handler
 * @param {Boolean} useCapture=false
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     $('.item').off('click', callback);
 *     $('#my-element').off('myEvent myOtherEvent');
 *     $('.item').off();
 */

function off(eventNames, selector, handler, useCapture) {
    if (eventNames === undefined) eventNames = '';

    var _this2 = this;

    if (typeof selector === 'function') {
        handler = selector;
        selector = null;
    }

    var parts = undefined,
        namespace = undefined,
        handlers = undefined;

    eventNames.split(' ').forEach(function (eventName) {

        parts = eventName.split('.');
        eventName = parts[0] || null;
        namespace = parts[1] || null;

        _util.each(_this2, function (element) {

            handlers = getHandlers(element);

            _util.each(handlers.filter(function (item) {
                return (!eventName || item.eventName === eventName) && (!namespace || item.namespace === namespace) && (!handler || item.handler === handler) && (!selector || item.selector === selector);
            }), function (item) {
                element.removeEventListener(item.eventName, item.eventListener, useCapture || false);
                handlers.splice(handlers.indexOf(item), 1);
            });

            if (!eventName && !namespace && !selector && !handler) {
                clearHandlers(element);
            } else if (handlers.length === 0) {
                clearHandlers(element);
            }
        });
    }, this);

    return this;
}

/**
 * Get event handlers from an element
 *
 * @private
 * @param {Node} element
 * @return {Array}
 */

var eventKeyProp = '__domtastic_event__';
var id = 1;
var handlers = {};
var unusedKeys = [];

function getHandlers(element) {
    if (!element[eventKeyProp]) {
        element[eventKeyProp] = unusedKeys.length === 0 ? ++id : unusedKeys.pop();
    }
    var key = element[eventKeyProp];
    return handlers[key] || (handlers[key] = []);
}

/**
 * Clear event handlers for an element
 *
 * @private
 * @param {Node} element
 */

function clearHandlers(element) {
    var key = element[eventKeyProp];
    if (handlers[key]) {
        handlers[key] = null;
        element[key] = null;
        unusedKeys.push(key);
    }
}

/**
 * Function to create a handler that augments the event object with some extra methods,
 * and executes the callback with the event and the event data (i.e. `event.detail`).
 *
 * @private
 * @param handler Callback to execute as `handler(event, data)`
 * @return {Function}
 */

function proxyHandler(handler) {
    return function (event) {
        handler.call(this, augmentEvent(event), event.detail);
    };
}

/**
 * Attempt to augment events and implement something closer to DOM Level 3 Events.
 *
 * @private
 * @param {Object} event
 * @return {Function}
 */

var augmentEvent = (function () {

    var methodName = undefined,
        eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
    },
        returnTrue = function returnTrue() {
        return true;
    },
        returnFalse = function returnFalse() {
        return false;
    };

    return function (event) {
        if (!event.isDefaultPrevented || event.stopImmediatePropagation || event.stopPropagation) {
            for (methodName in eventMethods) {
                (function (methodName, testMethodName, originalMethod) {
                    event[methodName] = function () {
                        this[testMethodName] = returnTrue;
                        return originalMethod && originalMethod.apply(this, arguments);
                    };
                    event[testMethodName] = returnFalse;
                })(methodName, eventMethods[methodName], event[methodName]);
            }
            if (event._preventDefault) {
                event.preventDefault();
            }
        }
        return event;
    };
})();

/**
 * Function to test whether delegated events match the provided `selector` (filter),
 * if the event propagation was stopped, and then actually call the provided event handler.
 * Use `this` instead of `event.currentTarget` on the event object.
 *
 * @private
 * @param {String} selector Selector to filter descendants that undelegate the event to this element.
 * @param {Function} handler Event handler
 * @param {Event} event
 */

function delegateHandler(selector, handler, event) {
    var eventTarget = event._target || event.target,
        currentTarget = _selectorClosest.closest.call([eventTarget], selector, this)[0];
    if (currentTarget && currentTarget !== this) {
        if (currentTarget === eventTarget || !(event.isPropagationStopped && event.isPropagationStopped())) {
            handler.call(currentTarget, event);
        }
    }
}

var bind = on,
    unbind = off;

/*
 * Export interface
 */

exports.on = on;
exports.off = off;
exports.bind = bind;
exports.unbind = unbind;
},{"../selector/closest":7,"../util":9}],7:[function(require,module,exports){
/**
 * @module closest
 */

'use strict';

exports.__esModule = true;

var _index = require('./index');

var _util = require('../util');

/**
 * Return the closest element matching the selector (starting by itself) for each element in the collection.
 *
 * @param {String} selector Filter
 * @param {Object} [context] If provided, matching elements must be a descendant of this element
 * @return {Object} New wrapped collection (containing zero or one element)
 * @chainable
 * @example
 *     $('.selector').closest('.container');
 */

var closest = (function () {

    function closest(selector, context) {
        var nodes = [];
        _util.each(this, function (node) {
            while (node && node !== context) {
                if (_index.matches(node, selector)) {
                    nodes.push(node);
                    break;
                }
                node = node.parentElement;
            }
        });
        return _index.$(_util.uniq(nodes));
    }

    return !Element.prototype.closest ? closest : function (selector, context) {
        var _this = this;

        if (!context) {
            var _ret = (function () {
                var nodes = [];
                _util.each(_this, function (node) {
                    var n = node.closest(selector);
                    if (n) {
                        nodes.push(n);
                    }
                });
                return {
                    v: _index.$(_util.uniq(nodes))
                };
            })();

            if (typeof _ret === 'object') return _ret.v;
        } else {
            return closest.call(this, selector, context);
        }
    };
})();

/*
 * Export interface
 */

exports.closest = closest;
},{"../util":9,"./index":8}],8:[function(require,module,exports){
/**
 * @module Selector
 */

'use strict';

exports.__esModule = true;

var _util = require('../util');

var isPrototypeSet = false;

var reFragment = /^\s*<(\w+|!)[^>]*>/,
    reSingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    reSimpleSelector = /^[\.#]?[\w-]*$/;

/*
 * Versatile wrapper for `querySelectorAll`.
 *
 * @param {String|Node|NodeList|Array} selector Query selector, `Node`, `NodeList`, array of elements, or HTML fragment string.
 * @param {String|Node|NodeList} context=document The context for the selector to query elements.
 * @return {Object} The wrapped collection
 * @chainable
 * @example
 *     var $items = $(.items');
 * @example
 *     var $element = $(domElement);
 * @example
 *     var $list = $(nodeList, document.body);
 * @example
 *     var $element = $('<p>evergreen</p>');
 */

function $(selector) {
    var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

    var collection = undefined;

    if (!selector) {

        collection = document.querySelectorAll(null);
    } else if (selector instanceof Wrapper) {

        return selector;
    } else if (typeof selector !== 'string') {

        collection = selector.nodeType || selector === window ? [selector] : selector;
    } else if (reFragment.test(selector)) {

        collection = createFragment(selector);
    } else {

        context = typeof context === 'string' ? document.querySelector(context) : context.length ? context[0] : context;

        collection = querySelector(selector, context);
    }

    return wrap(collection);
}

/*
 * Find descendants matching the provided `selector` for each element in the collection.
 *
 * @param {String|Node|NodeList|Array} selector Query selector, `Node`, `NodeList`, array of elements, or HTML fragment string.
 * @return {Object} The wrapped collection
 * @example
 *     $('.selector').find('.deep').$('.deepest');
 */

function find(selector) {
    var nodes = [];
    _util.each(this, function (node) {
        _util.each(querySelector(selector, node), function (child) {
            if (nodes.indexOf(child) === -1) {
                nodes.push(child);
            }
        });
    });
    return $(nodes);
}

/*
 * Returns `true` if the element would be selected by the specified selector string; otherwise, returns `false`.
 *
 * @param {Node} element Element to test
 * @param {String} selector Selector to match against element
 * @return {Boolean}
 *
 * @example
 *     $.matches(element, '.match');
 */

var matches = (function () {
    var context = typeof Element !== 'undefined' ? Element.prototype : _util.global,
        _matches = context.matches || context.matchesSelector || context.mozMatchesSelector || context.msMatchesSelector || context.oMatchesSelector || context.webkitMatchesSelector;
    return function (element, selector) {
        return _matches.call(element, selector);
    };
})();

/*
 * Use the faster `getElementById`, `getElementsByClassName` or `getElementsByTagName` over `querySelectorAll` if possible.
 *
 * @private
 * @param {String} selector Query selector.
 * @param {Node} context The context for the selector to query elements.
 * @return {Object} NodeList, HTMLCollection, or Array of matching elements (depending on method used).
 */

function querySelector(selector, context) {

    var isSimpleSelector = reSimpleSelector.test(selector);

    if (isSimpleSelector) {
        if (selector[0] === '#') {
            var element = (context.getElementById ? context : document).getElementById(selector.slice(1));
            return element ? [element] : [];
        }
        if (selector[0] === '.') {
            return context.getElementsByClassName(selector.slice(1));
        }
        return context.getElementsByTagName(selector);
    }

    return context.querySelectorAll(selector);
}

/*
 * Create DOM fragment from an HTML string
 *
 * @private
 * @param {String} html String representing HTML.
 * @return {NodeList}
 */

function createFragment(html) {

    if (reSingleTag.test(html)) {
        return [document.createElement(RegExp.$1)];
    }

    var elements = [],
        container = document.createElement('div'),
        children = container.childNodes;

    container.innerHTML = html;

    for (var i = 0, l = children.length; i < l; i++) {
        elements.push(children[i]);
    }

    return elements;
}

/*
 * Calling `$(selector)` returns a wrapped collection of elements.
 *
 * @private
 * @param {NodeList|Array} collection Element(s) to wrap.
 * @return (Object) The wrapped collection
 */

function wrap(collection) {

    if (!isPrototypeSet) {
        Wrapper.prototype = $.fn;
        Wrapper.prototype.constructor = Wrapper;
        isPrototypeSet = true;
    }

    return new Wrapper(collection);
}

/*
 * Constructor for the Object.prototype strategy
 *
 * @constructor
 * @private
 * @param {NodeList|Array} collection Element(s) to wrap.
 */

function Wrapper(collection) {
    var i = 0,
        length = collection.length;
    for (; i < length;) {
        this[i] = collection[i++];
    }
    this.length = length;
}

/*
 * Export interface
 */

exports.$ = $;
exports.find = find;
exports.matches = matches;
exports.Wrapper = Wrapper;
},{"../util":9}],9:[function(require,module,exports){
/*
 * @module Util
 */

/*
 * Reference to the global scope
 * @private
 */

"use strict";

exports.__esModule = true;
var global = new Function("return this")();

/**
 * Convert `NodeList` to `Array`.
 *
 * @param {NodeList|Array} collection
 * @return {Array}
 * @private
 */

function toArray(collection) {
    var length = collection.length,
        result = new Array(length);
    for (var i = 0; i < length; i++) {
        result[i] = collection[i];
    }
    return result;
}

/**
 * Faster alternative to [].forEach method
 *
 * @param {Node|NodeList|Array} collection
 * @param {Function} callback
 * @return {Node|NodeList|Array}
 * @private
 */

function each(collection, callback, thisArg) {
    var length = collection.length;
    if (length !== undefined && collection.nodeType === undefined) {
        for (var i = 0; i < length; i++) {
            callback.call(thisArg, collection[i], i, collection);
        }
    } else {
        callback.call(thisArg, collection, 0, collection);
    }
    return collection;
}

/**
 * Assign enumerable properties from source object(s) to target object
 *
 * @method extend
 * @param {Object} target Object to extend
 * @param {Object} [source] Object to extend from
 * @return {Object} Extended object
 * @example
 *     $.extend({a: 1}, {b: 2});
 *     // {a: 1, b: 2}
 * @example
 *     $.extend({a: 1}, {b: 2}, {a: 3});
 *     // {a: 3, b: 2}
 */

function extend(target) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
    }

    sources.forEach(function (src) {
        for (var prop in src) {
            target[prop] = src[prop];
        }
    });
    return target;
}

/**
 * Return the collection without duplicates
 *
 * @param collection Collection to remove duplicates from
 * @return {Node|NodeList|Array}
 * @private
 */

function uniq(collection) {
    return collection.filter(function (item, index) {
        return collection.indexOf(item) === index;
    });
}

/*
 * Export interface
 */

exports.global = global;
exports.toArray = toArray;
exports.each = each;
exports.extend = extend;
exports.uniq = uniq;
},{}],10:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.xr = mod.exports;
  }
})(this, function (exports, module) {
  /**
   * xr (c) James Cleveland 2015
   * URL: https://github.com/radiosilence/xr
   * License: BSD
   */

  'use strict';

  var Methods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    OPTIONS: 'OPTIONS'
  };

  var Events = {
    READY_STATE_CHANGE: 'readystatechange',
    LOAD_START: 'loadstart',
    PROGRESS: 'progress',
    ABORT: 'abort',
    ERROR: 'error',
    LOAD: 'load',
    TIMEOUT: 'timeout',
    LOAD_END: 'loadend'
  };

  var defaults = {
    method: Methods.GET,
    data: undefined,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    dump: JSON.stringify,
    load: JSON.parse,
    xmlHttpRequest: function xmlHttpRequest() {
      return new XMLHttpRequest();
    },
    promise: function promise(fn) {
      return new Promise(fn);
    }
  };

  function res(xhr) {
    return {
      status: xhr.status,
      response: xhr.response,
      xhr: xhr
    };
  }

  function assign(l) {
    for (var _len = arguments.length, rs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rs[_key - 1] = arguments[_key];
    }

    for (var i in rs) {
      if (!({}).hasOwnProperty.call(rs, i)) continue;
      var r = rs[i];
      if (typeof r !== 'object') continue;
      for (var k in r) {
        if (!({}).hasOwnProperty.call(r, k)) continue;
        l[k] = r[k];
      }
    }
    return l;
  }

  function urlEncode(params) {
    var paramStrings = [];
    for (var k in params) {
      if (!({}).hasOwnProperty.call(params, k)) continue;
      paramStrings.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
    }
    return paramStrings.join('&');
  }

  var config = {};

  function configure(opts) {
    config = assign({}, config, opts);
  }

  function promise(args, fn) {
    return (args && args.promise ? args.promise : config.promise || defaults.promise)(fn);
  }

  function xr(args) {
    return promise(args, function (resolve, reject) {
      var opts = assign({}, defaults, config, args);
      var xhr = opts.xmlHttpRequest();

      xhr.open(opts.method, opts.params ? opts.url.split('?')[0] + '?' + urlEncode(opts.params) : opts.url, true);

      xhr.addEventListener(Events.LOAD, function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          var _data = null;
          if (xhr.responseText) {
            _data = opts.raw === true ? xhr.responseText : opts.load(xhr.responseText);
          }
          resolve(_data);
        } else {
          reject(res(xhr));
        }
      });

      xhr.addEventListener(Events.ABORT, function () {
        return reject(res(xhr));
      });
      xhr.addEventListener(Events.ERROR, function () {
        return reject(res(xhr));
      });
      xhr.addEventListener(Events.TIMEOUT, function () {
        return reject(res(xhr));
      });

      for (var k in opts.headers) {
        if (!({}).hasOwnProperty.call(opts.headers, k)) continue;
        xhr.setRequestHeader(k, opts.headers[k]);
      }

      for (var k in opts.events) {
        if (!({}).hasOwnProperty.call(opts.events, k)) continue;
        xhr.addEventListener(k, opts.events[k].bind(null, xhr), false);
      }

      var data = typeof opts.data === 'object' && !opts.raw ? opts.dump(opts.data) : opts.data;

      if (data !== undefined) xhr.send(data);else xhr.send();
    });
  }

  xr.assign = assign;
  xr.urlEncode = urlEncode;
  xr.configure = configure;
  xr.Methods = Methods;
  xr.Events = Events;
  xr.defaults = defaults;

  xr.get = function (url, params, args) {
    return xr(assign({ url: url, method: Methods.GET, params: params }, args));
  };
  xr.put = function (url, data, args) {
    return xr(assign({ url: url, method: Methods.PUT, data: data }, args));
  };
  xr.post = function (url, data, args) {
    return xr(assign({ url: url, method: Methods.POST, data: data }, args));
  };
  xr.patch = function (url, data, args) {
    return xr(assign({ url: url, method: Methods.PATCH, data: data }, args));
  };
  xr.del = function (url, args) {
    return xr(assign({ url: url, method: Methods.DELETE }, args));
  };
  xr.options = function (url, args) {
    return xr(assign({ url: url, method: Methods.OPTIONS }, args));
  };

  module.exports = xr;
});

},{}],11:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _util$ = require('./util/$');

var _util$2 = _interopRequireDefault(_util$);

var _xr = require('xr');

var _xr2 = _interopRequireDefault(_xr);

(0, _util$2['default'])('form.register-form').on('submit', function (e) {

  e.preventDefault();
  e.stopPropagation();

  // Get the values from the form input
  var _csrf = (0, _util$2['default'])('.form-field._csrf input').val();
  var username = (0, _util$2['default'])('.form-field.username input').val();
  var selectedIndex = (0, _util$2['default'])('#domains')[0].selectedIndex;
  var domain = (0, _util$2['default'])((0, _util$2['default'])('#domains option')[selectedIndex]).val();
  var email = username + '@' + domain;
  var values = {
    _csrf: _csrf,
    email: email
  };

  if (!username) {
    (0, _util$2['default'])('.form-field.username').removeClass('error').addClass('error');
    (0, _util$2['default'])('.form-field.username .errors').html('<p>Please specify a username</p>');
    return;
  }

  _xr2['default'].post('/register/', values).then(function (resp) {
    window.location = '/register/email-sent/' + email + '/';
  }, function (resp) {
    var response = JSON.parse(resp.response);

    for (var error in response.error) {
      var errorString = response.error[error];

      if (error === 'email') {
        error = 'username';
      }

      (0, _util$2['default'])('.form-field.' + error).removeClass('error').addClass('error');
      (0, _util$2['default'])('.form-field.' + error + ' .errors').html('<p>' + errorString + '</p>');
    }
  });
});


},{"./util/$":12,"babel-runtime/helpers/interop-require-default":1,"xr":10}],12:[function(require,module,exports){
'use strict';

var _domtasticCommonjsSelector = require('domtastic/commonjs/selector');

var _domtasticCommonjsEvent = require('domtastic/commonjs/event');

var _domtasticCommonjsDomExtra = require('domtastic/commonjs/dom/extra');

var _domtasticCommonjsDomClass = require('domtastic/commonjs/dom/class');

var _domtasticCommonjsDomHtml = require('domtastic/commonjs/dom/html');

_domtasticCommonjsSelector.$.fn = { on: _domtasticCommonjsEvent.on, off: _domtasticCommonjsEvent.off, val: _domtasticCommonjsDomExtra.val, addClass: _domtasticCommonjsDomClass.addClass, hasClass: _domtasticCommonjsDomClass.hasClass, removeClass: _domtasticCommonjsDomClass.removeClass, toggleClass: _domtasticCommonjsDomClass.toggleClass, html: _domtasticCommonjsDomHtml.html };

module.exports = _domtasticCommonjsSelector.$;


},{"domtastic/commonjs/dom/class":2,"domtastic/commonjs/dom/extra":3,"domtastic/commonjs/dom/html":4,"domtastic/commonjs/event":6,"domtastic/commonjs/selector":8}]},{},[11])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2ludGVyb3AtcmVxdWlyZS1kZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL2RvbXRhc3RpYy9jb21tb25qcy9kb20vY2xhc3MuanMiLCJub2RlX21vZHVsZXMvZG9tdGFzdGljL2NvbW1vbmpzL2RvbS9leHRyYS5qcyIsIm5vZGVfbW9kdWxlcy9kb210YXN0aWMvY29tbW9uanMvZG9tL2h0bWwuanMiLCJub2RlX21vZHVsZXMvZG9tdGFzdGljL2NvbW1vbmpzL2RvbS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb210YXN0aWMvY29tbW9uanMvZXZlbnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tdGFzdGljL2NvbW1vbmpzL3NlbGVjdG9yL2Nsb3Nlc3QuanMiLCJub2RlX21vZHVsZXMvZG9tdGFzdGljL2NvbW1vbmpzL3NlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RvbXRhc3RpYy9jb21tb25qcy91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3hyL3hyLmpzIiwiL1VzZXJzL21pZ3JldmEvd29yay9icmVha2Zhc3Qvc3JjL2NsaWVudC9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9taWdyZXZhL3dvcmsvYnJlYWtmYXN0L3NyYy9jbGllbnQvdXRpbC8kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0EsWUFBWSxDQUFDOztBQUViLElBQUksc0JBQXNCLEdBQUcsT0FBTyxDQUFDLCtDQUErQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWpHLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFakMsSUFBSSxPQUFPLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTdDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFeEIsSUFBSSxJQUFJLEdBQUcsc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXZDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLEVBQUU7O0VBRXRFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNyQixFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN0Qjs7RUFFRSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUseUJBQXlCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztFQUNyRSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsNEJBQTRCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztFQUMzRSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO0VBQ3pFLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0VBQ3RHLElBQUksS0FBSyxHQUFHLFFBQVEsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDO0VBQ3BDLElBQUksTUFBTSxHQUFHO0lBQ1gsS0FBSyxFQUFFLEtBQUs7SUFDWixLQUFLLEVBQUUsS0FBSztBQUNoQixHQUFHLENBQUM7O0VBRUYsSUFBSSxDQUFDLFFBQVEsRUFBRTtJQUNiLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkYsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLDhCQUE4QixDQUFDLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDakcsT0FBTztBQUNYLEdBQUc7O0VBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFO0lBQzlELE1BQU0sQ0FBQyxRQUFRLEdBQUcsdUJBQXVCLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztHQUN6RCxFQUFFLFVBQVUsSUFBSSxFQUFFO0FBQ3JCLElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0lBRXpDLEtBQUssSUFBSSxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtBQUN0QyxNQUFNLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7O01BRXhDLElBQUksS0FBSyxLQUFLLE9BQU8sRUFBRTtRQUNyQixLQUFLLEdBQUcsVUFBVSxDQUFDO0FBQzNCLE9BQU87O01BRUQsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO01BQ3ZGLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxjQUFjLEdBQUcsS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0tBQ2pHO0dBQ0YsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDO0FBQ0g7OztBQ25EQSxZQUFZLENBQUM7O0FBRWIsSUFBSSwwQkFBMEIsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFeEUsSUFBSSx1QkFBdUIsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFbEUsSUFBSSwwQkFBMEIsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7QUFFekUsSUFBSSwwQkFBMEIsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7QUFFekUsSUFBSSx5QkFBeUIsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFdkUsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSx1QkFBdUIsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsMEJBQTBCLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSwwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLDBCQUEwQixDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsMEJBQTBCLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSwwQkFBMEIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLHlCQUF5QixDQUFDLElBQUksRUFBRSxDQUFDOztBQUUxWCxNQUFNLENBQUMsT0FBTyxHQUFHLDBCQUEwQixDQUFDLENBQUMsQ0FBQztBQUM5QyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgXCJkZWZhdWx0XCI6IG9ialxuICB9O1xufTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCIvKipcbiAqIEBtb2R1bGUgQ2xhc3NcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxuLyoqXG4gKiBBZGQgYSBjbGFzcyB0byB0aGUgZWxlbWVudChzKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBTcGFjZS1zZXBhcmF0ZWQgY2xhc3MgbmFtZShzKSB0byBhZGQgdG8gdGhlIGVsZW1lbnQocykuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5hZGRDbGFzcygnYmFyJyk7XG4gKiAgICAgJCgnLml0ZW0nKS5hZGRDbGFzcygnYmFyIGZvbycpO1xuICovXG5cbmZ1bmN0aW9uIGFkZENsYXNzKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICBfdXRpbC5lYWNoKHZhbHVlLnNwbGl0KCcgJyksIF9lYWNoLmJpbmQodGhpcywgJ2FkZCcpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgY2xhc3MgZnJvbSB0aGUgZWxlbWVudChzKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBTcGFjZS1zZXBhcmF0ZWQgY2xhc3MgbmFtZShzKSB0byByZW1vdmUgZnJvbSB0aGUgZWxlbWVudChzKS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbXMnKS5yZW1vdmVDbGFzcygnYmFyJyk7XG4gKiAgICAgJCgnLml0ZW1zJykucmVtb3ZlQ2xhc3MoJ2JhciBmb28nKTtcbiAqL1xuXG5mdW5jdGlvbiByZW1vdmVDbGFzcyh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgX3V0aWwuZWFjaCh2YWx1ZS5zcGxpdCgnICcpLCBfZWFjaC5iaW5kKHRoaXMsICdyZW1vdmUnKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFRvZ2dsZSBhIGNsYXNzIGF0IHRoZSBlbGVtZW50KHMpXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIFNwYWNlLXNlcGFyYXRlZCBjbGFzcyBuYW1lKHMpIHRvIHRvZ2dsZSBhdCB0aGUgZWxlbWVudChzKS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLnRvZ2dsZUNsYXNzKCdiYXInKTtcbiAqICAgICAkKCcuaXRlbScpLnRvZ2dsZUNsYXNzKCdiYXIgZm9vJyk7XG4gKi9cblxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3ModmFsdWUpIHtcbiAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIF91dGlsLmVhY2godmFsdWUuc3BsaXQoJyAnKSwgX2VhY2guYmluZCh0aGlzLCAndG9nZ2xlJykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZWxlbWVudChzKSBoYXZlIGEgY2xhc3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIENoZWNrIGlmIHRoZSBET00gZWxlbWVudCBjb250YWlucyB0aGUgY2xhc3MgbmFtZS4gV2hlbiBhcHBsaWVkIHRvIG11bHRpcGxlIGVsZW1lbnRzLFxuICogcmV0dXJucyBgdHJ1ZWAgaWYgX2FueV8gb2YgdGhlbSBjb250YWlucyB0aGUgY2xhc3MgbmFtZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGVsZW1lbnQncyBjbGFzcyBhdHRyaWJ1dGUgY29udGFpbnMgdGhlIGNsYXNzIG5hbWUuXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykuaGFzQ2xhc3MoJ2JhcicpO1xuICovXG5cbmZ1bmN0aW9uIGhhc0NsYXNzKHZhbHVlKSB7XG4gICAgcmV0dXJuICh0aGlzLm5vZGVUeXBlID8gW3RoaXNdIDogdGhpcykuc29tZShmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnModmFsdWUpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFNwZWNpYWxpemVkIGl0ZXJhdGlvbiwgYXBwbHlpbmcgYGZuYCBvZiB0aGUgY2xhc3NMaXN0IEFQSSB0byBlYWNoIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZuTmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBfZWFjaChmbk5hbWUsIGNsYXNzTmFtZSkge1xuICAgIF91dGlsLmVhY2godGhpcywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0W2ZuTmFtZV0oY2xhc3NOYW1lKTtcbiAgICB9KTtcbn1cblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLmFkZENsYXNzID0gYWRkQ2xhc3M7XG5leHBvcnRzLnJlbW92ZUNsYXNzID0gcmVtb3ZlQ2xhc3M7XG5leHBvcnRzLnRvZ2dsZUNsYXNzID0gdG9nZ2xlQ2xhc3M7XG5leHBvcnRzLmhhc0NsYXNzID0gaGFzQ2xhc3M7IiwiLyoqXG4gKiBAbW9kdWxlIERPTSAoZXh0cmEpXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBfaW5kZXggPSByZXF1aXJlKCcuL2luZGV4Jyk7XG5cbnZhciBfc2VsZWN0b3JJbmRleCA9IHJlcXVpcmUoJy4uL3NlbGVjdG9yL2luZGV4Jyk7XG5cbi8qKlxuICogQXBwZW5kIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbiB0byB0aGUgc3BlY2lmaWVkIGVsZW1lbnQocykuXG4gKlxuICogQHBhcmFtIHtOb2RlfE5vZGVMaXN0fE9iamVjdH0gZWxlbWVudCBXaGF0IHRvIGFwcGVuZCB0aGUgZWxlbWVudChzKSB0by4gQ2xvbmVzIGVsZW1lbnRzIGFzIG5lY2Vzc2FyeS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gKi9cblxuZnVuY3Rpb24gYXBwZW5kVG8oZWxlbWVudCkge1xuICAgIHZhciBjb250ZXh0ID0gdHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnID8gX3NlbGVjdG9ySW5kZXguJChlbGVtZW50KSA6IGVsZW1lbnQ7XG4gICAgX2luZGV4LmFwcGVuZC5jYWxsKGNvbnRleHQsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xufVxuXG4vKlxuICogRW1wdHkgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLmVtcHR5KCk7XG4gKi9cblxuZnVuY3Rpb24gZW1wdHkoKSB7XG4gICAgcmV0dXJuIF91dGlsLmVhY2godGhpcywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgfSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBjb2xsZWN0aW9uIGZyb20gdGhlIERPTS5cbiAqXG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgY29udGFpbmluZyB0aGUgcmVtb3ZlZCBlbGVtZW50c1xuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLnJlbW92ZSgpO1xuICovXG5cbmZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICByZXR1cm4gX3V0aWwuZWFjaCh0aGlzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBSZXBsYWNlIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBuZXcgY29udGVudCwgYW5kIHJldHVybiB0aGUgYXJyYXkgb2YgZWxlbWVudHMgdGhhdCB3ZXJlIHJlcGxhY2VkLlxuICpcbiAqIEByZXR1cm4ge0FycmF5fSBBcnJheSBjb250YWluaW5nIHRoZSByZXBsYWNlZCBlbGVtZW50c1xuICovXG5cbmZ1bmN0aW9uIHJlcGxhY2VXaXRoKCkge1xuICAgIHJldHVybiBfaW5kZXguYmVmb3JlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykucmVtb3ZlKCk7XG59XG5cbi8qKlxuICogR2V0IHRoZSBgdGV4dENvbnRlbnRgIGZyb20gdGhlIGZpcnN0LCBvciBzZXQgdGhlIGB0ZXh0Q29udGVudGAgb2YgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbdmFsdWVdXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS50ZXh0KCdOZXcgY29udGVudCcpO1xuICovXG5cbmZ1bmN0aW9uIHRleHQodmFsdWUpIHtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzWzBdLnRleHRDb250ZW50O1xuICAgIH1cblxuICAgIF91dGlsLmVhY2godGhpcywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQudGV4dENvbnRlbnQgPSAnJyArIHZhbHVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogR2V0IHRoZSBgdmFsdWVgIGZyb20gdGhlIGZpcnN0LCBvciBzZXQgdGhlIGB2YWx1ZWAgb2YgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbdmFsdWVdXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnaW5wdXQuZmlyc3ROYW1lJykudmFsdWUoJ05ldyB2YWx1ZScpO1xuICovXG5cbmZ1bmN0aW9uIHZhbCh2YWx1ZSkge1xuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbMF0udmFsdWU7XG4gICAgfVxuXG4gICAgX3V0aWwuZWFjaCh0aGlzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qXG4gKiBFeHBvcnQgaW50ZXJmYWNlXG4gKi9cblxuZXhwb3J0cy5hcHBlbmRUbyA9IGFwcGVuZFRvO1xuZXhwb3J0cy5lbXB0eSA9IGVtcHR5O1xuZXhwb3J0cy5yZW1vdmUgPSByZW1vdmU7XG5leHBvcnRzLnJlcGxhY2VXaXRoID0gcmVwbGFjZVdpdGg7XG5leHBvcnRzLnRleHQgPSB0ZXh0O1xuZXhwb3J0cy52YWwgPSB2YWw7IiwiLyoqXG4gKiBAbW9kdWxlIEhUTUxcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxuLypcbiAqIEdldCB0aGUgSFRNTCBjb250ZW50cyBvZiB0aGUgZmlyc3QgZWxlbWVudCwgb3Igc2V0IHRoZSBIVE1MIGNvbnRlbnRzIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFtmcmFnbWVudF0gSFRNTCBmcmFnbWVudCB0byBzZXQgZm9yIHRoZSBlbGVtZW50LiBJZiB0aGlzIGFyZ3VtZW50IGlzIG9taXR0ZWQsIHRoZSBIVE1MIGNvbnRlbnRzIGFyZSByZXR1cm5lZC5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLmh0bWwoKTtcbiAqICAgICAkKCcuaXRlbScpLmh0bWwoJzxzcGFuPm1vcmU8L3NwYW4+Jyk7XG4gKi9cblxuZnVuY3Rpb24gaHRtbChmcmFnbWVudCkge1xuXG4gIGlmICh0eXBlb2YgZnJhZ21lbnQgIT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzLm5vZGVUeXBlID8gdGhpcyA6IHRoaXNbMF07XG4gICAgcmV0dXJuIGVsZW1lbnQgPyBlbGVtZW50LmlubmVySFRNTCA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIF91dGlsLmVhY2godGhpcywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5pbm5lckhUTUwgPSBmcmFnbWVudDtcbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qXG4gKiBFeHBvcnQgaW50ZXJmYWNlXG4gKi9cblxuZXhwb3J0cy5odG1sID0gaHRtbDsiLCIvKipcbiAqIEBtb2R1bGUgRE9NXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbnZhciBfc2VsZWN0b3JJbmRleCA9IHJlcXVpcmUoJy4uL3NlbGVjdG9yL2luZGV4Jyk7XG5cbnZhciBmb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XG5cbi8qKlxuICogQXBwZW5kIGVsZW1lbnQocykgdG8gZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8T2JqZWN0fSBlbGVtZW50IFdoYXQgdG8gYXBwZW5kIHRvIHRoZSBlbGVtZW50KHMpLlxuICogQ2xvbmVzIGVsZW1lbnRzIGFzIG5lY2Vzc2FyeS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuaXRlbScpLmFwcGVuZCgnPHA+bW9yZTwvcD4nKTtcbiAqL1xuXG5mdW5jdGlvbiBhcHBlbmQoZWxlbWVudCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBlbGVtZW50IGluc3RhbmNlb2YgTm9kZUxpc3QgPyBfdXRpbC50b0FycmF5KGVsZW1lbnQpIDogZWxlbWVudDtcbiAgICAgICAgICAgICAgICBmb3JFYWNoLmNhbGwoZWxlbWVudHMsIHRoaXMuYXBwZW5kQ2hpbGQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBfZWFjaCh0aGlzLCBhcHBlbmQsIGVsZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBQbGFjZSBlbGVtZW50KHMpIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8T2JqZWN0fSBlbGVtZW50IFdoYXQgdG8gcGxhY2UgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZWxlbWVudChzKS5cbiAqIENsb25lcyBlbGVtZW50cyBhcyBuZWNlc3NhcnkuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW0nKS5wcmVwZW5kKCc8c3Bhbj5zdGFydDwvc3Bhbj4nKTtcbiAqL1xuXG5mdW5jdGlvbiBwcmVwZW5kKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHRoaXMuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlTGlzdCA/IF91dGlsLnRvQXJyYXkoZWxlbWVudCkgOiBlbGVtZW50O1xuICAgICAgICAgICAgICAgIGZvckVhY2guY2FsbChlbGVtZW50cy5yZXZlcnNlKCksIHByZXBlbmQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBfZWFjaCh0aGlzLCBwcmVwZW5kLCBlbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogUGxhY2UgZWxlbWVudChzKSBiZWZvcmUgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8T2JqZWN0fSBlbGVtZW50IFdoYXQgdG8gcGxhY2UgYXMgc2libGluZyhzKSBiZWZvcmUgdG8gdGhlIGVsZW1lbnQocykuXG4gKiBDbG9uZXMgZWxlbWVudHMgYXMgbmVjZXNzYXJ5LlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtcycpLmJlZm9yZSgnPHA+cHJlZml4PC9wPicpO1xuICovXG5cbmZ1bmN0aW9uIGJlZm9yZShlbGVtZW50KSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmViZWdpbicsIGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbGVtZW50LCB0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZWxlbWVudCBpbnN0YW5jZW9mIE5vZGVMaXN0ID8gX3V0aWwudG9BcnJheShlbGVtZW50KSA6IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgZm9yRWFjaC5jYWxsKGVsZW1lbnRzLCBiZWZvcmUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBfZWFjaCh0aGlzLCBiZWZvcmUsIGVsZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBQbGFjZSBlbGVtZW50KHMpIGFmdGVyIGVhY2ggZWxlbWVudCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fE9iamVjdH0gZWxlbWVudCBXaGF0IHRvIHBsYWNlIGFzIHNpYmxpbmcocykgYWZ0ZXIgdG8gdGhlIGVsZW1lbnQocykuIENsb25lcyBlbGVtZW50cyBhcyBuZWNlc3NhcnkuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLml0ZW1zJykuYWZ0ZXIoJzxzcGFuPnN1Zjwvc3Bhbj48c3Bhbj5maXg8L3NwYW4+Jyk7XG4gKi9cblxuZnVuY3Rpb24gYWZ0ZXIoZWxlbWVudCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJlbmQnLCBlbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWxlbWVudCwgdGhpcy5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlTGlzdCA/IF91dGlsLnRvQXJyYXkoZWxlbWVudCkgOiBlbGVtZW50O1xuICAgICAgICAgICAgICAgIGZvckVhY2guY2FsbChlbGVtZW50cy5yZXZlcnNlKCksIGFmdGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgX2VhY2godGhpcywgYWZ0ZXIsIGVsZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDbG9uZSBhIHdyYXBwZWQgb2JqZWN0LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gV3JhcHBlZCBjb2xsZWN0aW9uIG9mIGNsb25lZCBub2Rlcy5cbiAqIEBleGFtcGxlXG4gKiAgICAgJChlbGVtZW50KS5jbG9uZSgpO1xuICovXG5cbmZ1bmN0aW9uIGNsb25lKCkge1xuICAgIHJldHVybiBfc2VsZWN0b3JJbmRleC4kKF9jbG9uZSh0aGlzKSk7XG59XG5cbi8qKlxuICogQ2xvbmUgYW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd8Tm9kZXxOb2RlTGlzdHxBcnJheX0gZWxlbWVudCBUaGUgZWxlbWVudChzKSB0byBjbG9uZS5cbiAqIEByZXR1cm4ge1N0cmluZ3xOb2RlfE5vZGVMaXN0fEFycmF5fSBUaGUgY2xvbmVkIGVsZW1lbnQocylcbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gX2Nsb25lKGVsZW1lbnQpIHtcbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgIH0gZWxzZSBpZiAoJ2xlbmd0aCcgaW4gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gW10ubWFwLmNhbGwoZWxlbWVudCwgZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbi8qKlxuICogU3BlY2lhbGl6ZWQgaXRlcmF0aW9uLCBhcHBseWluZyBgZm5gIGluIHJldmVyc2VkIG1hbm5lciB0byBhIGNsb25lIG9mIGVhY2ggZWxlbWVudCwgYnV0IHRoZSBwcm92aWRlZCBvbmUuXG4gKlxuICogQHBhcmFtIHtOb2RlTGlzdHxBcnJheX0gY29sbGVjdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7Tm9kZX0gZWxlbWVudFxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBfZWFjaChjb2xsZWN0aW9uLCBmbiwgZWxlbWVudCkge1xuICAgIHZhciBsID0gY29sbGVjdGlvbi5sZW5ndGg7XG4gICAgd2hpbGUgKGwtLSkge1xuICAgICAgICB2YXIgZWxtID0gbCA9PT0gMCA/IGVsZW1lbnQgOiBfY2xvbmUoZWxlbWVudCk7XG4gICAgICAgIGZuLmNhbGwoY29sbGVjdGlvbltsXSwgZWxtKTtcbiAgICB9XG59XG5cbi8qXG4gKiBFeHBvcnQgaW50ZXJmYWNlXG4gKi9cblxuZXhwb3J0cy5hcHBlbmQgPSBhcHBlbmQ7XG5leHBvcnRzLnByZXBlbmQgPSBwcmVwZW5kO1xuZXhwb3J0cy5iZWZvcmUgPSBiZWZvcmU7XG5leHBvcnRzLmFmdGVyID0gYWZ0ZXI7XG5leHBvcnRzLmNsb25lID0gY2xvbmU7IiwiLyoqXG4gKiBAbW9kdWxlIEV2ZW50c1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgX3NlbGVjdG9yQ2xvc2VzdCA9IHJlcXVpcmUoJy4uL3NlbGVjdG9yL2Nsb3Nlc3QnKTtcblxuLyoqXG4gKiBTaG9ydGhhbmQgZm9yIGBhZGRFdmVudExpc3RlbmVyYC4gU3VwcG9ydHMgZXZlbnQgZGVsZWdhdGlvbiBpZiBhIGZpbHRlciAoYHNlbGVjdG9yYCkgaXMgcHJvdmlkZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZXMgTGlzdCBvZiBzcGFjZS1zZXBhcmF0ZWQgZXZlbnQgdHlwZXMgdG8gYmUgYWRkZWQgdG8gdGhlIGVsZW1lbnQocylcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc2VsZWN0b3JdIFNlbGVjdG9yIHRvIGZpbHRlciBkZXNjZW5kYW50cyB0aGF0IGRlbGVnYXRlIHRoZSBldmVudCB0byB0aGlzIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIEV2ZW50IGhhbmRsZXJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ2FwdHVyZT1mYWxzZVxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykub24oJ2NsaWNrJywgY2FsbGJhY2spO1xuICogICAgICQoJy5jb250YWluZXInKS5vbignY2xpY2sgZm9jdXMnLCAnLml0ZW0nLCBoYW5kbGVyKTtcbiAqL1xuXG5mdW5jdGlvbiBvbihldmVudE5hbWVzLCBzZWxlY3RvciwgaGFuZGxlciwgdXNlQ2FwdHVyZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICAgICAgc2VsZWN0b3IgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBwYXJ0cyA9IHVuZGVmaW5lZCxcbiAgICAgICAgbmFtZXNwYWNlID0gdW5kZWZpbmVkLFxuICAgICAgICBldmVudExpc3RlbmVyID0gdW5kZWZpbmVkO1xuXG4gICAgZXZlbnROYW1lcy5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuXG4gICAgICAgIHBhcnRzID0gZXZlbnROYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgIGV2ZW50TmFtZSA9IHBhcnRzWzBdIHx8IG51bGw7XG4gICAgICAgIG5hbWVzcGFjZSA9IHBhcnRzWzFdIHx8IG51bGw7XG5cbiAgICAgICAgZXZlbnRMaXN0ZW5lciA9IHByb3h5SGFuZGxlcihoYW5kbGVyKTtcblxuICAgICAgICBfdXRpbC5lYWNoKF90aGlzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuXG4gICAgICAgICAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICBldmVudExpc3RlbmVyID0gZGVsZWdhdGVIYW5kbGVyLmJpbmQoZWxlbWVudCwgc2VsZWN0b3IsIGV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBldmVudExpc3RlbmVyLCB1c2VDYXB0dXJlIHx8IGZhbHNlKTtcblxuICAgICAgICAgICAgZ2V0SGFuZGxlcnMoZWxlbWVudCkucHVzaCh7XG4gICAgICAgICAgICAgICAgZXZlbnROYW1lOiBldmVudE5hbWUsXG4gICAgICAgICAgICAgICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICAgICAgICAgICAgICBldmVudExpc3RlbmVyOiBldmVudExpc3RlbmVyLFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IG5hbWVzcGFjZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogU2hvcnRoYW5kIGZvciBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZXMgTGlzdCBvZiBzcGFjZS1zZXBhcmF0ZWQgZXZlbnQgdHlwZXMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBlbGVtZW50KHMpXG4gKiBAcGFyYW0ge1N0cmluZ30gW3NlbGVjdG9yXSBTZWxlY3RvciB0byBmaWx0ZXIgZGVzY2VuZGFudHMgdGhhdCB1bmRlbGVnYXRlIHRoZSBldmVudCB0byB0aGlzIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIEV2ZW50IGhhbmRsZXJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlQ2FwdHVyZT1mYWxzZVxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgd3JhcHBlZCBjb2xsZWN0aW9uXG4gKiBAY2hhaW5hYmxlXG4gKiBAZXhhbXBsZVxuICogICAgICQoJy5pdGVtJykub2ZmKCdjbGljaycsIGNhbGxiYWNrKTtcbiAqICAgICAkKCcjbXktZWxlbWVudCcpLm9mZignbXlFdmVudCBteU90aGVyRXZlbnQnKTtcbiAqICAgICAkKCcuaXRlbScpLm9mZigpO1xuICovXG5cbmZ1bmN0aW9uIG9mZihldmVudE5hbWVzLCBzZWxlY3RvciwgaGFuZGxlciwgdXNlQ2FwdHVyZSkge1xuICAgIGlmIChldmVudE5hbWVzID09PSB1bmRlZmluZWQpIGV2ZW50TmFtZXMgPSAnJztcblxuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBoYW5kbGVyID0gc2VsZWN0b3I7XG4gICAgICAgIHNlbGVjdG9yID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcGFydHMgPSB1bmRlZmluZWQsXG4gICAgICAgIG5hbWVzcGFjZSA9IHVuZGVmaW5lZCxcbiAgICAgICAgaGFuZGxlcnMgPSB1bmRlZmluZWQ7XG5cbiAgICBldmVudE5hbWVzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG5cbiAgICAgICAgcGFydHMgPSBldmVudE5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgZXZlbnROYW1lID0gcGFydHNbMF0gfHwgbnVsbDtcbiAgICAgICAgbmFtZXNwYWNlID0gcGFydHNbMV0gfHwgbnVsbDtcblxuICAgICAgICBfdXRpbC5lYWNoKF90aGlzMiwgZnVuY3Rpb24gKGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgaGFuZGxlcnMgPSBnZXRIYW5kbGVycyhlbGVtZW50KTtcblxuICAgICAgICAgICAgX3V0aWwuZWFjaChoYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCFldmVudE5hbWUgfHwgaXRlbS5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSkgJiYgKCFuYW1lc3BhY2UgfHwgaXRlbS5uYW1lc3BhY2UgPT09IG5hbWVzcGFjZSkgJiYgKCFoYW5kbGVyIHx8IGl0ZW0uaGFuZGxlciA9PT0gaGFuZGxlcikgJiYgKCFzZWxlY3RvciB8fCBpdGVtLnNlbGVjdG9yID09PSBzZWxlY3Rvcik7XG4gICAgICAgICAgICB9KSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoaXRlbS5ldmVudE5hbWUsIGl0ZW0uZXZlbnRMaXN0ZW5lciwgdXNlQ2FwdHVyZSB8fCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaGFuZGxlcnMuc3BsaWNlKGhhbmRsZXJzLmluZGV4T2YoaXRlbSksIDEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghZXZlbnROYW1lICYmICFuYW1lc3BhY2UgJiYgIXNlbGVjdG9yICYmICFoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJIYW5kbGVycyhlbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFuZGxlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJIYW5kbGVycyhlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBHZXQgZXZlbnQgaGFuZGxlcnMgZnJvbSBhbiBlbGVtZW50XG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gZWxlbWVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxudmFyIGV2ZW50S2V5UHJvcCA9ICdfX2RvbXRhc3RpY19ldmVudF9fJztcbnZhciBpZCA9IDE7XG52YXIgaGFuZGxlcnMgPSB7fTtcbnZhciB1bnVzZWRLZXlzID0gW107XG5cbmZ1bmN0aW9uIGdldEhhbmRsZXJzKGVsZW1lbnQpIHtcbiAgICBpZiAoIWVsZW1lbnRbZXZlbnRLZXlQcm9wXSkge1xuICAgICAgICBlbGVtZW50W2V2ZW50S2V5UHJvcF0gPSB1bnVzZWRLZXlzLmxlbmd0aCA9PT0gMCA/ICsraWQgOiB1bnVzZWRLZXlzLnBvcCgpO1xuICAgIH1cbiAgICB2YXIga2V5ID0gZWxlbWVudFtldmVudEtleVByb3BdO1xuICAgIHJldHVybiBoYW5kbGVyc1trZXldIHx8IChoYW5kbGVyc1trZXldID0gW10pO1xufVxuXG4vKipcbiAqIENsZWFyIGV2ZW50IGhhbmRsZXJzIGZvciBhbiBlbGVtZW50XG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gZWxlbWVudFxuICovXG5cbmZ1bmN0aW9uIGNsZWFySGFuZGxlcnMoZWxlbWVudCkge1xuICAgIHZhciBrZXkgPSBlbGVtZW50W2V2ZW50S2V5UHJvcF07XG4gICAgaWYgKGhhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgaGFuZGxlcnNba2V5XSA9IG51bGw7XG4gICAgICAgIGVsZW1lbnRba2V5XSA9IG51bGw7XG4gICAgICAgIHVudXNlZEtleXMucHVzaChrZXkpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0byBjcmVhdGUgYSBoYW5kbGVyIHRoYXQgYXVnbWVudHMgdGhlIGV2ZW50IG9iamVjdCB3aXRoIHNvbWUgZXh0cmEgbWV0aG9kcyxcbiAqIGFuZCBleGVjdXRlcyB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgZXZlbnQgYW5kIHRoZSBldmVudCBkYXRhIChpLmUuIGBldmVudC5kZXRhaWxgKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIGhhbmRsZXIgQ2FsbGJhY2sgdG8gZXhlY3V0ZSBhcyBgaGFuZGxlcihldmVudCwgZGF0YSlgXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBwcm94eUhhbmRsZXIoaGFuZGxlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGF1Z21lbnRFdmVudChldmVudCksIGV2ZW50LmRldGFpbCk7XG4gICAgfTtcbn1cblxuLyoqXG4gKiBBdHRlbXB0IHRvIGF1Z21lbnQgZXZlbnRzIGFuZCBpbXBsZW1lbnQgc29tZXRoaW5nIGNsb3NlciB0byBET00gTGV2ZWwgMyBFdmVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxudmFyIGF1Z21lbnRFdmVudCA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgbWV0aG9kTmFtZSA9IHVuZGVmaW5lZCxcbiAgICAgICAgZXZlbnRNZXRob2RzID0ge1xuICAgICAgICBwcmV2ZW50RGVmYXVsdDogJ2lzRGVmYXVsdFByZXZlbnRlZCcsXG4gICAgICAgIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbjogJ2lzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkJyxcbiAgICAgICAgc3RvcFByb3BhZ2F0aW9uOiAnaXNQcm9wYWdhdGlvblN0b3BwZWQnXG4gICAgfSxcbiAgICAgICAgcmV0dXJuVHJ1ZSA9IGZ1bmN0aW9uIHJldHVyblRydWUoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgICAgIHJldHVybkZhbHNlID0gZnVuY3Rpb24gcmV0dXJuRmFsc2UoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoIWV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCB8fCBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gfHwgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgICBmb3IgKG1ldGhvZE5hbWUgaW4gZXZlbnRNZXRob2RzKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uIChtZXRob2ROYW1lLCB0ZXN0TWV0aG9kTmFtZSwgb3JpZ2luYWxNZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3Rlc3RNZXRob2ROYW1lXSA9IHJldHVyblRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxNZXRob2QgJiYgb3JpZ2luYWxNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRbdGVzdE1ldGhvZE5hbWVdID0gcmV0dXJuRmFsc2U7XG4gICAgICAgICAgICAgICAgfSkobWV0aG9kTmFtZSwgZXZlbnRNZXRob2RzW21ldGhvZE5hbWVdLCBldmVudFttZXRob2ROYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXZlbnQuX3ByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXZlbnQ7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gdGVzdCB3aGV0aGVyIGRlbGVnYXRlZCBldmVudHMgbWF0Y2ggdGhlIHByb3ZpZGVkIGBzZWxlY3RvcmAgKGZpbHRlciksXG4gKiBpZiB0aGUgZXZlbnQgcHJvcGFnYXRpb24gd2FzIHN0b3BwZWQsIGFuZCB0aGVuIGFjdHVhbGx5IGNhbGwgdGhlIHByb3ZpZGVkIGV2ZW50IGhhbmRsZXIuXG4gKiBVc2UgYHRoaXNgIGluc3RlYWQgb2YgYGV2ZW50LmN1cnJlbnRUYXJnZXRgIG9uIHRoZSBldmVudCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciBTZWxlY3RvciB0byBmaWx0ZXIgZGVzY2VuZGFudHMgdGhhdCB1bmRlbGVnYXRlIHRoZSBldmVudCB0byB0aGlzIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIEV2ZW50IGhhbmRsZXJcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKi9cblxuZnVuY3Rpb24gZGVsZWdhdGVIYW5kbGVyKHNlbGVjdG9yLCBoYW5kbGVyLCBldmVudCkge1xuICAgIHZhciBldmVudFRhcmdldCA9IGV2ZW50Ll90YXJnZXQgfHwgZXZlbnQudGFyZ2V0LFxuICAgICAgICBjdXJyZW50VGFyZ2V0ID0gX3NlbGVjdG9yQ2xvc2VzdC5jbG9zZXN0LmNhbGwoW2V2ZW50VGFyZ2V0XSwgc2VsZWN0b3IsIHRoaXMpWzBdO1xuICAgIGlmIChjdXJyZW50VGFyZ2V0ICYmIGN1cnJlbnRUYXJnZXQgIT09IHRoaXMpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRUYXJnZXQgPT09IGV2ZW50VGFyZ2V0IHx8ICEoZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQgJiYgZXZlbnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSkpIHtcbiAgICAgICAgICAgIGhhbmRsZXIuY2FsbChjdXJyZW50VGFyZ2V0LCBldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciBiaW5kID0gb24sXG4gICAgdW5iaW5kID0gb2ZmO1xuXG4vKlxuICogRXhwb3J0IGludGVyZmFjZVxuICovXG5cbmV4cG9ydHMub24gPSBvbjtcbmV4cG9ydHMub2ZmID0gb2ZmO1xuZXhwb3J0cy5iaW5kID0gYmluZDtcbmV4cG9ydHMudW5iaW5kID0gdW5iaW5kOyIsIi8qKlxuICogQG1vZHVsZSBjbG9zZXN0XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2luZGV4ID0gcmVxdWlyZSgnLi9pbmRleCcpO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbi8qKlxuICogUmV0dXJuIHRoZSBjbG9zZXN0IGVsZW1lbnQgbWF0Y2hpbmcgdGhlIHNlbGVjdG9yIChzdGFydGluZyBieSBpdHNlbGYpIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIEZpbHRlclxuICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBJZiBwcm92aWRlZCwgbWF0Y2hpbmcgZWxlbWVudHMgbXVzdCBiZSBhIGRlc2NlbmRhbnQgb2YgdGhpcyBlbGVtZW50XG4gKiBAcmV0dXJuIHtPYmplY3R9IE5ldyB3cmFwcGVkIGNvbGxlY3Rpb24gKGNvbnRhaW5pbmcgemVybyBvciBvbmUgZWxlbWVudClcbiAqIEBjaGFpbmFibGVcbiAqIEBleGFtcGxlXG4gKiAgICAgJCgnLnNlbGVjdG9yJykuY2xvc2VzdCgnLmNvbnRhaW5lcicpO1xuICovXG5cbnZhciBjbG9zZXN0ID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIGZ1bmN0aW9uIGNsb3Nlc3Qoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgIF91dGlsLmVhY2godGhpcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoX2luZGV4Lm1hdGNoZXMobm9kZSwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIF9pbmRleC4kKF91dGlsLnVuaXEobm9kZXMpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIUVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgPyBjbG9zZXN0IDogZnVuY3Rpb24gKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgX3JldCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgICAgICAgX3V0aWwuZWFjaChfdGhpcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSBub2RlLmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXMucHVzaChuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHY6IF9pbmRleC4kKF91dGlsLnVuaXEobm9kZXMpKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIF9yZXQgPT09ICdvYmplY3QnKSByZXR1cm4gX3JldC52O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNsb3Nlc3QuY2FsbCh0aGlzLCBzZWxlY3RvciwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLmNsb3Nlc3QgPSBjbG9zZXN0OyIsIi8qKlxuICogQG1vZHVsZSBTZWxlY3RvclxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgaXNQcm90b3R5cGVTZXQgPSBmYWxzZTtcblxudmFyIHJlRnJhZ21lbnQgPSAvXlxccyo8KFxcdyt8ISlbXj5dKj4vLFxuICAgIHJlU2luZ2xlVGFnID0gL148KFxcdyspXFxzKlxcLz8+KD86PFxcL1xcMT58KSQvLFxuICAgIHJlU2ltcGxlU2VsZWN0b3IgPSAvXltcXC4jXT9bXFx3LV0qJC87XG5cbi8qXG4gKiBWZXJzYXRpbGUgd3JhcHBlciBmb3IgYHF1ZXJ5U2VsZWN0b3JBbGxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8QXJyYXl9IHNlbGVjdG9yIFF1ZXJ5IHNlbGVjdG9yLCBgTm9kZWAsIGBOb2RlTGlzdGAsIGFycmF5IG9mIGVsZW1lbnRzLCBvciBIVE1MIGZyYWdtZW50IHN0cmluZy5cbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R9IGNvbnRleHQ9ZG9jdW1lbnQgVGhlIGNvbnRleHQgZm9yIHRoZSBzZWxlY3RvciB0byBxdWVyeSBlbGVtZW50cy5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGNoYWluYWJsZVxuICogQGV4YW1wbGVcbiAqICAgICB2YXIgJGl0ZW1zID0gJCguaXRlbXMnKTtcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyICRlbGVtZW50ID0gJChkb21FbGVtZW50KTtcbiAqIEBleGFtcGxlXG4gKiAgICAgdmFyICRsaXN0ID0gJChub2RlTGlzdCwgZG9jdW1lbnQuYm9keSk7XG4gKiBAZXhhbXBsZVxuICogICAgIHZhciAkZWxlbWVudCA9ICQoJzxwPmV2ZXJncmVlbjwvcD4nKTtcbiAqL1xuXG5mdW5jdGlvbiAkKHNlbGVjdG9yKSB7XG4gICAgdmFyIGNvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBkb2N1bWVudCA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHZhciBjb2xsZWN0aW9uID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG51bGwpO1xuICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBXcmFwcGVyKSB7XG5cbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSAnc3RyaW5nJykge1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSBzZWxlY3Rvci5ub2RlVHlwZSB8fCBzZWxlY3RvciA9PT0gd2luZG93ID8gW3NlbGVjdG9yXSA6IHNlbGVjdG9yO1xuICAgIH0gZWxzZSBpZiAocmVGcmFnbWVudC50ZXN0KHNlbGVjdG9yKSkge1xuXG4gICAgICAgIGNvbGxlY3Rpb24gPSBjcmVhdGVGcmFnbWVudChzZWxlY3Rvcik7XG4gICAgfSBlbHNlIHtcblxuICAgICAgICBjb250ZXh0ID0gdHlwZW9mIGNvbnRleHQgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250ZXh0KSA6IGNvbnRleHQubGVuZ3RoID8gY29udGV4dFswXSA6IGNvbnRleHQ7XG5cbiAgICAgICAgY29sbGVjdGlvbiA9IHF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IsIGNvbnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiB3cmFwKGNvbGxlY3Rpb24pO1xufVxuXG4vKlxuICogRmluZCBkZXNjZW5kYW50cyBtYXRjaGluZyB0aGUgcHJvdmlkZWQgYHNlbGVjdG9yYCBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE5vZGV8Tm9kZUxpc3R8QXJyYXl9IHNlbGVjdG9yIFF1ZXJ5IHNlbGVjdG9yLCBgTm9kZWAsIGBOb2RlTGlzdGAsIGFycmF5IG9mIGVsZW1lbnRzLCBvciBIVE1MIGZyYWdtZW50IHN0cmluZy5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHdyYXBwZWQgY29sbGVjdGlvblxuICogQGV4YW1wbGVcbiAqICAgICAkKCcuc2VsZWN0b3InKS5maW5kKCcuZGVlcCcpLiQoJy5kZWVwZXN0Jyk7XG4gKi9cblxuZnVuY3Rpb24gZmluZChzZWxlY3Rvcikge1xuICAgIHZhciBub2RlcyA9IFtdO1xuICAgIF91dGlsLmVhY2godGhpcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgX3V0aWwuZWFjaChxdWVyeVNlbGVjdG9yKHNlbGVjdG9yLCBub2RlKSwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICBpZiAobm9kZXMuaW5kZXhPZihjaGlsZCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgbm9kZXMucHVzaChjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiAkKG5vZGVzKTtcbn1cblxuLypcbiAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBlbGVtZW50IHdvdWxkIGJlIHNlbGVjdGVkIGJ5IHRoZSBzcGVjaWZpZWQgc2VsZWN0b3Igc3RyaW5nOyBvdGhlcndpc2UsIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnQgRWxlbWVudCB0byB0ZXN0XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgU2VsZWN0b3IgdG8gbWF0Y2ggYWdhaW5zdCBlbGVtZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgJC5tYXRjaGVzKGVsZW1lbnQsICcubWF0Y2gnKTtcbiAqL1xuXG52YXIgbWF0Y2hlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRleHQgPSB0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBFbGVtZW50LnByb3RvdHlwZSA6IF91dGlsLmdsb2JhbCxcbiAgICAgICAgX21hdGNoZXMgPSBjb250ZXh0Lm1hdGNoZXMgfHwgY29udGV4dC5tYXRjaGVzU2VsZWN0b3IgfHwgY29udGV4dC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgY29udGV4dC5tc01hdGNoZXNTZWxlY3RvciB8fCBjb250ZXh0Lm9NYXRjaGVzU2VsZWN0b3IgfHwgY29udGV4dC53ZWJraXRNYXRjaGVzU2VsZWN0b3I7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlbGVtZW50LCBzZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gX21hdGNoZXMuY2FsbChlbGVtZW50LCBzZWxlY3Rvcik7XG4gICAgfTtcbn0pKCk7XG5cbi8qXG4gKiBVc2UgdGhlIGZhc3RlciBgZ2V0RWxlbWVudEJ5SWRgLCBgZ2V0RWxlbWVudHNCeUNsYXNzTmFtZWAgb3IgYGdldEVsZW1lbnRzQnlUYWdOYW1lYCBvdmVyIGBxdWVyeVNlbGVjdG9yQWxsYCBpZiBwb3NzaWJsZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIFF1ZXJ5IHNlbGVjdG9yLlxuICogQHBhcmFtIHtOb2RlfSBjb250ZXh0IFRoZSBjb250ZXh0IGZvciB0aGUgc2VsZWN0b3IgdG8gcXVlcnkgZWxlbWVudHMuXG4gKiBAcmV0dXJuIHtPYmplY3R9IE5vZGVMaXN0LCBIVE1MQ29sbGVjdGlvbiwgb3IgQXJyYXkgb2YgbWF0Y2hpbmcgZWxlbWVudHMgKGRlcGVuZGluZyBvbiBtZXRob2QgdXNlZCkuXG4gKi9cblxuZnVuY3Rpb24gcXVlcnlTZWxlY3RvcihzZWxlY3RvciwgY29udGV4dCkge1xuXG4gICAgdmFyIGlzU2ltcGxlU2VsZWN0b3IgPSByZVNpbXBsZVNlbGVjdG9yLnRlc3Qoc2VsZWN0b3IpO1xuXG4gICAgaWYgKGlzU2ltcGxlU2VsZWN0b3IpIHtcbiAgICAgICAgaWYgKHNlbGVjdG9yWzBdID09PSAnIycpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gKGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQgPyBjb250ZXh0IDogZG9jdW1lbnQpLmdldEVsZW1lbnRCeUlkKHNlbGVjdG9yLnNsaWNlKDEpKTtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50ID8gW2VsZW1lbnRdIDogW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdG9yWzBdID09PSAnLicpIHtcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoc2VsZWN0b3Iuc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKHNlbGVjdG9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbn1cblxuLypcbiAqIENyZWF0ZSBET00gZnJhZ21lbnQgZnJvbSBhbiBIVE1MIHN0cmluZ1xuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gaHRtbCBTdHJpbmcgcmVwcmVzZW50aW5nIEhUTUwuXG4gKiBAcmV0dXJuIHtOb2RlTGlzdH1cbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudChodG1sKSB7XG5cbiAgICBpZiAocmVTaW5nbGVUYWcudGVzdChodG1sKSkge1xuICAgICAgICByZXR1cm4gW2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoUmVnRXhwLiQxKV07XG4gICAgfVxuXG4gICAgdmFyIGVsZW1lbnRzID0gW10sXG4gICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICBjaGlsZHJlbiA9IGNvbnRhaW5lci5jaGlsZE5vZGVzO1xuXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBlbGVtZW50cy5wdXNoKGNoaWxkcmVuW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudHM7XG59XG5cbi8qXG4gKiBDYWxsaW5nIGAkKHNlbGVjdG9yKWAgcmV0dXJucyBhIHdyYXBwZWQgY29sbGVjdGlvbiBvZiBlbGVtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlTGlzdHxBcnJheX0gY29sbGVjdGlvbiBFbGVtZW50KHMpIHRvIHdyYXAuXG4gKiBAcmV0dXJuIChPYmplY3QpIFRoZSB3cmFwcGVkIGNvbGxlY3Rpb25cbiAqL1xuXG5mdW5jdGlvbiB3cmFwKGNvbGxlY3Rpb24pIHtcblxuICAgIGlmICghaXNQcm90b3R5cGVTZXQpIHtcbiAgICAgICAgV3JhcHBlci5wcm90b3R5cGUgPSAkLmZuO1xuICAgICAgICBXcmFwcGVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFdyYXBwZXI7XG4gICAgICAgIGlzUHJvdG90eXBlU2V0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFdyYXBwZXIoY29sbGVjdGlvbik7XG59XG5cbi8qXG4gKiBDb25zdHJ1Y3RvciBmb3IgdGhlIE9iamVjdC5wcm90b3R5cGUgc3RyYXRlZ3lcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGVMaXN0fEFycmF5fSBjb2xsZWN0aW9uIEVsZW1lbnQocykgdG8gd3JhcC5cbiAqL1xuXG5mdW5jdGlvbiBXcmFwcGVyKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuICAgIGZvciAoOyBpIDwgbGVuZ3RoOykge1xuICAgICAgICB0aGlzW2ldID0gY29sbGVjdGlvbltpKytdO1xuICAgIH1cbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbn1cblxuLypcbiAqIEV4cG9ydCBpbnRlcmZhY2VcbiAqL1xuXG5leHBvcnRzLiQgPSAkO1xuZXhwb3J0cy5maW5kID0gZmluZDtcbmV4cG9ydHMubWF0Y2hlcyA9IG1hdGNoZXM7XG5leHBvcnRzLldyYXBwZXIgPSBXcmFwcGVyOyIsIi8qXG4gKiBAbW9kdWxlIFV0aWxcbiAqL1xuXG4vKlxuICogUmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgc2NvcGVcbiAqIEBwcml2YXRlXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgZ2xvYmFsID0gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcblxuLyoqXG4gKiBDb252ZXJ0IGBOb2RlTGlzdGAgdG8gYEFycmF5YC5cbiAqXG4gKiBAcGFyYW0ge05vZGVMaXN0fEFycmF5fSBjb2xsZWN0aW9uXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdG9BcnJheShjb2xsZWN0aW9uKSB7XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICByZXN1bHQgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdFtpXSA9IGNvbGxlY3Rpb25baV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRmFzdGVyIGFsdGVybmF0aXZlIHRvIFtdLmZvckVhY2ggbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOb2RlfE5vZGVMaXN0fEFycmF5fSBjb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7Tm9kZXxOb2RlTGlzdHxBcnJheX1cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZWFjaChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoICE9PSB1bmRlZmluZWQgJiYgY29sbGVjdGlvbi5ub2RlVHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgY29sbGVjdGlvbltpXSwgaSwgY29sbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNvbGxlY3Rpb24sIDAsIGNvbGxlY3Rpb24pO1xuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBBc3NpZ24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGZyb20gc291cmNlIG9iamVjdChzKSB0byB0YXJnZXQgb2JqZWN0XG4gKlxuICogQG1ldGhvZCBleHRlbmRcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQgT2JqZWN0IHRvIGV4dGVuZFxuICogQHBhcmFtIHtPYmplY3R9IFtzb3VyY2VdIE9iamVjdCB0byBleHRlbmQgZnJvbVxuICogQHJldHVybiB7T2JqZWN0fSBFeHRlbmRlZCBvYmplY3RcbiAqIEBleGFtcGxlXG4gKiAgICAgJC5leHRlbmQoe2E6IDF9LCB7YjogMn0pO1xuICogICAgIC8vIHthOiAxLCBiOiAyfVxuICogQGV4YW1wbGVcbiAqICAgICAkLmV4dGVuZCh7YTogMX0sIHtiOiAyfSwge2E6IDN9KTtcbiAqICAgICAvLyB7YTogMywgYjogMn1cbiAqL1xuXG5mdW5jdGlvbiBleHRlbmQodGFyZ2V0KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHNvdXJjZXMgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIHNvdXJjZXNbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc3JjKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc3JjKSB7XG4gICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSBzcmNbcHJvcF07XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgY29sbGVjdGlvbiB3aXRob3V0IGR1cGxpY2F0ZXNcbiAqXG4gKiBAcGFyYW0gY29sbGVjdGlvbiBDb2xsZWN0aW9uIHRvIHJlbW92ZSBkdXBsaWNhdGVzIGZyb21cbiAqIEByZXR1cm4ge05vZGV8Tm9kZUxpc3R8QXJyYXl9XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHVuaXEoY29sbGVjdGlvbikge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbHRlcihmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uaW5kZXhPZihpdGVtKSA9PT0gaW5kZXg7XG4gICAgfSk7XG59XG5cbi8qXG4gKiBFeHBvcnQgaW50ZXJmYWNlXG4gKi9cblxuZXhwb3J0cy5nbG9iYWwgPSBnbG9iYWw7XG5leHBvcnRzLnRvQXJyYXkgPSB0b0FycmF5O1xuZXhwb3J0cy5lYWNoID0gZWFjaDtcbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuZXhwb3J0cy51bmlxID0gdW5pcTsiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsnZXhwb3J0cycsICdtb2R1bGUnXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZmFjdG9yeShleHBvcnRzLCBtb2R1bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QuZXhwb3J0cywgbW9kKTtcbiAgICBnbG9iYWwueHIgPSBtb2QuZXhwb3J0cztcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKGV4cG9ydHMsIG1vZHVsZSkge1xuICAvKipcbiAgICogeHIgKGMpIEphbWVzIENsZXZlbGFuZCAyMDE1XG4gICAqIFVSTDogaHR0cHM6Ly9naXRodWIuY29tL3JhZGlvc2lsZW5jZS94clxuICAgKiBMaWNlbnNlOiBCU0RcbiAgICovXG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBNZXRob2RzID0ge1xuICAgIEdFVDogJ0dFVCcsXG4gICAgUE9TVDogJ1BPU1QnLFxuICAgIFBVVDogJ1BVVCcsXG4gICAgREVMRVRFOiAnREVMRVRFJyxcbiAgICBQQVRDSDogJ1BBVENIJyxcbiAgICBPUFRJT05TOiAnT1BUSU9OUydcbiAgfTtcblxuICB2YXIgRXZlbnRzID0ge1xuICAgIFJFQURZX1NUQVRFX0NIQU5HRTogJ3JlYWR5c3RhdGVjaGFuZ2UnLFxuICAgIExPQURfU1RBUlQ6ICdsb2Fkc3RhcnQnLFxuICAgIFBST0dSRVNTOiAncHJvZ3Jlc3MnLFxuICAgIEFCT1JUOiAnYWJvcnQnLFxuICAgIEVSUk9SOiAnZXJyb3InLFxuICAgIExPQUQ6ICdsb2FkJyxcbiAgICBUSU1FT1VUOiAndGltZW91dCcsXG4gICAgTE9BRF9FTkQ6ICdsb2FkZW5kJ1xuICB9O1xuXG4gIHZhciBkZWZhdWx0cyA9IHtcbiAgICBtZXRob2Q6IE1ldGhvZHMuR0VULFxuICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH0sXG4gICAgZHVtcDogSlNPTi5zdHJpbmdpZnksXG4gICAgbG9hZDogSlNPTi5wYXJzZSxcbiAgICB4bWxIdHRwUmVxdWVzdDogZnVuY3Rpb24geG1sSHR0cFJlcXVlc3QoKSB7XG4gICAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgfSxcbiAgICBwcm9taXNlOiBmdW5jdGlvbiBwcm9taXNlKGZuKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZm4pO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiByZXMoeGhyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlOiB4aHIucmVzcG9uc2UsXG4gICAgICB4aHI6IHhoclxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBhc3NpZ24obCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBycyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIHJzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpIGluIHJzKSB7XG4gICAgICBpZiAoISh7fSkuaGFzT3duUHJvcGVydHkuY2FsbChycywgaSkpIGNvbnRpbnVlO1xuICAgICAgdmFyIHIgPSByc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgciAhPT0gJ29iamVjdCcpIGNvbnRpbnVlO1xuICAgICAgZm9yICh2YXIgayBpbiByKSB7XG4gICAgICAgIGlmICghKHt9KS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHIsIGspKSBjb250aW51ZTtcbiAgICAgICAgbFtrXSA9IHJba107XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsO1xuICB9XG5cbiAgZnVuY3Rpb24gdXJsRW5jb2RlKHBhcmFtcykge1xuICAgIHZhciBwYXJhbVN0cmluZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBrIGluIHBhcmFtcykge1xuICAgICAgaWYgKCEoe30pLmhhc093blByb3BlcnR5LmNhbGwocGFyYW1zLCBrKSkgY29udGludWU7XG4gICAgICBwYXJhbVN0cmluZ3MucHVzaChlbmNvZGVVUklDb21wb25lbnQoaykgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW2tdKSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbVN0cmluZ3Muam9pbignJicpO1xuICB9XG5cbiAgdmFyIGNvbmZpZyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZShvcHRzKSB7XG4gICAgY29uZmlnID0gYXNzaWduKHt9LCBjb25maWcsIG9wdHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvbWlzZShhcmdzLCBmbikge1xuICAgIHJldHVybiAoYXJncyAmJiBhcmdzLnByb21pc2UgPyBhcmdzLnByb21pc2UgOiBjb25maWcucHJvbWlzZSB8fCBkZWZhdWx0cy5wcm9taXNlKShmbik7XG4gIH1cblxuICBmdW5jdGlvbiB4cihhcmdzKSB7XG4gICAgcmV0dXJuIHByb21pc2UoYXJncywgZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIG9wdHMgPSBhc3NpZ24oe30sIGRlZmF1bHRzLCBjb25maWcsIGFyZ3MpO1xuICAgICAgdmFyIHhociA9IG9wdHMueG1sSHR0cFJlcXVlc3QoKTtcblxuICAgICAgeGhyLm9wZW4ob3B0cy5tZXRob2QsIG9wdHMucGFyYW1zID8gb3B0cy51cmwuc3BsaXQoJz8nKVswXSArICc/JyArIHVybEVuY29kZShvcHRzLnBhcmFtcykgOiBvcHRzLnVybCwgdHJ1ZSk7XG5cbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKEV2ZW50cy5MT0FELCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgdmFyIF9kYXRhID0gbnVsbDtcbiAgICAgICAgICBpZiAoeGhyLnJlc3BvbnNlVGV4dCkge1xuICAgICAgICAgICAgX2RhdGEgPSBvcHRzLnJhdyA9PT0gdHJ1ZSA/IHhoci5yZXNwb25zZVRleHQgOiBvcHRzLmxvYWQoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUoX2RhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChyZXMoeGhyKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihFdmVudHMuQUJPUlQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChyZXMoeGhyKSk7XG4gICAgICB9KTtcbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKEV2ZW50cy5FUlJPUiwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0KHJlcyh4aHIpKTtcbiAgICAgIH0pO1xuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnRzLlRJTUVPVVQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChyZXMoeGhyKSk7XG4gICAgICB9KTtcblxuICAgICAgZm9yICh2YXIgayBpbiBvcHRzLmhlYWRlcnMpIHtcbiAgICAgICAgaWYgKCEoe30pLmhhc093blByb3BlcnR5LmNhbGwob3B0cy5oZWFkZXJzLCBrKSkgY29udGludWU7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGssIG9wdHMuaGVhZGVyc1trXSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGsgaW4gb3B0cy5ldmVudHMpIHtcbiAgICAgICAgaWYgKCEoe30pLmhhc093blByb3BlcnR5LmNhbGwob3B0cy5ldmVudHMsIGspKSBjb250aW51ZTtcbiAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoaywgb3B0cy5ldmVudHNba10uYmluZChudWxsLCB4aHIpLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhID0gdHlwZW9mIG9wdHMuZGF0YSA9PT0gJ29iamVjdCcgJiYgIW9wdHMucmF3ID8gb3B0cy5kdW1wKG9wdHMuZGF0YSkgOiBvcHRzLmRhdGE7XG5cbiAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHhoci5zZW5kKGRhdGEpO2Vsc2UgeGhyLnNlbmQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHhyLmFzc2lnbiA9IGFzc2lnbjtcbiAgeHIudXJsRW5jb2RlID0gdXJsRW5jb2RlO1xuICB4ci5jb25maWd1cmUgPSBjb25maWd1cmU7XG4gIHhyLk1ldGhvZHMgPSBNZXRob2RzO1xuICB4ci5FdmVudHMgPSBFdmVudHM7XG4gIHhyLmRlZmF1bHRzID0gZGVmYXVsdHM7XG5cbiAgeHIuZ2V0ID0gZnVuY3Rpb24gKHVybCwgcGFyYW1zLCBhcmdzKSB7XG4gICAgcmV0dXJuIHhyKGFzc2lnbih7IHVybDogdXJsLCBtZXRob2Q6IE1ldGhvZHMuR0VULCBwYXJhbXM6IHBhcmFtcyB9LCBhcmdzKSk7XG4gIH07XG4gIHhyLnB1dCA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIGFyZ3MpIHtcbiAgICByZXR1cm4geHIoYXNzaWduKHsgdXJsOiB1cmwsIG1ldGhvZDogTWV0aG9kcy5QVVQsIGRhdGE6IGRhdGEgfSwgYXJncykpO1xuICB9O1xuICB4ci5wb3N0ID0gZnVuY3Rpb24gKHVybCwgZGF0YSwgYXJncykge1xuICAgIHJldHVybiB4cihhc3NpZ24oeyB1cmw6IHVybCwgbWV0aG9kOiBNZXRob2RzLlBPU1QsIGRhdGE6IGRhdGEgfSwgYXJncykpO1xuICB9O1xuICB4ci5wYXRjaCA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIGFyZ3MpIHtcbiAgICByZXR1cm4geHIoYXNzaWduKHsgdXJsOiB1cmwsIG1ldGhvZDogTWV0aG9kcy5QQVRDSCwgZGF0YTogZGF0YSB9LCBhcmdzKSk7XG4gIH07XG4gIHhyLmRlbCA9IGZ1bmN0aW9uICh1cmwsIGFyZ3MpIHtcbiAgICByZXR1cm4geHIoYXNzaWduKHsgdXJsOiB1cmwsIG1ldGhvZDogTWV0aG9kcy5ERUxFVEUgfSwgYXJncykpO1xuICB9O1xuICB4ci5vcHRpb25zID0gZnVuY3Rpb24gKHVybCwgYXJncykge1xuICAgIHJldHVybiB4cihhc3NpZ24oeyB1cmw6IHVybCwgbWV0aG9kOiBNZXRob2RzLk9QVElPTlMgfSwgYXJncykpO1xuICB9O1xuXG4gIG1vZHVsZS5leHBvcnRzID0geHI7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW50ZXJvcC1yZXF1aXJlLWRlZmF1bHQnKVsnZGVmYXVsdCddO1xuXG52YXIgX3V0aWwkID0gcmVxdWlyZSgnLi91dGlsLyQnKTtcblxudmFyIF91dGlsJDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF91dGlsJCk7XG5cbnZhciBfeHIgPSByZXF1aXJlKCd4cicpO1xuXG52YXIgX3hyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3hyKTtcblxuKDAsIF91dGlsJDJbJ2RlZmF1bHQnXSkoJ2Zvcm0ucmVnaXN0ZXItZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuXG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAvLyBHZXQgdGhlIHZhbHVlcyBmcm9tIHRoZSBmb3JtIGlucHV0XG4gIHZhciBfY3NyZiA9ICgwLCBfdXRpbCQyWydkZWZhdWx0J10pKCcuZm9ybS1maWVsZC5fY3NyZiBpbnB1dCcpLnZhbCgpO1xuICB2YXIgdXNlcm5hbWUgPSAoMCwgX3V0aWwkMlsnZGVmYXVsdCddKSgnLmZvcm0tZmllbGQudXNlcm5hbWUgaW5wdXQnKS52YWwoKTtcbiAgdmFyIHNlbGVjdGVkSW5kZXggPSAoMCwgX3V0aWwkMlsnZGVmYXVsdCddKSgnI2RvbWFpbnMnKVswXS5zZWxlY3RlZEluZGV4O1xuICB2YXIgZG9tYWluID0gKDAsIF91dGlsJDJbJ2RlZmF1bHQnXSkoKDAsIF91dGlsJDJbJ2RlZmF1bHQnXSkoJyNkb21haW5zIG9wdGlvbicpW3NlbGVjdGVkSW5kZXhdKS52YWwoKTtcbiAgdmFyIGVtYWlsID0gdXNlcm5hbWUgKyAnQCcgKyBkb21haW47XG4gIHZhciB2YWx1ZXMgPSB7XG4gICAgX2NzcmY6IF9jc3JmLFxuICAgIGVtYWlsOiBlbWFpbFxuICB9O1xuXG4gIGlmICghdXNlcm5hbWUpIHtcbiAgICAoMCwgX3V0aWwkMlsnZGVmYXVsdCddKSgnLmZvcm0tZmllbGQudXNlcm5hbWUnKS5yZW1vdmVDbGFzcygnZXJyb3InKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAoMCwgX3V0aWwkMlsnZGVmYXVsdCddKSgnLmZvcm0tZmllbGQudXNlcm5hbWUgLmVycm9ycycpLmh0bWwoJzxwPlBsZWFzZSBzcGVjaWZ5IGEgdXNlcm5hbWU8L3A+Jyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgX3hyMlsnZGVmYXVsdCddLnBvc3QoJy9yZWdpc3Rlci8nLCB2YWx1ZXMpLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcbiAgICB3aW5kb3cubG9jYXRpb24gPSAnL3JlZ2lzdGVyL2VtYWlsLXNlbnQvJyArIGVtYWlsICsgJy8nO1xuICB9LCBmdW5jdGlvbiAocmVzcCkge1xuICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcC5yZXNwb25zZSk7XG5cbiAgICBmb3IgKHZhciBlcnJvciBpbiByZXNwb25zZS5lcnJvcikge1xuICAgICAgdmFyIGVycm9yU3RyaW5nID0gcmVzcG9uc2UuZXJyb3JbZXJyb3JdO1xuXG4gICAgICBpZiAoZXJyb3IgPT09ICdlbWFpbCcpIHtcbiAgICAgICAgZXJyb3IgPSAndXNlcm5hbWUnO1xuICAgICAgfVxuXG4gICAgICAoMCwgX3V0aWwkMlsnZGVmYXVsdCddKSgnLmZvcm0tZmllbGQuJyArIGVycm9yKS5yZW1vdmVDbGFzcygnZXJyb3InKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICgwLCBfdXRpbCQyWydkZWZhdWx0J10pKCcuZm9ybS1maWVsZC4nICsgZXJyb3IgKyAnIC5lcnJvcnMnKS5odG1sKCc8cD4nICsgZXJyb3JTdHJpbmcgKyAnPC9wPicpO1xuICAgIH1cbiAgfSk7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OXRhV2R5WlhaaEwzZHZjbXN2WW5KbFlXdG1ZWE4wTDNOeVl5OWpiR2xsYm5RdmNtVm5hWE4wWlhJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenR4UWtGQll5eFZRVUZWT3pzN08ydENRVU5VTEVsQlFVazdPenM3UVVGRmJrSXNkMEpCUVVVc2IwSkJRVzlDTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1VVRkJVU3hGUVVGRkxGVkJRVk1zUTBGQlF5eEZRVUZGT3p0QlFVVXZReXhIUVVGRExFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTTdRVUZEYmtJc1IwRkJReXhEUVVGRExHVkJRV1VzUlVGQlJTeERRVUZET3pzN1FVRkhjRUlzVFVGQlNTeExRVUZMTEVkQlFVY3NkMEpCUVVVc2VVSkJRWGxDTEVOQlFVTXNRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVNdlF5eE5RVUZKTEZGQlFWRXNSMEZCUnl4M1FrRkJSU3cwUWtGQk5FSXNRMEZCUXl4RFFVRkRMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRM0pFTEUxQlFVa3NZVUZCWVN4SFFVRkhMSGRDUVVGRkxGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMR0ZCUVdFc1EwRkJRenRCUVVOdVJDeE5RVUZKTEUxQlFVMHNSMEZCUnl4M1FrRkJSU3gzUWtGQlJTeHBRa0ZCYVVJc1EwRkJReXhEUVVGRExHRkJRV0VzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNN1FVRkRNVVFzVFVGQlNTeExRVUZMTEVkQlFVMHNVVUZCVVN4VFFVRkpMRTFCUVUwc1FVRkJSU3hEUVVGRE8wRkJRM0JETEUxQlFVa3NUVUZCVFN4SFFVRkhPMEZCUTFnc1UwRkJTeXhGUVVGTUxFdEJRVXM3UVVGRFRDeFRRVUZMTEVWQlFVd3NTMEZCU3p0SFFVTk9MRU5CUVVNN08wRkJSVVlzVFVGQlNTeERRVUZETEZGQlFWRXNSVUZCUlR0QlFVTmlMRFJDUVVGRkxITkNRVUZ6UWl4RFFVRkRMRU5CUVVNc1YwRkJWeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOcVJTdzBRa0ZCUlN3NFFrRkJPRUlzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4clEwRkJhME1zUTBGQlF5eERRVUZETzBGQlF6TkZMRmRCUVU4N1IwRkRVanM3UVVGRlJDeHJRa0ZCUnl4SlFVRkpMRU5CUVVNc1dVRkJXU3hGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4VlFVRlRMRWxCUVVrc1JVRkJSVHRCUVVOb1JDeFZRVUZOTEVOQlFVTXNVVUZCVVN3MlFrRkJNa0lzUzBGQlN5eE5RVUZITEVOQlFVTTdSMEZEY0VRc1JVRkJSU3hWUVVGVExFbEJRVWtzUlVGQlJUdEJRVU5vUWl4UlFVRkpMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenM3UVVGRmVrTXNVMEZCU3l4SlFVRkpMRXRCUVVzc1NVRkJTU3hSUVVGUkxFTkJRVU1zUzBGQlN5eEZRVUZGTzBGQlEyaERMRlZCUVVrc1YwRkJWeXhIUVVGSExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wRkJSWGhETEZWQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1JVRkJSVHRCUVVOeVFpeGhRVUZMTEVkQlFVY3NWVUZCVlN4RFFVRkRPMDlCUTNCQ096dEJRVVZFTEN0RFFVRnBRaXhMUVVGTExFTkJRVWNzUTBGQlF5eFhRVUZYTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEycEZMQ3REUVVGcFFpeExRVUZMTEdOQlFWY3NRMEZCUXl4SlFVRkpMRk5CUVU4c1YwRkJWeXhWUVVGUExFTkJRVU03UzBGRGFrVTdSMEZEUml4RFFVRkRMRU5CUVVNN1EwRkRTaXhEUVVGRExFTkJRVU1pTENKbWFXeGxJam9pTDFWelpYSnpMMjFwWjNKbGRtRXZkMjl5YXk5aWNtVmhhMlpoYzNRdmMzSmpMMk5zYVdWdWRDOXlaV2RwYzNSbGNpNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0FrSUdaeWIyMGdKeTR2ZFhScGJDOGtKenRjYm1sdGNHOXlkQ0I0Y2lCbWNtOXRJQ2Q0Y2ljN1hHNWNiaVFvSjJadmNtMHVjbVZuYVhOMFpYSXRabTl5YlNjcExtOXVLQ2R6ZFdKdGFYUW5MQ0JtZFc1amRHbHZiaWhsS1NCN1hHNWNiaUFnWlM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4dUlDQmxMbk4wYjNCUWNtOXdZV2RoZEdsdmJpZ3BPMXh1WEc0Z0lDOHZJRWRsZENCMGFHVWdkbUZzZFdWeklHWnliMjBnZEdobElHWnZjbTBnYVc1d2RYUmNiaUFnYkdWMElGOWpjM0ptSUQwZ0pDZ25MbVp2Y20wdFptbGxiR1F1WDJOemNtWWdhVzV3ZFhRbktTNTJZV3dvS1R0Y2JpQWdiR1YwSUhWelpYSnVZVzFsSUQwZ0pDZ25MbVp2Y20wdFptbGxiR1F1ZFhObGNtNWhiV1VnYVc1d2RYUW5LUzUyWVd3b0tUdGNiaUFnYkdWMElITmxiR1ZqZEdWa1NXNWtaWGdnUFNBa0tDY2paRzl0WVdsdWN5Y3BXekJkTG5ObGJHVmpkR1ZrU1c1a1pYZzdYRzRnSUd4bGRDQmtiMjFoYVc0Z1BTQWtLQ1FvSnlOa2IyMWhhVzV6SUc5d2RHbHZiaWNwVzNObGJHVmpkR1ZrU1c1a1pYaGRLUzUyWVd3b0tUdGNiaUFnYkdWMElHVnRZV2xzSUQwZ1lDUjdkWE5sY201aGJXVjlRQ1I3Wkc5dFlXbHVmV0E3WEc0Z0lHeGxkQ0IyWVd4MVpYTWdQU0I3WEc0Z0lDQWdYMk56Y21Zc1hHNGdJQ0FnWlcxaGFXeGNiaUFnZlR0Y2JseHVJQ0JwWmlBb0lYVnpaWEp1WVcxbEtTQjdYRzRnSUNBZ0pDZ25MbVp2Y20wdFptbGxiR1F1ZFhObGNtNWhiV1VuS1M1eVpXMXZkbVZEYkdGemN5Z25aWEp5YjNJbktTNWhaR1JEYkdGemN5Z25aWEp5YjNJbktUdGNiaUFnSUNBa0tDY3VabTl5YlMxbWFXVnNaQzUxYzJWeWJtRnRaU0F1WlhKeWIzSnpKeWt1YUhSdGJDZ25QSEErVUd4bFlYTmxJSE53WldOcFpua2dZU0IxYzJWeWJtRnRaVHd2Y0Q0bktUdGNiaUFnSUNCeVpYUjFjbTQ3WEc0Z0lIMWNibHh1SUNCNGNpNXdiM04wS0NjdmNtVm5hWE4wWlhJdkp5d2dkbUZzZFdWektTNTBhR1Z1S0daMWJtTjBhVzl1S0hKbGMzQXBJSHRjYmlBZ0lDQjNhVzVrYjNjdWJHOWpZWFJwYjI0Z1BTQmdMM0psWjJsemRHVnlMMlZ0WVdsc0xYTmxiblF2Skh0bGJXRnBiSDB2WUR0Y2JpQWdmU3dnWm5WdVkzUnBiMjRvY21WemNDa2dlMXh1SUNBZ0lHeGxkQ0J5WlhOd2IyNXpaU0E5SUVwVFQwNHVjR0Z5YzJVb2NtVnpjQzV5WlhOd2IyNXpaU2s3WEc1Y2JpQWdJQ0JtYjNJZ0tIWmhjaUJsY25KdmNpQnBiaUJ5WlhOd2IyNXpaUzVsY25KdmNpa2dlMXh1SUNBZ0lDQWdiR1YwSUdWeWNtOXlVM1J5YVc1bklEMGdjbVZ6Y0c5dWMyVXVaWEp5YjNKYlpYSnliM0pkTzF4dVhHNGdJQ0FnSUNCcFppQW9aWEp5YjNJZ1BUMDlJQ2RsYldGcGJDY3BJSHRjYmlBZ0lDQWdJQ0FnWlhKeWIzSWdQU0FuZFhObGNtNWhiV1VuTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBa0tHQXVabTl5YlMxbWFXVnNaQzRrZTJWeWNtOXlmV0FwTG5KbGJXOTJaVU5zWVhOektDZGxjbkp2Y2ljcExtRmtaRU5zWVhOektDZGxjbkp2Y2ljcE8xeHVJQ0FnSUNBZ0pDaGdMbVp2Y20wdFptbGxiR1F1Skh0bGNuSnZjbjBnTG1WeWNtOXljMkFwTG1oMGJXd29ZRHh3UGlSN1pYSnliM0pUZEhKcGJtZDlQQzl3UG1BcE8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1OUtUdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9kb210YXN0aWNDb21tb25qc1NlbGVjdG9yID0gcmVxdWlyZSgnZG9tdGFzdGljL2NvbW1vbmpzL3NlbGVjdG9yJyk7XG5cbnZhciBfZG9tdGFzdGljQ29tbW9uanNFdmVudCA9IHJlcXVpcmUoJ2RvbXRhc3RpYy9jb21tb25qcy9ldmVudCcpO1xuXG52YXIgX2RvbXRhc3RpY0NvbW1vbmpzRG9tRXh0cmEgPSByZXF1aXJlKCdkb210YXN0aWMvY29tbW9uanMvZG9tL2V4dHJhJyk7XG5cbnZhciBfZG9tdGFzdGljQ29tbW9uanNEb21DbGFzcyA9IHJlcXVpcmUoJ2RvbXRhc3RpYy9jb21tb25qcy9kb20vY2xhc3MnKTtcblxudmFyIF9kb210YXN0aWNDb21tb25qc0RvbUh0bWwgPSByZXF1aXJlKCdkb210YXN0aWMvY29tbW9uanMvZG9tL2h0bWwnKTtcblxuX2RvbXRhc3RpY0NvbW1vbmpzU2VsZWN0b3IuJC5mbiA9IHsgb246IF9kb210YXN0aWNDb21tb25qc0V2ZW50Lm9uLCBvZmY6IF9kb210YXN0aWNDb21tb25qc0V2ZW50Lm9mZiwgdmFsOiBfZG9tdGFzdGljQ29tbW9uanNEb21FeHRyYS52YWwsIGFkZENsYXNzOiBfZG9tdGFzdGljQ29tbW9uanNEb21DbGFzcy5hZGRDbGFzcywgaGFzQ2xhc3M6IF9kb210YXN0aWNDb21tb25qc0RvbUNsYXNzLmhhc0NsYXNzLCByZW1vdmVDbGFzczogX2RvbXRhc3RpY0NvbW1vbmpzRG9tQ2xhc3MucmVtb3ZlQ2xhc3MsIHRvZ2dsZUNsYXNzOiBfZG9tdGFzdGljQ29tbW9uanNEb21DbGFzcy50b2dnbGVDbGFzcywgaHRtbDogX2RvbXRhc3RpY0NvbW1vbmpzRG9tSHRtbC5odG1sIH07XG5cbm1vZHVsZS5leHBvcnRzID0gX2RvbXRhc3RpY0NvbW1vbmpzU2VsZWN0b3IuJDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OXRhV2R5WlhaaEwzZHZjbXN2WW5KbFlXdG1ZWE4wTDNOeVl5OWpiR2xsYm5RdmRYUnBiQzhrTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN08zbERRVUZyUWl3MlFrRkJOa0k3TzNORFFVTjJRaXd3UWtGQk1FSTdPM2xEUVVNNVFpdzRRa0ZCT0VJN08zbERRVU5YTERoQ1FVRTRRanM3ZDBOQlEzUkZMRFpDUVVFMlFqczdRVUZGYkVRc05rSkJRVVVzUlVGQlJTeEhRVUZITEVWQlFVVXNSVUZCUlN3MFFrRkJRU3hGUVVGRkxFZEJRVWNzTmtKQlFVRXNSVUZCUlN4SFFVRkhMR2REUVVGQkxFVkJRVVVzVVVGQlVTeHhRMEZCUVN4RlFVRkZMRkZCUVZFc2NVTkJRVUVzUlVGQlJTeFhRVUZYTEhkRFFVRkJMRVZCUVVVc1YwRkJWeXgzUTBGQlFTeEZRVUZGTEVsQlFVa3NaME5CUVVFc1JVRkJSU3hEUVVGRE96dEJRVVUxUlN4TlFVRk5MRU5CUVVNc1QwRkJUeXdyUWtGQlNTeERRVUZESWl3aVptbHNaU0k2SWk5VmMyVnljeTl0YVdkeVpYWmhMM2R2Y21zdlluSmxZV3RtWVhOMEwzTnlZeTlqYkdsbGJuUXZkWFJwYkM4a0xtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJSHNnSkNCOUlHWnliMjBnSjJSdmJYUmhjM1JwWXk5amIyMXRiMjVxY3k5elpXeGxZM1J2Y2ljN1hHNXBiWEJ2Y25RZ2V5QnZiaXdnYjJabUlIMGdabkp2YlNBblpHOXRkR0Z6ZEdsakwyTnZiVzF2Ym1wekwyVjJaVzUwSnp0Y2JtbHRjRzl5ZENCN0lIWmhiQ0I5SUdaeWIyMGdKMlJ2YlhSaGMzUnBZeTlqYjIxdGIyNXFjeTlrYjIwdlpYaDBjbUVuTzF4dWFXMXdiM0owSUhzZ1lXUmtRMnhoYzNNc0lHaGhjME5zWVhOekxDQnlaVzF2ZG1WRGJHRnpjeXdnZEc5bloyeGxRMnhoYzNNZ2ZTQm1jbTl0SUNka2IyMTBZWE4wYVdNdlkyOXRiVzl1YW5NdlpHOXRMMk5zWVhOekp6dGNibWx0Y0c5eWRDQjdJR2gwYld3Z2ZTQm1jbTl0SUNka2IyMTBZWE4wYVdNdlkyOXRiVzl1YW5NdlpHOXRMMmgwYld3bk8xeHVYRzRrTG1adUlEMGdleUJ2Yml3Z2IyWm1MQ0IyWVd3c0lHRmtaRU5zWVhOekxDQm9ZWE5EYkdGemN5d2djbVZ0YjNabFEyeGhjM01zSUhSdloyZHNaVU5zWVhOekxDQm9kRzFzSUgwN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdKRHRjYmx4dUlsMTkiXX0=
