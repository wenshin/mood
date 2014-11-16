'use strict';

var Util = {
  each: function(iterable, fn) {
    for ( var i = 0; i < iterable.length; i++ ) {
      fn(iterable[i], i);
    }
  }
};

exports.Util = Util;