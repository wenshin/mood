/* global describe, it */

'use strict';

var assert = require('chai').assert;
var tmpl = require('../../dist/utils/tmpl').tmpl;

describe('tmpl', function(){

  describe('#render', function(){

    it('should generate a function and render right', function(){
      var render = tmpl.render('a + b = {> me.name + me.age } and c = {> c * 10 }');
      var data = {me: {name: 'wenshin', age: '18'}, c: 1};
      var text = render.handle(data);
      assert.typeOf(render.handle, 'Function');
      assert.deepEqual(render.names, ['me.name', 'me.age', 'c']);
      assert.equal(text, 'a + b = wenshin18 and c = 10');
    });

    it('should not use "++" or "--" in {> }', function(){
      assert.throw(function(){tmpl.render('a = {> a-- }');}, TypeError);
      assert.throw(function(){tmpl.render('a = {> a++ }');}, TypeError);
    });

  });

  describe('#control', function(){

    it('should generate a function and modify data property', function(){
      var controlObj = tmpl.control('$> b + c++');
      var data = {c: 1, b: 3};
      controlObj.handle(data);
      assert.typeOf(controlObj.handle, 'Function');
      assert.equal(data.c, 2);
      assert.deepEqual(controlObj.names, ['b', 'c']);
    });

  });

});
