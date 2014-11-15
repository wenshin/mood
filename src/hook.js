'use strict';

var Log = require('./utils/log').Log;
var Processor = require('./utils/processor').Processor;
var ChainName = require('./utils/chainame').ChainName;

// 支持a.b.c的属性名，直接使用a的Hooks
var Manager = function() {
  this._hooks = {};
  this._scopes = {};
};

Manager.prototype.add = function(scope, hooks) {
  // <param scope>: hook in hooks will call hook.call(win, scope)
  // <param hooks>: must be a Array
  var hookName = scope.getName();
  var savedHooks = this._hooks[hookName] || [];
  var _hooks = [];
  hooks.forEach(function(hook) {
    _hooks.push(new Processor(hook));
  });
  this._hooks[hookName] = savedHooks.concat(_hooks);
  this._scopes[hookName] = scope;
};

// 传入链式名称‘abc.bcd.dd’，解析所有要运行的hook
Manager.prototype.run = function(name){
  var upper = this;
  var hookNames = Manager.getAllHookNames(name);
  hookNames.forEach(function(hookName) {
    upper.runSingle(hookName);
  });
};

// 运行this._hooks中单个属性对应的hook 队列
Manager.prototype.runSingle = function(hookName) {
  var hooks = this._hooks[hookName];
  var scope = this._scopes[hookName];
  if ( !hooks ) {
    Log.print([hookName, ' Warning: hook not exist! If the not add ', hookName, ', please ignore this warning.'], 'log');
    return;
  }
  if ( !scope ) {
    Log.print([hookName, ' Error: scope not exist!'], 'error');
    return;
  }
  hooks.forEach(function(hook) {
    if ( hook instanceof Processor ) {
      // 'this' is 'window' when use brower
      hook.process(this, [scope]);
    } else {
      Log.print([hookName, ' Error: hook must be a Function'], 'error');
    }
  });
};

Manager.getAllHookNames = function(name) {
  var names = ChainName.resolve(name);
  var _names = [];
  // reduce要注意加initial值和不加的区别
  names.reduce(function(prev, cur) {
    // 这里name是不会是空字符串的情况，所以下面的使用可以应付相关问题
    var name = prev ? ChainName.join([prev, cur]) : cur;
    _names.push(name);
    return name;
  }, '');
  return _names;
};

exports.Manager = Manager;
