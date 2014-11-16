'use strict';

var Util = require('./utils/util').Util;
var moAttrs = require('./moattr').moAttrs;

var ATTR_PREFIX = 'mo';
var SCOPE = 'Scope';
var attrMetas = ['Html'];

var moAttr = function(meta) {
  return [ATTR_PREFIX, '-', meta.toLowerCase()].join('');
};

var moModule = function(meta) {
  return ATTR_PREFIX + meta;
};

var moAttrSelector = function(meta, value) {
  value = value ? '="' + value + '"' : '';
  return ['[', moAttr(meta), value, ']'].join('');
};

var getHooksOfScope = function(scopeElem) {
  var hooks = [];
  Util.each(attrMetas, function(meta) {
    var elems = scopeElem.querySelectorAll(moAttrSelector(meta));
    Util.each(elems, function(elem) {
      var attr = elem.getAttribute(moAttr(meta));
      var hook = moAttrs[moModule(meta)].getHook(attr);
      hooks.push(function(scope) {
        hook.call(elem, scope);
      });
      elem.removeAttribute(moAttr(meta));
    });
  });
  return hooks;
};

var getSchemaOfScope = function() {
  return {name: 'wenshin', test: 0};
};

var initScope = function(createScope) {
  var scopeElems = document.querySelectorAll(moAttrSelector(SCOPE));
  Util.each(scopeElems, function(scopeElem) {
    var scopeName = scopeElem.getAttribute(moAttr(SCOPE));
    var schema = getSchemaOfScope(scopeElem);
    var hooks = getHooksOfScope(scopeElem);
    createScope(scopeName, schema, hooks);
  });
};

exports.initScope = initScope;
