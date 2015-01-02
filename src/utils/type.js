'use strict';

exports.Type = {
  isObject: function(v) {
    return v instanceof Object;
  },
  isFunction: function(v) {
    return v instanceof Function;
  },
  isString: function(v) {
    return typeof v === 'string';
  },
  isArray: function(v) {
    return v instanceof Array;
  },
  toArray: function(objs) {
    objs = objs || [];
    return !this.isArray(objs) ? [objs] : objs;
  },
  throwNotArray: function(target, msg) {
    if ( !this.isArray(target) ) {
      throw new TypeError(msg);
    }
  },
  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
