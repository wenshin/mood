'use strict';

var Log = require('./utils/log').Log;
var ChainName = require('./utils/chainame').ChainName;
var $ = require('./lib/jquery.core').jQuery;


var Scope = function(name, props) {
  var scope = this;
  scope.name = name;
  scope.selfRenderName = '__self';
  scope._controller = {};
  scope._renders = {};
  // 用于缓存当前Scope对象属性的值，以让getter可以正常获得
  scope._props = {};
  scope._lastProps = {};
  if ( props && $.isPlainObject(props) ) {
    $.each(props, function(prop, value) {
      scope.addProp(prop, value);
    });
  }
};


Scope.prototype.addProp = function (name, defaultValue, renders) {
  // 如果 defaultValue 不使用建议设置为 null。
  var upper = this;
  var chainedName = this.chainName(name);
  this.addRenders(name, renders);

  Object.defineProperty(this, name, {
    set: function(value) {
      if ( upper.propNotChanged(name, value) ) { return; }

      if ( $.isPlainObject(value) ) {
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

Scope.prototype.addRenders = function(name, renders) {
  // 当name 参数不是字符串时，也即 name 参数不传递时，保存 renders 到
  // this.selfRenderName 的属性下。该属性下的函数列表会在任务和属性修
  // 改时触发。
  if ( $.type(name) !== 'string' ) {
    renders = name;
    name = this.selfRenderName;
  }
  renders = renders || [];
  if ( $.isFunction(renders) ) { renders = [renders]; }

  if ( this._renders[name] ) {
    this._renders[name] = this._renders[name].concat(renders);
  } else {
    this._renders[name] = renders;
  }
};

Scope.prototype.addRenderObjs = function(renderObj) {
  if ( !$.isPlainObject(renderObj) ) {
    throw new TypeError('Scope.addRenderObjs need a plain object argument.');
  }
  var scope = this;
  $.each(renderObj, function (name, renders) {
    scope.addRenders(name, renders);
  });
};

Scope.prototype.trigger = function(names) {
  var renders = [], i;
  var _concat = function(array) {
    renders = renders.concat(array || []);
  };
  if ( $.type(names) !== 'string' ) { names = [names]; } // names 是单个属性名称

  for ( i = 0; i < names.length; i++ ) {
    _concat(this._renders[names[i]]);
  }
  _concat(this._renders[this.selfRenderName]);

  for ( i = 0; i < renders.length; i++ ) {
    renders[i].call(this.copy());
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
