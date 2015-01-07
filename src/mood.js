'use strict';

var doc = document;
var Scope = require('./scope').Scope;
var Log = require('./utils/log').Log;
var MoErrors = require('./error').MoErrors;
var moAttrs = require('./moattr').moAttrs;
var $ = require('./lib/jquery.core').jQuery;

var Mood = {};

Mood._scopes = {};

Mood._config = {
  debug: false,
  bootstrap: false
};


Mood.config = function(option) {
  $.extend(Mood._config, option);
  Log.debug = Mood._config.debug;
};


Mood.getScope = function(name) {
  return this._scopes[name];
};

Mood.addScope = function(name, obj, renders, controllers) {
  if ( name in this._scopes ) {
    throw MoErrors.ScopeRepeatError('Do not repeat scope name!');
  }
  var scope;
  scope = new Scope(name, obj);
  scope.addRenderObjs(renders);
  scope.runControllers(controllers);
  this._scopes[name] = scope;
  return scope;
};

Mood.bootstrap = function(defaultValues) {
  defaultValues = defaultValues || {};
  var scopeElems = doc.querySelectorAll(moAttrs.scopeSelector);
  var scopeParams;

  $.each(scopeElems, function(_, elem) {
    var scopeName = elem.getAttribute(moAttrs.SCOPE_ATTR);
    scopeParams = moAttrs.parseScope(elem);
    Mood.addScope(scopeName, $.extend(true, scopeParams.obj, defaultValues[scopeName]),
                  scopeParams.renders, scopeParams.controllers);
  });
  return scopeParams;
};

// 默认初始化项目
if ( Mood._config.bootstrap ) {
  Mood.bootstrap();
}

exports.Mood = Mood;
