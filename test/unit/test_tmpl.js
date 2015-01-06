/* global describe, it */

'use strict';

var assert = require('chai').assert;
var tmpl = require('../../dist/utils/tmpl').tmpl;

describe('tmpl', function(){

  describe('#update', function(){

    it('should generate a function and render right', function(){
      var render = tmpl.update('testScope',
                               'a + b = {> me.name + me.age } and c = {> c * 10 }');
      var data = {me: {name: 'wenshin', age: '18'}, c: 1};
      var text = render.handle(data);
      assert.typeOf(render.handle, 'Function');
      assert.deepEqual(render.names, [
        'testScope.me.name', 'testScope.me.age', 'testScope.c']);
      assert.equal(text, 'a + b = wenshin18 and c = 10');
    });

    it('should not use "++" or "--" in {> }', function(){
      assert.throw(function(){tmpl.update('testScope', 'a = {> a-- }');}, TypeError);
      assert.throw(function(){tmpl.update('testScope', 'a = {> a++ }');}, TypeError);
    });

  });

  describe('#control', function(){

    it('should generate a function and modify data property', function(){
      var control = tmpl.control('testScope', '$> c++');
      var data = {c: 1};
      control(data);
      assert.typeOf(control, 'Function');
      assert.equal(data.c, 2);
    });

  });

});
