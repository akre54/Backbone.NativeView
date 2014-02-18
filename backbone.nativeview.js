// Backbone.NativeView.js 0.1.0
// ---------------

//     (c) 2014 Adam Krebs
//     Backbone.NativeView may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/akre54/Backbone.NativeView

(function (factory) {
  if (typeof define === 'function' && define.amd) { define(['underscore', 'backbone'], factory);
  } else if (typeof exports === 'object') { factory(require('underscore'), require('backbone'));
  } else { factory(_, Backbone); }
}(function (_, Backbone) {
  // Cached regex to match an opening '<' of an HTML tag, possibly left-padded
  // with whitespace.
  var paddedLt = /^\s*</;

  // Caches a local reference to `Element.prototype` for faster access.
  var ElementProto = typeof Element != 'undefined' && Element.prototype;

  // Given an object `obj` and an operation `op`, which must be either `add` or
  // `remove`, this function returns either the native implementation of the
  // [add|remove]EventListener method directly or a function that delegates to
  // IE's [attach|detach]Event methods.
  function makeEventListener(obj, op) {
    if (obj[op + 'EventListener']) return obj[op + 'EventListener'];
    var func = op == 'add' ? obj.attachEvent : obj.detachEvent;
    return function (eventName, listener) {
      func.call(this, 'on' + eventName, listener);
    };
  }

  // Caches the window's event listener methods for IE and Safari.
  var windowAddEventListener = typeof window != 'undefined' &&
      makeEventListener(window, 'add');
  var windowRemoveEventListener = typeof window != 'undefined' &&
      makeEventListener(window, 'remove');

  // Caches the Element prototype's event listener methods for everything else.
  var elementAddEventListener = makeEventListener(ElementProto, 'add');
  var elementRemoveEventListener = makeEventListener(ElementProto, 'remove');

  // Find the right `Element#matches` for IE>=9 and modern browsers.
  var matchesSelector = ElementProto && ElementProto.matches ||
      ElementProto[_.find(['webkit', 'moz', 'ms', 'o'], function(prefix) {
        return !!ElementProto[prefix + 'MatchesSelector'];
      }) + 'MatchesSelector'] ||
      // Make our own `Element#matches` for IE8
      function(selector) {
        // We'll use querySelectorAll to find all element matching the selector,
        // then check if the given element is included in that list.
        // Executing the query on the parentNode reduces the resulting nodeList,
        // document doesn't have a parentNode, though.
        var nodeList = (this.parentNode || document).querySelectorAll(selector) || [];
        for (var i = 0, l = nodeList.length; i < l; i++) {
          if (nodeList[i] == this) return true;
        }
        return false;
      };

  Backbone.NativeView = Backbone.View.extend({

    _domEvents: null,

    constructor: function() {
      this._domEvents = [];
      return Backbone.View.apply(this, arguments);
    },

    $: function(selector) {
      return this.find(selector);
    },

    $$: function(selector) {
      return this.findAll(selector);
    },

    find: function(selector) {
      return this.el.querySelector(selector);
    }

    findAll: function(selector) {
      return this.el.querySelectorAll(selector);
    },

    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      for (var attr in attrs) {
        el.setAttribute(attr, attrs[attr]);
      }
      if (content != null) el.innerHTML = content;
      return el;
    },

    remove: function() {
      this.undelegateEvents();
      if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
      return this;
    },

    setElement: function(element, delegate) {
      if (this.el) this.undelegateEvents();
      if (typeof element == 'string') {
        if (paddedLt.test(element)) {
          var el = document.createElement('div');
          el.innerHTML = element;
          this.el = el.firstChild;
        } else {
          this.el = document.querySelector(element);
        }
      } else {
        this.el = element;
      }
      return this;
    },

    // Make a event delegation handler for the given `eventName` and `selector`
    // and attach it to `this.el`.
    // If selector is empty, the method will be bound to `this.el`. If not, a
    // new handler that will recursively traverse up the event target's DOM
    // hierarchy looking for a node that matches the selector. If one is found,
    // the event's `delegateTarget` property is set to it and the return the
    // result of calling bound `method` with the parameters given to the
    // handler.
    delegate: function(eventName, selector, method) {
      var root = this.el, handler;
      if (!selector) handler = method;
      else handler = function (e) {
        var node = e.target || e.srcElement;
        for (; node && node != root; node = node.parentNode) {
          if (matchesSelector.call(node, selector)) {
            e.delegateTarget = node;
            return method.apply(this, arguments);
          }
        }
      };

      elementAddEventListener.call(root, eventName, handler, false);
      this._domEvents.push({eventName: eventName, handler: handler});
      return this;
    },

    undelegateEvents: function() {
      var el = this.el, domEvents = this._domEvents, i, l, item;
      if (el) {
        for (i = 0, l = domEvents.length; i < l; i++) {
          item = domEvents[i];
          elementRemoveEventListener.call(el, item.eventName, item.handler, false);
        }
        this._domEvents = [];
      }
      return this;
    }
  });

  return Backbone.NativeView;
}));
