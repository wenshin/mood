'use strict';

var Type = require('./utils/type').Type;
var Log = require('./utils/log').Log;

var Scope = function(name, schema) {
  this.name = name;
  this.selfUpdatorName = '__self';
  this.Controller = {};
  // 用于缓存当前Scope对象属性的值，以让getter可以正常获得
  this._updator = {};
  this._props = {};
  this._lastProps = {};
  if ( schema && Type.isObject(schema) ) {
    for ( var p in schema ) {
      if ( schema.hasOwnProperty(p) ) {
        this.addProp(p, schema[p]);
      }
    }
  }
};

Scope.prototype.addProp = function (name, defaultValue, updators) {
  // 如果 defaultValue 不使用建议设置为 null。
  var upper = this;
  var chainedName = this.chainName(name);
  this.addUpdators(name, updators);

  Object.defineProperty(this, name, {
    set: function(value) {
      if ( upper.propNotChanged(name, value) ) { return; }

      if ( Type.isObject(value) ) {
        // 创建子Scope
        upper._setProp(name, new Scope(chainedName, value));
      } else {
        upper._setProp(name, value);
      }
      upper.trigger(name);

      Log.print(['Set ', chainedName, ': ', value], 'log');
    },
    get: function() {
      Log.print([
        'Get ', chainedName, ': ', upper._getProp(name),
        '; ScopeName: ', upper.name], 'log');
      return upper._getProp(name);
    },
  });

  this._setProp(name, defaultValue);
};

Scope.prototype.addUpdators = function(name, updators) {
  // 当name 参数不是字符串时，也即 name 参数不传递时，保存 updators 到
  // this.selfUpdatorName 的属性下。该属性下的函数列表会在任务和属性修
  // 改时触发。
  if ( !Type.isString(name) ) {
    updators = name;
    name = this.selfUpdatorName;
  }
  updators = updators || [];
  if ( Type.isFunction(updators) ) { updators = [updators]; }

  if ( this._updator[name] ) {
    this._updator[name].concat(updators);
  } else {
    this._updator[name] = updators;
  }
};

Scope.prototype.trigger = function(names) {
  var updators = [], i;
  var _concat = function(array) {
    updators = updators.concat(array || []);
  };
  if ( Type.isString(names) ) { names = [names]; } // names 是单个属性名称

  for ( i = 0; i < names.length; i++ ) {
    _concat(this._updator[names[i]]);
  }
  _concat(this._updator[this.selfUpdatorName]);

  for ( i = 0; i < updators.length; i++ ) {
    updators[i].call(this.copy());
  }
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
  return this.name + '.' + propName;
};

Scope.prototype.copy = function() {
  // copy a scope, but if changed will not trigger update functions
  var copy = {};
  var props = this._props;
  for ( var p in props ) {
    if ( props.hasOwnProperty(p) ) {
      if ( props[p] instanceof Scope ) {
        copy[p] = props[p].copy();
      } else {
        copy[p] = props[p];
      }
    }
  }
  return copy;
};

exports.Scope = Scope;
