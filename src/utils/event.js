'use strict';

var doc = document;

exports.EventUtil = {
  on: (function() {
    function eachTypes(types, fn) {
      types = types.split(' ');
      types.forEach(fn);
    }
    if ( doc.addEventListener ) {
      // for except IE
      return function (elem, types, handler) {
        eachTypes(types, function(type) {
          elem.addEventListener(type, handler, false);
        });
      };
    } else if ( doc.attachEvent ) {
      // for IE
      return function (elem, types, handler) {
        eachTypes(types, function(type){
          elem.attachEvent('on' + type, handler);
        });
      };
    } else {
      // fallback to DOM0 event
      return function (elem, types, handler) {
        eachTypes(types, function(type){
          elem['on' + type] = handler;
        });
      };
    }
  })(),

  off: (function () {
    if ( doc.removeEventListener ) {
      return function (elem, type, handler) {
        elem.removeEventListener(type, handler, false);
      };
    } else if ( doc.detachEvent ) {
      return function (elem, type, handler) {
        elem.detachEvent('on' + type, handler);
      };
    } else {
      return function (elem, type, handler) {
        elem['on' + type] = handler;
      };
    }
  })(),
};
