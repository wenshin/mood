'use strict';

var tmpl = require('./utils/tmpl').tmpl;

var _render = {};
var moAttrs = {};

var getRender = function(t) {
  return _render[t] || tmpl(t);
};

moAttrs.moHtml = {
  getHook: function(attr) {
    return function(scope) {
      // this is the element
      this.innerHTML = getRender(attr)(scope);
    };
  }
};

exports.moAttrs = moAttrs;