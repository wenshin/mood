'use strict';

var mood = require('./mood');
var Type = require('./utils/type').Type;
var Log = require('./utils/log').Log;

var Scope = function(app, schema, chain) {
  /*
   * <param chain>: 用来确定当前scope的作用域，比如说'abc.a.b'
   *   表明当前的schema参数的属性name，可以通过'abc.a.b.name' 来引用;
   *   当对`schema.name`进行赋值时，可以触发`this.hooks`中名称为的'abc'，
   *   'abc.a', 'abc.b'的 hook 队列；
   *
   *
   * Usage:
   *   var m = new Scope(app, schema, chain)
   *
   * */
  if ( !(app instanceof mood.Mood) ) {
    Log.print('Scope instance error: no app parameter exist!', 'error');
    return;
  }
  // This __name is a scope name
  this.__name = chain;
  this._app = app;
  if ( schema && Type.isObject(schema) ) {
    for ( var p in schema ) {
      if ( schema.hasOwnProperty(p) ) {
        this.addProp(p, chain);
      }
    }
  }
};

Scope.prototype.addProp = function (name, chain) {
  // 用于缓存当前Scope对象属性的值，以让getter可以正常获得
  var upper = this;
  var app = this._app;
  var inner = '__p_' + name; // 属性的值保存在'__p_test'

  // chain 参考 Scope chain 参数说明
  chain = chain ? chain + '.' : '';
  var chainName = chain + name;

  Object.defineProperty(upper, name, {
    set: function(value) {
      if ( Type.isObject(value) ) {
        // 创建子Scope
        this[inner] = new Scope(app, value, chainName);
      } else {
        this[inner] = value;
      }
      app.hooks.run(chainName);
      Log.print(['Set ', chainName, ': ', value, '; HookName: ', chainName], 'log');
    },
    get: function() {
      Log.print(['Get ', chainName, ': ', this[inner], '; HookName: ', chainName], 'log');
      return this[inner];
    },
  });

};

Scope.prototype.getName = function() {
  return this.__name;
};

exports.Scope = Scope;
