({ define: typeof define === 'function'
  ? define  // browser require.js
  : function(F) { F(require,exports,module); } }).  // Node.js
define(function (require, exports) {

  'use strict';

  var Type = {
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

  var Log = {
    debug: false,
    print: function(msg, type) {
      // Mood 开启 debug 时才打印log
      if ( !Log.debug ) {
        return;
      }
      // TODO: to be more beautyful
      if ( Type.isArray(msg) ) {
        msg = '[Mood] ' + msg.join('');
      }
      console[type](msg);
    }
  };

  // 处理‘abc.bcd.ddd’的相关方法
  var ChainName = {
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
  var Processor = function(func) {
    this.timeId = null;
    this.processor = func;
  };

  Processor.prototype.process = function(context, args) {
    clearTimeout(this.timeId);
    var upper = this;
    this.timeId = setTimeout(function(){
      upper.processor.apply(context, args);
      Log.print('run a hook', 'log');
    }, 10);
  };

  exports.Log = Log;
  exports.Type = Type;
  exports.ChainName = ChainName;
  exports.Processor = Processor;
});
