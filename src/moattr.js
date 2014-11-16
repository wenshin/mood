'use strict';

var tmpl = require('./utils/tmpl').tmpl;

var _render = {};
var moAttrs = {};

var getRender = function(t) {
  return _render[t] || tmpl(t);
};

// will not escape the html tags
moAttrs.moHtml = {
  getHook: function(attr) {
    return function(scope) {
      // this is the element
      this.innerHTML = getRender(attr)(scope);
    };
  }
};

// Will escape the html tags
moAttrs.moText = {
  getHook: function(attr) {
    return function(scope) {
      this.innerHTML = getRender(attr)(scope, false);
    };
  }
};

exports.moAttrs = moAttrs;