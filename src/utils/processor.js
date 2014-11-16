'use strict';

var log = require('./log');

// 函数节流，见JavaScript高级编程22.3节
var Processor = function(func) {
  this.timeId = null;
  this.processor = func;
};

Processor.prototype.process = function(context, args) {
  clearTimeout(this.timeId);
  var upper = this;
  this.timeId = setTimeout(function(){
    upper.processor.apply(context, args);
    log.Log.print('run a hook', 'log');
  }, 10);
};

exports.Processor = Processor;
