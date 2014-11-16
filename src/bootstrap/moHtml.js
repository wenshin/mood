'use strict';

var init = function(scope, elems) {
  elems.forEach(function(elem) {
    var curHtml = elem.innerHTML;
    elem.innerHTML = undefined;
    Object.defineProperty(elem, 'innerHTML', {
      set: function(value) {
        elem.__innerHTML = value.
      },
      get: function() {}
    });
  });
};