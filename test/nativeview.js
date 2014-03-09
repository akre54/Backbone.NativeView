(function() {

  // When testing alternative View implementations, change this varaible.
  var View = Backbone.NativeView;

  var view;

  module("Backbone.NativeView", {

    setup: function() {
      view = new View({el: '#testElement'});
    }

  });

  test("undelegate", 9, function() {
    var counter1 = 0, counter2 = 0, counter3 = 0;
    view.delegate('click', function() { counter1++; });
    view.delegate('click.namespace', function() { counter2 ++; });
    addEventListener.call(view.el, 'click', function() { counter3++ });

    equal(view._domEvents.length, 2);

    click(view.el);

    view.undelegate('.namespace');

    click(view.el);

    equal(counter1, 2);
    equal(counter2, 1);
    equal(counter3, 2);
    equal(view._domEvents.length, 1);

    view.undelegate('click');

    click(view.el);

    equal(counter1, 2);
    equal(counter2, 1);
    equal(counter3, 3);
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