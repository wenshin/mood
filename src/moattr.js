'use strict';

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
        elem.removeAttribute(attrName);
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

moAttrs.addRenderAttr = function(attrName, attrender) {
  this._renderAttrs[attrName] = function(str) {
    var elem = this, render = tmpl.render(str);
    return moAttrs.genRenderObj(render.names, function(scope) {
      attrender(elem, scope, render.handle);
    });
  };
};

moAttrs.addControlAttr = function(attrName, attrcontrol) {
  this._controlAttrs[attrName] = function(str) {
    var elem = this, control = tmpl.control(str);
    return moAttrs.genControllerObj(control.names, function(scope) {
      attrcontrol(elem, scope, control.handle);
    });
  };
};

moAttrs.addRenderAttr('mo-html', function(elem, scope, renderHandle) {
  lazyAssign(elem, 'innerHTML', renderHandle(scope, false));
});

moAttrs.addRenderAttr('mo-text', function(elem, scope, renderHandle) {
  lazyAssign(elem, 'innerHTML', renderHandle(scope));
});

moAttrs.addRenderAttr('mo-class', function(elem, scope, renderHandle) {
  lazyAssign(elem, 'className', renderHandle(scope));
});


// Has same name of attrName and element property
var sameAttrs = ['id', 'type', 'value'];
for (var i = 0; i < sameAttrs.length; i++ ) {
  (function() {
    var tmpAttr = sameAttrs[i];  // 注意这里的用法保证tmpAttr是当前域得值
    moAttrs.addRenderAttr('mo-' + tmpAttr, function(elem, scope, renderHandle) {
      lazyAssign(elem, tmpAttr, renderHandle(scope));
    });
  })();
}

moAttrs.addRenderAttr('mo-show', function(elem, scope, renderHandle) {
  var display = 'none';
  var value = renderHandle(scope);
  var falseValues = {
    '[object Object]': null,
    '0': null, 'false': null, 'NaN': null,
  };
  if ( value && !( value in falseValues ) ) {
    display = '';
  }
  lazyAssign(elem.style, 'display', display);
});


/*
 * Control attributes.
 */
var events = [
  'click', 'change', 'hover', 'mouseover', 'keypress',
  'keyup', 'keydown', 'mouseup', 'mousedown', 'submit'];


for (var i = 0; i < events.length; i++ ) {
  (function(){
    var eventName = events[i];
    moAttrs.addControlAttr('mo-' + eventName, function(elem, scope, controlHandle) {
      EventUtil.on(elem, eventName, function() {
        controlHandle.call(elem, scope);
      });
    });

    // PD is prevent default
    moAttrs.addControlAttr('mo-PD-' + eventName, function(elem, scope, controlHandle) {
      EventUtil.on(elem, eventName, function(e) {
        e.preventDefault();
        controlHandle.call(elem, scope);
      });
    });
  })();
}

/*
 * Two side bind for mo-bind.
 */
moAttrs._controlAttrs['mo-bind'] = function(str) {
  var elem = this, control = tmpl.control(str);
  return moAttrs.genControllerObj(control.names, function(scope) {
    EventUtil.on(elem, 'keyup', function() {
      scope[control.names[0]] = elem.value;
    });
  });
};

exports.moAttrs = moAttrs;
