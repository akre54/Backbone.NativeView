(function() {

  var _ = require('underscore'),
      Backbone = require('backbone');

  // When testing alternative View implementations, change this varaible.
  var View = Backbone.NativeView;

  var view;

  module("Backbone.NativeView", {

    setup: function() {
      view = new View({el: '#testElement'});
    }

  });

  test("extending", 3, function() {
    var BaseView = Backbone.View.extend();
    var NativeView = Backbone.NativeView;

    var ExtendedView = Backbone.View.extend(Backbone.NativeViewMixin);

    var MixinView = _.extend(BaseView, Backbone.NativeViewMixin);
    MixinView.prototype.initialize = function(options) { this._domEvents = []; }

    ok((new NativeView)._domEvents);
    ok((new ExtendedView)._domEvents);
    ok((new MixinView)._domEvents);
  });

  test("View#$", function() {
    var result = view.$('h1');
    equal(result.length, 1);
    equal(result[0].tagName, 'h1');
    equal(result[0].nodeType, 1);
  });

  test("delegate and undelegate", 9, function() {
    var counter1 = 0, counter2 = 0;
    view.delegate('click', function() { counter1++; });
    addEventListener.call(view.el, 'click', function() { counter2++ });

    click(view.el);

    equal(counter1, 1);
    equal(counter3, 1);
    equal(view._domEvents.length, 1);

    view.undelegate('click');

    click(view.el);

    equal(counter1, 1);
    equal(counter2, 2);
    equal(view._domEvents.length, 0);
  });




  // Cross-browser helpers
  var addEventListener = typeof Element != 'undefined' && Element.prototype.addEventListener || function(eventName, listener) {
    return this.attachEvent('on' + eventName, listener);
  };

  function click(element) {
    var event;
    if (document.createEvent) {
      event = document.createEvent('MouseEvent');
      var args = [
        'click', true, true,
        // IE 10+ and Firefox require these
        event.view, event.detail, event.screenX, event.screenY, event.clientX,
        event.clientY, event.ctrlKey, event.altKey, event.shiftKey,
        event.metaKey, event.button, event.relatedTarget
      ];
      (event.initMouseEvent || event.initEvent).apply(event, args);
    } else {
      event = document.createEventObject();
      event.type = 'click';
      event.bubbles = true;
      event.cancelable = true;
    }

    if (element.dispatchEvent) {
      return element.dispatchEvent(event);
    }
    element.fireEvent('onclick', event);
  }
})();