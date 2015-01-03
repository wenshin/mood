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


var tmpl = function tmpl(str, data, escape) {
  var render = cache[str];

  if ( !render ) {
    var matchs = str.match(updateParser), match, codes = [],
        code;

    for ( var i = 0; i < matchs.length; i++ ) {
      match = updateParser.exec(matchs[i]);
      code = match && match[1];
      code && codes.push(code);
      updateParser.exec(matchs[i]); // 跳过最后一次运行
    }

    var fnBody =
      'escape = escape === false ? escape : true;' +
      'var value, code, str=\'' + str + '\';' +
      'var matchs=' + array2Str(matchs) + ', codes;' +
      'with(data){ codes=[' + codes + '];}' +
      'for ( var i = 0; i < matchs.length; i++ ) {' +
        'code = escape && codes[i].xssSafe ? codes[i].xssSafe() : codes[i];' +
        'str = str.replace(matchs[i], code);' +
      '}' +
      'return str;';

    render = new Function('data', 'escape', fnBody);
    cache[str] = render;
  }

  return data ? render(data, escape) : render;
};

exports.tmpl = tmpl;
