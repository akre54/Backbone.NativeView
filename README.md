Backbone.NativeView
===================

A drop-in replacement for Backbone.View that uses only native DOM methods for
element selection and event delegation. It has no dependency on jQuery.

NOTE: Backbone.NativeView relies on version 1.2.0 of Backbone.
Backbone 1.1.2 is **not compatible** with Backbone.NativeView.

To Use:
-------
Load Backbone.NativeView with your favorite module loader or add as a script
tag after you have loaded Backbone in the page. Wherever you had previously
inherited from Backbone.View, you will now inherit from Backbone.NativeView.

```js
var MyView = Backbone.NativeView.extend({
  initialize: function(options) {
    // ...
  }
});
```

As an alternative, you may extend an existing View's prototype to use native
methods, or even replace Backbone.View itself:

```js
var MyBaseView = Backbone.View.extend(Backbone.NativeViewMixin);
```

or

```js
var MyBaseView = Backbone.View.extend({
  initialize: function(options) {
    // If you go the prototype extension route be sure to set _domEvents in
    // initialize yourself.
    this._domEvents = [];
  }
});

_.extend(MyBaseView.prototype, Backbone.NativeViewMixin);
```

or

```js
Backbone.View = Backbone.NativeView;

var MyView = Backbone.View.extend({
  initialize: function(options) {
    // ...
  }
});
```

Features:
---------
Delegation:
```js
var view = new MyView({el: '#my-element'});
view.delegate('click', view.clickHandler);
```

Undelegation with event names or listeners,
```js
view.undelegate('click', view.clickHandler);
view.undelegate('click');
```

View-scoped element finding:
```js
// for one matched element
_.first(view.$('.box')).focus();

// for multiple matched elements
_.each(view.$('.item'), function(el) {
  el.classList.remove('active')
});
var fields = _.pluck(view.$('.field'), 'innerHTML');
```

Requirements:
-------------
NativeView makes use of `querySelector` and `querySelectorAll`. For IE7 and
below you must include a polyfill.

Notes:
------
* The `$el` property no longer exists on Views. Use `el` instead.
* `View#$` returns a NodeList instead of a jQuery context. You can
  iterate over either using `_.each`.


With many thanks to @wyuenho for his initial code.

