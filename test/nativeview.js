(function() {

  var Backbone = require('backbone');

  // When testing alternative View implementations, change this varaible.
  var View = Backbone.NativeView;

  var view;

  module("Backbone.NativeView", {

    setup: function() {
      view = new View({el: '#testElement'});
    }

  });

  test("undelegate", 9, function() {
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