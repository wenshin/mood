'use strict';

var Type = require('./utils/type').Type;
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


// Create normal attributes like 'class', 'id' ...
var normalAttrs = ['id', 'class'];
normalAttrs.forEach(function(attr) {
  var attrUtil = {
    getHook: function(attr) {
      return function(scope) {
        this.className = getRender(attr)(scope, false);
      };
    }
  };
  moAttrs['mo' + Type.capitalize(attr)] = attrUtil;  // Change to 'moId', 'moClass'...
});

exports.moAttrs = moAttrs;