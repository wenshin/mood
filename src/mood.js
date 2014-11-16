'use strict';

var scope = require('./scope');
var hook = require('./hook');
var bootstrap = require('./bootstrap');
var Type = require('./utils/type').Type;
var Log = require('./utils/log').Log;
var win = window || {};

// Mood constructor
function Mood(name) {
  var mood = this;
  this.rootScope = new scope.Scope(name || '', function(name) {
    hook.Manager.run(name);
  });
  bootstrap.initScope(function(scopeName, schema, hooks){
    mood.createScope(scopeName, schema, null, hooks);
  });
  win.moApp = this;
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

Mood.prototype.createScope = function(name, schema, controllers, hooks) {
  // <params schema>: is a Object or model structure
  var scope = this.addScope(name, schema);

  // Must before controller
  hooks = Type.toArray(hooks);
  hook.Manager.add(scope, hooks);
  return scope;
};

Mood.prototype.getScope = function(name) {
  return this.rootScope[name];
};

Mood.prototype.addScope = function(name, schema) {
  this.rootScope.addProp(name, schema);
  return this.rootScope[name];
};

exports.Mood = Mood;
