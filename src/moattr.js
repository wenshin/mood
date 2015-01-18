'use strict';

var tmpl = require('./utils/tmpl').tmpl;
var ChainName = require('./utils/chainame').ChainName;
var EventUtil = require('./utils/event').EventUtil;
var $ = require('./lib/jquery.core').jQuery;

var lazyAssign = function(obj, name, assign) {
  if( obj[name] !== assign ) { obj[name] = assign; }
};

var mo = function(name) {
  return 'mo-' + name;
};

var attrSelector = function(attr, value) {
  value = value ? '="' + value + '"' : '';
  return ['[', attr, value, ']'].join('');
};

var SCOPE_ATTR = mo('scope');
var ITER_ATTR = mo('each');
var ITER_FILTER_ATTR = mo('each-filter');
var moAttrs = {};

moAttrs.SCOPE_ATTR = SCOPE_ATTR;
moAttrs.scopeSelector = attrSelector(SCOPE_ATTR);

/**
 * parseScope 解析DOM中有mo-scope标签元素中的mo-开头标签的元素
 * @param  DOMElement scopeElem scope对象
 * @return Object
 *    {
 *      obj: {}, // 解析出来的Scope具有的元素
 *      // 渲染DOM对象的函数，该种函数不能修改Scope对象的值
 *      renders: {"scope.prop": [render1, render2, render3]},
 *      // 可以改变Scope对象值得函数，比如mo-click等事件函数
 *      controllers: {"scope.prop": [controller1, controller2, controller3]},
 *    }
 */
moAttrs.parseScope = function(scopeElem) {
  var ret = {renders: {}, controllers: [], obj: {}};

  var parseAttr = function(attrs, callback) {
    $.each(attrs, function(attrName, getHandler) {
      var elems = scopeElem.querySelectorAll(attrSelector(attrName));
      $.each(elems, function(_, elem) {
        var attrValue = elem.getAttribute(attrName);
        var h = getHandler.call(elem, attrValue);
        callback(h.handler);
        $.extend(ret.obj, h.obj);
        elem.removeAttribute(attrName);
      });
    });
  };

  parseAttr(this._renderAttrs, function(handlers) {
    $.each(handlers, function(i, handler) {
      if ( handler.name in ret.renders ) {
        ret.renders[handler.name].push(handler.handle);
      } else {
        ret.renders[handler.name] = [handler.handle];
      }
    });
  });
  parseAttr(this._controlAttrs, function(handler) {
    ret.controllers.push(handler);
  });
  return ret;
};


moAttrs._renderAttrs = {};
moAttrs._controlAttrs = {};

moAttrs.genRenderObj = function(names, handle) {
  // Return a array of every name with handle.
  var r = [], obj = {};
  $.each(names, function(_, name) {
    $.extend(obj, ChainName.name2Obj(name));
    r.push({ name: name, handle: handle });
  });
  return { handler: r, obj: obj };
};

moAttrs.genControllerObj = function(names, handle) {
  // Return a array of every name with handle.
  var obj = {};
  $.each(names, function(_, name) {
    $.extend(obj, ChainName.name2Obj(name));
  });
  return { handler: handle, obj: obj };
};

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

moAttrs.addRenderAttr(mo('html'), function(elem, scope, renderHandle) {
  lazyAssign(elem, 'innerHTML', renderHandle(scope, false));
});

moAttrs.addRenderAttr(mo('text'), function(elem, scope, renderHandle) {
  lazyAssign(elem, 'innerHTML', renderHandle(scope));
});

moAttrs.addRenderAttr(mo('class'), function(elem, scope, renderHandle) {
  lazyAssign(elem, 'className', renderHandle(scope));
});


// Has same name of attrName and element property
var sameAttrs = ['id', 'type', 'value'];
for (var i = 0; i < sameAttrs.length; i++ ) {
  (function() {
    var tmpAttr = sameAttrs[i];  // 注意这里的用法保证tmpAttr是当前域得值
    moAttrs.addRenderAttr(mo(tmpAttr), function(elem, scope, renderHandle) {
      lazyAssign(elem, tmpAttr, renderHandle(scope));
    });
  })();
}

moAttrs.addRenderAttr(mo('show'), function(elem, scope, renderHandle) {
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


// moAttrs._renderAttrs[ITER_ATTR] = function(str) {
//   var elem = this, render = tmpl.render(str);
//   var filterName = elem.getAttribute(ITER_FILTER_ATTR);
//   function parseIterElemAttrs(iterElem) {
//     $.each(moAttrs._renderAttrs, function(attrName, genHandler) {
//       elem.querySelectorAll(attrSelector(attrName));
//     });
//   }
//   var iterElem = elem.children[0];
//   var iterObj = parseIterElemAttrs(iterElem);
//   // var subiters = iterElem.querySelectorAll(attrSelector(ITER_ATTR));
//   elem.removeChild(iterElem);
//   return moAttrs.genRenderObj(render.names, function(scope) {
//     var filter = scope[filterName],
//         data = scope[render.names[0]];
//     data = filter ? filter(data) : data;
//     for (var i = 0; i < data.length; i++) {
//     }
//   });
// };


/*
 * Control attributes.
 */
var events = [
  'click', 'change', 'hover', 'mouseover', 'keypress',
  'keyup', 'keydown', 'mouseup', 'mousedown', 'submit'];


for (var i = 0; i < events.length; i++ ) {
  (function(){
    var eventName = events[i];
    moAttrs.addControlAttr(mo(eventName), function(elem, scope, controlHandle) {
      EventUtil.on(elem, eventName, function() {
        controlHandle.call(elem, scope);
      });
    });

    // PD is prevent default
    moAttrs.addControlAttr(mo('PD-' + eventName), function(elem, scope, controlHandle) {
      EventUtil.on(elem, eventName, function(e) {
        e.preventDefault();
        controlHandle.call(elem, scope);
      });
    });
  })();
}

/*
 * Two side data bind.
 */
moAttrs._controlAttrs[mo('bind')] = function(str) {
  var elem = this, control = tmpl.control(str);
  var parserAttr = mo('bind-parse');
  var parser = elem.getAttribute(parserAttr);
  elem.removeAttribute(parserAttr);
  return moAttrs.genControllerObj(control.names, function(scope) {
    EventUtil.on(elem, 'keyup keydown', function() {
      scope[control.names[0]] = scope[parser](elem.value);
    });
  });
};

exports.moAttrs = moAttrs;
