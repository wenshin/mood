'use strict';

var Type = require('./utils/type').Type;
var Log = require('./utils/log').Log;

var Scope = function(chainPrefix, triggerHook, schema) {
  /*
   * <param chainPrefix>: 用来确定当前scope的作用域，比如说'abc.a'
   *   表明当前的schema参数的属性name，可以通过'abc.a.name' 来引用;
   *   当对`schema.name`进行赋值时，可以触发会冒泡执行绑定在abc上的钩子
   *   函数，钩子函数队列在hook.Manager中管理。
   *
   * */
  // This _name is a scope name
  this._name = chainPrefix || '';
  this._triggerHook = triggerHook;
  if ( schema && Type.isObject(schema) ) {
    for ( var p in schema ) {
      if ( schema.hasOwnProperty(p) ) {
        this.addProp(p, schema[p]);
      }
    }
  }
};

Scope.prototype.addProp = function (name, value) {
  // 用于缓存当前Scope对象属性的值，以让getter可以正常获得
  var upper = this;
  var inner = '__p_' + name; // 属性的值保存在'__p_test'
  var chainedName = this.chainName(name);

  Object.defineProperty(this, name, {
    set: function(value) {
      if ( Type.isObject(value) ) {
        // 创建子Scope
        upper[inner] = new Scope(chainedName, upper._triggerHook, value);
      } else {
        upper[inner] = value;
      }
      upper._triggerHook(chainedName);
      Log.print(['Set ', chainedName, ': ', value, '; HookName: ', chainedName], 'log');
    },
    get: function() {
      Log.print([
        'Get ', chainedName, ': ', upper[inner],
        '; HookName: ', chainedName,
        '; ScoptName: ', upper._name], 'log');
      return upper[inner];
    },
  });

  this[name] = value;
};

Scope.prototype.getName = function() {
  return this._name;
};

Scope.prototype.chainName = function(propName) {
  return this._name + '.' + propName;
};

Scope.prototype.defineControllers = function(controllers) {
  var scope = this;
  controllers = Type.toArray(controllers);
  controllers.forEach(function(controller) {
    controller.call(null, scope);
  });
};

exports.Scope = Scope;
