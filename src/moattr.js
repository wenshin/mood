'use strict';

var Type = require('./utils/type').Type;
var tmpl = require('./utils/tmpl').tmpl;
var ChainName = require('./utils/chainame').ChainName;
var EventUtil = require('./utils/event').EventUtil;
var $ = require('./lib/jquery.core').jQuery;

var lazyAssign = function(obj, name, assign) {
  if( obj[name] !== assign ) { obj[name] = assign; }
};

var attrSelector = function(attr, value) {
  value = value ? '="' + value + '"' : '';
  return ['[', attr, value, ']'].join('');
};

var SCOPE_ATTR = 'mo-scope';
var moAttrs = {};

moAttrs.SCOPE_ATTR = SCOPE_ATTR;
moAttrs.scopeSelector = attrSelector(SCOPE_ATTR);


moAttrs.parseScope = function(scopeElem) {
  var ret = {renders: {}, controllers: [], obj: {}};

  var parseAttr = function(attrs, callback) {
    $.each(attrs, function(attrName, getHandler) {
      var elems = scopeElem.querySelectorAll(attrSelector(attrName));
      $.each(elems, function(_, elem) {
        var attr = elem.getAttribute(attrName);
        var h = getHandler.call(elem, attr);
        callback(h.handle);
        $.extend(ret.obj, h.obj);
      });
    });
  };

  parseAttr(this._renderAttrs, function(renders) {
    $.each(renders, function(i, render) {
      if ( render.name in ret.renders ) {
        ret.renders[render.name].push(render.handle);
      } else {
        ret.renders[render.name] = [render.handle];
      }
    });
  });
  parseAttr(this._controlAttrs, function(handle) {
    ret.controllers.push(handle);
  });
  return ret;
};


moAttrs.genRenderObj = function(names, handle) {
  // Return a array of every name with handle.
  var r = [], obj = {};
  $.each(names, function(_, name) {
    $.extend(obj, ChainName.name2Obj(name));
    r.push({ name: name, handle: handle });
  });
  return { handle: r, obj: obj };
};

moAttrs.genControllerObj = function(names, handle) {
  // Return a array of every name with handle.
  var obj = {};
  $.each(names, function(_, name) {
    $.extend(obj, ChainName.name2Obj(name));
  });
  return { handle: handle, obj: obj };
};

moAttrs._renderAttrs = {};
moAttrs._controlAttrs = {};

moAttrs.addUpdateAttr = function(attrName, handle) {
  this._renderAttrs[attrName] = handle;
};

moAttrs.addControlAttr = function(attrName, handle) {
  this._controlAttrs[attrName] = handle;
};

moAttrs.addUpdateAttr('mo-html', function(str) {
  var elem = this;
  var render = tmpl.render(str);
  return moAttrs.genRenderObj(render.names, function(scope) {
    lazyAssign(elem, 'innerHTML', render.handle(scope, false));
  });
});

moAttrs.addControlAttr('mo-click', function(str) {
  var elem = this;
  var control = tmpl.control(str);
  return moAttrs.genControllerObj(control.names, function(scope) {
    EventUtil.on(elem, 'click', function() {
      control.handle.call(null, scope);
    });
  });
});

// will not escape the html tags
moAttrs.moHtml = {
  getUpdator: function(attr) {
    return function(scope) {
      // 'this' is the element
      lazyAssign(this, 'innerHTML', render(attr, scope, false));
    };
  }
};

// Will escape the html tags
moAttrs.moText = {
  getUpdator: function(attr) {
    return function(scope) {
      lazyAssign(this, 'innerHTML', render(attr, scope));
    };
  }
};

// Will escape the html tags
moAttrs.moClass = {
  getUpdator: function(attr) {
    return function(scope) {
      lazyAssign(this, 'className', render(attr, scope));
    };
  }
};

// Create normal attributes like 'class', 'id' ...
var normalAttrs = ['id', 'type', 'value'];
normalAttrs.forEach(function(name) {
  var attrUtil = {
    getUpdator: function(attr) {
      return function(scope) {
        lazyAssign(this, name, render(attr, scope));
      };
    }
  };
  moAttrs['mo' + Type.capitalize(name)] = attrUtil;  // Change to 'moId', 'moClass'...
});

exports.moAttrs = moAttrs;
