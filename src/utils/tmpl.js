// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
// YuanWen - MIT Licensed

/* jshint strict: false */

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

var tmpl = {};
var cache = {};
var updateParser = /\{>\s*([^{}]+?)\s*\}/g;
var controlParser = /^\$>\s*(.+)\s*$/g;
var variableChainParser = /^[$_a-zA-Z][$_\w.]*$/;


var code2Names = function(code) {
  return code.split(/[^$_\w.]+/g); //可能出现['abc', '']
};


var array2Str = function(array) {
  return '[\'' + array.join('\',\'') + '\']';
};


var addPrefix = function(namespace, str) {
  return namespace + '.' + str;
};


var getRenders = function(namespace, names, handle) {
  var renders = [];
  for (var i = 0; i < names.length; i++ ) {
    if ( names[i].match(variableChainParser) ) {
      renders.push({
        name: addPrefix(namespace, names[i]), handle: handle});
    }
  }
  return renders;
};


tmpl.update = function update(namespace, str, data, escape) {
  var cacheName = addPrefix(namespace, str);
  var renders = cache[cacheName], names = [], handle;

  if ( !renders ) {
    var matchs = str.match(updateParser), match, codes = [],
        code, fnBody;

    for ( var i = 0; i < matchs.length; i++ ) {
      match = updateParser.exec(matchs[i]);
      code = match && match[1];
      if ( code.indexOf('++') !== -1 || code.indexOf('--') !== -1 ) {
        throw new TypeError('Do not use ++ or -- in {> }');
      }
      code && codes.push(code);
      code ? names = names.concat(code2Names(code)) : false;
      updateParser.exec(matchs[i]); // 跳过最后一次运行
    }

    fnBody =
      'escape = escape === false ? escape : true;' +
      'var value, code, str=\'' + str + '\';' +
      'var matchs=' + array2Str(matchs) + ', values;' +
      'with(data){ values=[' + codes + '];}' +
      'for ( var i = 0; i < matchs.length; i++ ) {' +
        'value = escape && values[i].xssSafe ? values[i].xssSafe() : values[i];' +
        'str = str.replace(matchs[i], value);' +
      '}' +
      'return str;';

    handle = new Function('data', 'escape', fnBody);
    renders = getRenders(namespace, names, handle);
    cache[cacheName] = renders;
  }

  return data ? handle(data, escape) : renders;
};

tmpl.control = function control(namespace, str, data) {
  var cacheName = addPrefix(namespace, str);
  var _control = cache[cacheName];
  if ( !_control ) {
    var match = controlParser.exec(str), codes;
    codes = match && match[1];
    _control = new Function('data', 'with(data){ ' + codes + '}');
    cache[cacheName] = _control;
  }
  return data ? _control.handle(data) : _control;
};

exports.tmpl = tmpl;
