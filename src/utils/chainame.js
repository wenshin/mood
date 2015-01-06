'use strict';

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
  },
  name2Obj: function(chain) {
    var obj = {}, superObj;
    chain = this.resolve(chain);
    if ( chain.length === 1 ) {
      obj[chain[0]] = null;
    } else {
      chain.reduce(function(pre, cur, index) {
        var tmp = {};
        tmp[cur] = null;
        if ( index === 1 ) { obj[pre] = tmp; }// 第一次调用
        else { superObj[pre] = tmp; }
        superObj = tmp;
        return cur;
      });
    }
    return obj;
  }
};

exports.ChainName = ChainName;
