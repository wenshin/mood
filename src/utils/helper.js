'use strict';

exports.Helpers = {
  defaults: function(src, defaultValue) {
    return src || defaultValue;
  },
  floatFormat: function(num, digit) {
    var _num = parseFloat(num);
    var v = Math.pow(10, digit);
    return _num ? Math.round( _num * v ) / v : num;
  },
  toFloat: function(str) {
    var _num = parseFloat(str);
    return _num || 0;
  }
};
