function Wire() {
  if (!(this instanceof Wire))
    return new Wire;

  this.listenerId=0;
  this.listeners={};
  this.propagate = false;
}

Wire.prototype = {
  AppendListener: function (listener, ctx) {
    var id = this.listenerId++;
    listeners.push([id,listener, ctx]);
  },

  PrependListener: function (listener, ctx) {
    var id = this.listenerId++;
    listeners.unshift([id,listener]);
  },

  StopPropagation: function () {
    this.propagate = false;
  },

  Emit: function (args) {
    var len = listeners.length;
    for (var i = 0; i < len; i++) {
      listeners[i][1].apply(this)
    }
  }
}

action = Wire();

action.AppendListener(function (param1, param2, param3) {
});
action.PrependListener(test);

action.StopPropagation();
action.Emit(param1,param2,param3);
action.Collect(param1,param2,param3)
