// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
// YuanWen - MIT Licensed

'use strict';

var cache = {};

var tmpl = function tmpl(str, data, escape){
  // Figure out if we're getting a template, or if we need to
  // load the template - and be sure to cache the result.
  /* jshint quotmark:double */
  var fn = !/\W/.test(str) ?
    cache[str] = cache[str] ||
      tmpl(document.getElementById(str).innerHTML) :

    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
    new Function('obj', 'escape', // jshint ignore:line
      "escape = escape === false ? escape : true;" +
      "var p = [], params = []," +
      "safePush = function(){" +
        "if(escape){" +
          "for(var i=0;i<arguments.length;i++){" +
            "if(arguments[i].xssSafe){" +
              "p.push(arguments[i].xssSafe()); }}}" +
        "else { p.push.apply(p,arguments);} };" +

      // Introduce the data as local variables using with(){}
      "with(obj){safePush('" +

      // Convert the template into pure JavaScript
      str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'") +
      "');}return p.join('');");

  // Provide some basic currying to the user
  return data ? fn( data, escape ) : fn;
};

exports.tmpl = tmpl;
