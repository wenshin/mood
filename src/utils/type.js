'use strict';

exports.Type = {
  isObject: function(v) {
    return v instanceof Object;
  },
  isFunction: function(v) {
    return v instanceof Function;
  },
  isArray: function(v) {
    return v instanceof Array;
  },
  toArray: function(objs) {
    if ( !this.isArray(objs) ) { return [objs]; }
  }
};
