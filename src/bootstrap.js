'use strict';

(function() {
  String.prototype.xssSafe = function() {
    var str = String(this);
    str = str.replace(/&/g, '&amp;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;')
             .replace(/:/g, '&#058;')
             .replace(/\\/g, '&#092;')
             .replace(/\//g, '&#047;')
             .replace(/>/g, '&gt;')
             .replace(/</g, '&lt;');
    return str;
  };
})();

var Util = require('./utils/util').Util;
var moAttrs = require('./moattr').moAttrs;

var ATTR_PREFIX = 'mo';
var SCOPE = 'Scope';

var moAttr = function(meta) {
  return [ATTR_PREFIX, '-', meta.toLowerCase()].join('');
};

var moAttrSelector = function(meta, value) {
  value = value ? '="' + value + '"' : '';
  return ['[', moAttr(meta), value, ']'].join('');
};

var getHooksOfScope = function(scopeElem) {
  var hooks = [];
  for ( var p in moAttrs ) {
    if ( !moAttrs.hasOwnProperty(p) ) { continue; }
    if ( p.indexOf(ATTR_PREFIX) !== 0 ) { continue; }

    var meta = p.slice(2).toLowerCase();
    var elems = scopeElem.querySelectorAll(moAttrSelector(meta));
    Util.each(elems, function(elem) {
      var attr = elem.getAttribute(moAttr(meta));
      var hook = moAttrs[p].getHook(attr);
      hooks.push(function(scope) {
        hook.call(elem, scope);
      });
      elem.removeAttribute(moAttr(meta));
    });
  }
  return hooks;
};

var getSchemaOfScope = function() {
  // TODO: generate the schema of elem;
  return {name: 'wenshin', test: 0, attr: {class: 'test-class'}};
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
