(function () {

function Wire() {
  if (!(this instanceof Wire))
    return new Wire();

  this.listenerId = 0;
  this.listeners = [];
  this.propagate = false;
}

Wire.prototype = {
  AppendListener: function (listener, ctx) {
    var id = this.listenerId++;
    this.listeners.push([id, listener, ctx || this]);
    return id;
  },

  PrependListener: function (listener, ctx) {
    var id = this.listenerId++;
    this.listeners.unshift([id, listener, ctx || this]);
    return id;
  },

  RemoveListener: function (id) {
    if (this.propagate) {
      console.log('cannot remove listener while emitting');
      return false;
    }
    for (var i = 0, len = this.listeners.length; i < len; i++) {
      if (this.listeners[i][0] == id) {
        this.listeners.splice(i,1);
        return true;
      }
    }

    return false;
  },

  CountListeners: function () {
    return this.listeners.length;
  },

  StopPropagation: function () {
    this.propagate = false;
  },

  Emit: function () {
    this.propagate = true;
    for (var i = 0, len = this.listeners.length; i < len; i++) {
      this.listeners[i][1].apply(this.listeners[i][2], arguments);
      if (!this.propagate) break;
    }
    this.propagate = false;
  },

  Collect: function () {
    var ret = [];
    this.propagate = true;
    for (var i = 0, len = this.listeners.length; i < len; i++) {
      ret.push(this.listeners[i][1].apply(this.listeners[i][2], arguments));
      if (!this.propagate) break;
    }
    this.propagate = false;
    return ret;
  }
};

if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
  module.exports = Wire;
else if (typeof define === "function" && define.amd)
  define(function () { return Wire; });
else
  window.Wire = Wire;

})();
