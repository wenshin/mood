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

var cache = {};
var updateParser = /\{>\s*([^{}]+?)\s*\}/g;
var controlParser = /^\$>\s*(.+)\s*$/g;

var array2Str = function(array) {
  return '[\'' + array.join('\',\'') + '\']';
};

var tmpl = {};

tmpl.update = function update(str, data, escape) {
  var render = cache[str];

  if ( !render ) {
    var matchs = str.match(updateParser), match, codes = [],
        code, fnBody;

    for ( var i = 0; i < matchs.length; i++ ) {
      match = updateParser.exec(matchs[i]);
      code = match && match[1];
      if ( code.indexOf('++') !== -1 || code.indexOf('--') !== -1 ) {
        throw new TypeError('Do not use ++ or -- in {> }');
      }
      code && codes.push(code);
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

    render = new Function('data', 'escape', fnBody);
    cache[str] = render;
  }

  return data ? render(data, escape) : render;
};

tmpl.control = function control(str, data, escape) {
  var _control = cache[str];
  if ( !_control ) {
    var match = controlParser.exec(str), codes;
    codes = match && match[1];
    _control = new Function('data', 'with(data){ ' + codes + '}');
    cache[str] = _control;
  }
  return data ? _control(data) : _control;
};

exports.tmpl = tmpl;
