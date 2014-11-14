// This module pretend to reuse between NodeJS and RequireJS
// If only use for brower you'd preffer use
// define(['module'], function(module){})

({ define: typeof define === 'function'
  ? define  // browser require.js
  : function(F) { F(require,exports,module); } }).  // Node.js
define(function (require, exports, module) {
  'use strict';

  var scope = require('./scope');
  var hook = require('./hook');
  var utils = require('./utils');

  var Type = utils.Type;
  var Log = utils.Log;

  // Mood constructor
  function Mood() {
    this.hooks = new hook.Hook();
    this.rootScope = new scope.Scope(this);
  }

  Mood._config = {
    debug: false
  };

  Mood.config = function(option) {
    for ( var p in option ) {
      if ( option.hasOwnProperty(p) ) {
        Mood._config = option[p];
      }
    }
    Log.debug = Mood._config.debug;
  };

  Mood.prototype.createScope = function(name, schema, controllers, hooks) {
    // <params schema>: is a Object or model structure
    var scope = this.addScope(name, schema);
    // Must before controller
    this.bindHooks(scope, hooks);
    this.initControllers(scope, controllers);
  };

  Mood.prototype.getScope = function(name) {
    return this.rootScope[name];
  };

  Mood.prototype.addScope = function(name, schema) {
    this.rootScope.addProp(name);
    this.rootScope[name] = schema;
    return this.rootScope[name];
  };

  Mood.prototype.bindHooks = function(scope, hooks) {
    if ( Type.isFunction(hooks) ) {
      hooks = [hooks];
    }
    this.hooks.add(scope, hooks);
  };

  Mood.prototype.initControllers = function(scope, contrs) {
    if ( Type.isFunction(contrs) ) {
      contrs = [contrs];
    }
    contrs.forEach(function(contr) {
      contr.call(window, scope);
    });
  };

  exports.Mood = Mood;
});

