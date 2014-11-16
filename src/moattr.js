'use strict';

var Type = require('./utils/type').Type;
var tmpl = require('./utils/tmpl').tmpl;

var _render = {};
var moAttrs = {};

var getRender = function(t) {
  return _render[t] || tmpl(t);
};

var lazyAssign = function(obj, name, assign) {
  if( obj[name] !== assign ) { obj[name] = assign; }
};

var render = function(attr, scope, escape) {
  return getRender(attr)(scope, escape);
};

// will not escape the html tags
moAttrs.moHtml = {
  getHook: function(attr) {
    return function(scope) {
      // this is the element
      lazyAssign(this, 'innerHTML', render(attr, scope, false));
    };
  }
};

// Will escape the html tags
moAttrs.moText = {
  getHook: function(attr) {
    return function(scope) {
      lazyAssign(this, 'innerHTML', render(attr, scope));
    };
  }
};

// Will escape the html tags
moAttrs.moClass = {
  getHook: function(attr) {
    return function(scope) {
      lazyAssign(this, 'className', render(attr, scope));
    };
  }
};

// Create normal attributes like 'class', 'id' ...
var normalAttrs = ['id', 'type', 'value'];
normalAttrs.forEach(function(name) {
  var attrUtil = {
    getHook: function(attr) {
      return function(scope) {
        lazyAssign(this, name, render(attr, scope));
      };
    }
  };
  moAttrs['mo' + Type.capitalize(name)] = attrUtil;  // Change to 'moId', 'moClass'...
});

exports.moAttrs = moAttrs;
