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
var renderParser = /\{>\s*([^{}]+?)\s*\}/g;
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


var filterNames = function(names) {
  var _names = [];
  for (var i = 0; i < names.length; i++ ) {
    if ( names[i].match(variableChainParser) ) {
      _names.push(names[i]);
    }
  }
  return _names;
};


tmpl.render = function render(str, data, escape) {
  var renderObj = cache[str], names = [];

  if ( !renderObj ) {
    var matchs = str.match(renderParser), match, codes = [],
        code, fnBody;

    for ( var i = 0; i < matchs.length; i++ ) {
      match = renderParser.exec(matchs[i]);
      code = match && match[1];
      if ( code.indexOf('++') !== -1 || code.indexOf('--') !== -1 ) {
        throw new TypeError('Do not use ++ or -- in {> }');
      }
      code && codes.push(code);
      code ? names = names.concat(code2Names(code)) : false;
      renderParser.exec(matchs[i]); // 跳过最后一次运行
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

    renderObj = {};
    renderObj.handle = new Function('data', 'escape', fnBody);
    renderObj.names = filterNames(names);
    cache[str] = renderObj;
  }

  return data ? renderObj.handle(data, escape) : renderObj;
};

tmpl.control = function control(str, data) {
  var controlObj = cache[str], names;

  if ( !controlObj ) {
    var match = controlParser.exec(str), codes;
    codes = match && match[1];
    names = code2Names(codes);
    controlObj = {};
    controlObj.handle = new Function('data', 'with(data){ ' + codes + '}');
    controlObj.names = filterNames(names);
    cache[str] = controlObj;
  }
  return data ? controlObj.handle(data) : controlObj;
};

exports.tmpl = tmpl;
