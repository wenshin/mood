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
  }
};

exports.ChainName = ChainName;
