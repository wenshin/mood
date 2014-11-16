'use strict';

var ATTR_PREFIX = 'mo';
var SCOPE = 'Scope';
var attrMetas = ['Html'];

var moAttr = function(meta) {
  return [ATTR_PREFIX, '-', meta.toLowerCase()].join('');
};

var moModule = function(meta) {
  return ATTR_PREFIX + meta;
};

var moAttrSelector = function(meta) {
  return ['[', moAttr(meta), ']'].join('');
};

var initDOM = function() {
  // 获取有 mo-scope 属性的 DOM elements;
  var scopes = document.querySelectorAll(moAttrSelector(SCOPE));

  scopes.forEach(function(scope) {
    attrMetas.forEach(function(meta) {
      var elems = scope.querySelectorAll(moAttrSelector(meta));
      var attr = require(moModule(meta));
      attr.init(scope, elems);
    });
  });
};

exports.initDOM = initDOM;