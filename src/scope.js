'use strict';

var Log = require('./utils/log').Log;
var ChainName = require('./utils/chainame').ChainName;
var Helpers = require('./utils/helper').Helpers;
var $ = require('./lib/jquery.core').jQuery;


var Scope = function(name, props) {
  var scope = this;
  scope.name = name;
  // 用于缓存当前Scope对象属性的值，以让getter可以正常获得
  scope._props = {};
  scope._lastProps = {};

  props = props || {};
  if ( $.isPlainObject(props) ) {
    $.extend(props, Scope.defaultHelpers);
    $.each(props, function(prop, value) {
      scope.addProp(prop, value);
    });
  }
};

Scope._renders = {};
Scope.defaultHelpers = Helpers;

Scope.prototype.addProp = function (name, defaultValue, renders) {
  var scope = this;
  var chainedName = this.chainName(name);
  this.addRenders(chainedName, renders);

  Object.defineProperty(this, name, {
    set: function(value) {
      if ( scope.propNotChanged(name, value) ) { return; }

      if ( $.isPlainObject(value) ) {
        // 创建子Scope
        scope._setProp(name, new Scope(chainedName, value));
      } else {
        scope._setProp(name, value);
      }
      scope.triggerRenders(chainedName);

      Log.print(['Set ', chainedName, ': ', value], 'log');
    },
    get: function() {
      Log.print([
        'Get ', chainedName, ': ', scope._getProp(name),
        '; ScopeName: ', scope.name], 'log');
      return scope._getProp(name);
    },
  });

  // 如果 defaultValue 不使用默认赋值null。
  this._setProp(name, defaultValue || null);
};

Scope.prototype.addRenders = function(name, renders) {
  // 当name 参数不是字符串时，也即 name 参数不传递时，保存 renders 到
  // this.name 的属性下。该属性下的函数列表会在任务和属性修
  // 改时触发。
  if ( $.type(name) !== 'string' ) {
    renders = name;
    name = this.name;
  }
  renders = renders || [];
  if ( $.isFunction(renders) ) { renders = [renders]; }

  if ( Scope._renders[name] ) {
    Scope._renders[name] = Scope._renders[name].concat(renders);
  } else {
    Scope._renders[name] = renders;
  }
};

Scope.prototype.addRenderObjs = function(renderObj) {
  if ( !$.isPlainObject(renderObj) ) {
    throw new TypeError('Scope.addRenderObjs need a plain object argument.');
  }
  var scope = this;
  $.each(renderObj, function (name, renders) {
    scope.addRenders(scope.chainName(name), renders);
  });
};

Scope.prototype.helper = function(name, helper) {
  this.addProp(name, helper);
};

Scope.prototype.triggerRenders = function(names) {
  var renders = [], i;
  var _concat = function(array) {
    renders = renders.concat(array || []);
  };
  if ( $.type(names) === 'string' ) { names = [names]; } // names 是单个属性名称

  for ( i = 0; i < names.length; i++ ) {
    _concat(Scope._renders[names[i]]);
  }
  _concat(Scope._renders[this.name]);

  for ( i = 0; i < renders.length; i++ ) {
    renders[i].call(null, this.copy());
  }
};

Scope.prototype.runControllers = function(controllers) {
  if ( !$.isArray(controllers) ) {
    throw new TypeError('Scope.runControllers(controllers) need a Array argument.');
  }
  var scope = this;
  $.each(controllers, function(_, control){
    control(scope);
  });
};

Scope.prototype._setProp = function(name, value) {
  this._lastProps[name] = this._props[name];
  this._props[name] = value;
};

Scope.prototype._getProp = function(name) {
  return this._props[name];
};

Scope.prototype.propNotChanged = function(name, value) {
  return this._props[name] === value;
};

Scope.prototype.chainName = function(propName) {
  return ChainName.join([this.name, propName]);
};

Scope.prototype.copy = function() {
  // copy a scope, if property changed will not trigger render functions
  return $.extend({}, this._props);
};

exports.Scope = Scope;
