'use strict';

var Type = require('./utils/type').Type;
var Log = require('./utils/log').Log;

var Scope = function(name, schema) {
  this.name = name;
  this.updator = {};
  // 用于缓存当前Scope对象属性的值，以让getter可以正常获得
  this.__props = {};
  this.__lastProps = {};
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
  updators = updators || [];
  if ( !Type.isArray(updators) ) { updators = [updators]; }
  if ( this.updator[name] ) {
    this.updator[name].concat(updators);
  } else {
    this.updator[name] = updators;
  }
};

Scope.prototype.trigger = function(name) {
  var updators = this.updator[name];
  for ( var h in updators ) {
    updators[h].call(this.copy());
  }
};

Scope.prototype._setProp = function(name, value) {
  this.__lastProps[name] = this.__props[name];
  this.__props[name] = value;
};

Scope.prototype._getProp = function(name) {
  return this.__props[name];
};

Scope.prototype.propNotChanged = function(name, value) {
  return this.__props[name] === value;
};

Scope.prototype.chainName = function(propName) {
  return this.name + '.' + propName;
};

Scope.prototype.copy = function() {
  // copy a scope, but if changed will not trigger update functions
  var copy = {};
  var props = this.__props;
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
