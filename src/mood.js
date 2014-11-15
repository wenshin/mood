'use strict';

var scope = require('./scope');
var hook = require('./hook');
var Type = require('./utils/type').Type;
var Log = require('./utils/log').Log;

// Mood constructor
function Mood(name) {
  var mo = this;
  this.hookManager = hook.Manager;
  this.rootScope = new scope.Scope(name || '', function(name) {
    mo.hookManager.run(name);
  });
}

Mood._config = {
  debug: false
};

Mood.config = function(option) {
  for ( var p in option ) {
    if ( option.hasOwnProperty(p) ) {
      Mood._config[p] = option[p];
    }
  }
  Log.debug = Mood._config.debug;
};

Mood.prototype.initScope = function(name, schema, controllers, hooks) {
  // <params schema>: is a Object or model structure
  var scope = this.addScope(name, schema);

  // Must before controller
  hooks = Type.toArray(hooks);
  this.hookManager.add(scope, hooks);

  controllers = Type.toArray(controllers);
  controllers.forEach(function(controller) {
    controller.call(null, scope);
  });
};

Mood.prototype.getScope = function(name) {
  return this.rootScope[name];
};

Mood.prototype.addScope = function(name, schema) {
  this.rootScope.addProp(name, schema);
  return this.rootScope[name];
};

exports.Mood = Mood;
