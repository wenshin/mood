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
    objs = objs || [];
    return !this.isArray(objs) ? [objs] : objs;
  },
  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
