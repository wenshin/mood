(function(win) {
  'use strict';

  var Utils = {};

  Utils.Type = {
    isObject: function(v) {
      return v instanceof Object;
    },
    isFunction: function(v) {
      return v instanceof Function;
    },
    isArray: function(v) {
      return v instanceof Array;
    }
  };

  Utils.Log = {
    print: function(msg, type) {
      // Mood 开启 debug 时才打印log
      if ( !win.Mood._config.debug ) {
        return;
      }
      // TODO: to be more beautyful
      if ( Utils.Type.isArray(msg) ) {
        msg = '[Mood] ' + msg.join('');
      }
      console[type](msg);
    }
  };


  // 处理‘abc.bcd.ddd’的相关方法
  Utils.ChainName = {
    _DELIMITER: '.',
    resolve: function (chain) {
      return chain.split(this._DELIMITER);
    },
    join: function(names) {
      return names.join(this._DELIMITER);
    },
    first: function(chain) {
      return this.resolve(chain)[0];
    }
  };
  // 函数节流，见JavaScript高级编程22.3节
  Utils.Processor = function(func) {
    this.timeId = null;
    this.processor = func;
  };

  Utils.Processor.prototype.process = function(args, context) {
    clearTimeout(this.timeId);
    var upper = this;
    this.timeId = win.setTimeout(function(){
      upper.processor.apply(context, args);
      Utils.Log.print('run a hook', 'log');
    }, 10);
  };


  var Type = Utils.Type;
  var Log = Utils.Log;
  var ChainName = Utils.ChainName;
  var Processor = Utils.Processor;

  // 支持a.b.c的属性名，直接使用a的Hooks
  var Hook = function() {
    this._hooks = {};
    this._scopes = {};
  };

  Hook.prototype.add = function(scope, hooks) {
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
  Hook.prototype.run = function(name){
    var upper = this;
    var hookNames = Hook.getAllHookNames(name);
    hookNames.forEach(function(hookName) {
      upper.runSingle(hookName);
    });
  };

  // 运行this._hooks中单个属性对应的hook 队列
  Hook.prototype.runSingle = function(hookName) {
    var upper = this;
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
        // 'this' is a problem
        hook.process([scope], win);
      } else {
        Log.print([hookName, ' Error: hook must be a Function'], 'error');
      }
    });
  };

  Hook.getAllHookNames = function(name) {
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
    if ( !(app instanceof Mood) ) {
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

  // Mood constructor
  function Mood() {
    this.hooks = new Hook();
    this.rootScope = new Scope(this);
  }

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

  Mood._config = {
    debug: false
  };

  Mood.config = function(option) {
    for ( var p in option ) {
      if ( option.hasOwnProperty(p) ) {
        Mood._config = option[p];
      }
    }
  };


  win.Mood = Mood;
  win.Hook = Hook;
})(window);

