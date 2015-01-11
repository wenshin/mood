'use strict';

var $ = require('../lib/jquery.core').jQuery;

var Log = {
  debug: false,
  print: function(msg, type) {
    // Mood 开启 debug 时才打印log
    if ( !Log.debug ) {
      return;
    }
    // TODO: to be more beautyful
    if ( $.isArray(msg) ) {
      msg = '[Mood] ' + msg.join('');
    }
    console[type](msg);
  }
};

exports.Log = Log;
