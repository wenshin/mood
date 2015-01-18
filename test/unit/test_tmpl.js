/* global describe, it */

'use strict';

var assert = require('chai').assert;
var tmpl = require('../../src/utils/tmpl').tmpl;

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

    it('should generate a function and render right with notRender param is true', function(){
      var render = tmpl.render('a + b = {> me.name + me.age } and c = {> c * 10 }');
      var data = {me: {name: 'wenshin', age: '18'}, c: 1};
      var renderObj = render.handle(data, null, true);
      var text = renderObj.render(renderObj.values);
      assert.deepEqual(renderObj.values, ['wenshin18', 10]);
      assert.equal(text, 'a + b = wenshin18 and c = 10');
    });

    it('should return right property names and parsed text when use !', function(){
      var render = tmpl.render('it {> me.name !== me.age } and {> !c } and {> me.name!==me.age }');
      var data = {me: {name: 'wenshin', age: '18'}, c: 1};
      var text = render.handle(data);
      assert.deepEqual(render.names, ['me.name', 'me.age', 'c']);
      assert.equal(text, 'it true and false and true');
    });

    it('should return right when use \' to indicate a string', function(){
      var render = tmpl.render('it {> \'Wenshin\' } and {> \'Yuanwen\' }');
      var data = {me: {name: 'wenshin', age: '18'}};
      var text = render.handle(data);
      assert.deepEqual(render.names, []);
      assert.equal(text, 'it Wenshin and Yuanwen');
    });

    it('should not use ";" or "++" or "--" in {> }', function(){
      assert.throw(function(){tmpl.render('a = {> a-- }');}, TypeError);
      assert.throw(function(){tmpl.render('a = {> a++ }');}, TypeError);
      assert.throw(function(){tmpl.render('a = {> a; }');}, TypeError);
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

    it('should change !param to param = !param', function(){
      var controlObj = tmpl.control('$> !b');
      var data = {b: 3};
      controlObj.handle(data);
      assert.equal(data.b, false);
      assert.deepEqual(controlObj.names, ['b']);
    });

    it('should not use ";"', function(){
      assert.throw(function(){tmpl.control('$> a;');}, TypeError);
    });

  });

});
