/* global describe, it */

'use strict';

var assert = require('chai').assert;
var tmpl = require('../../dist/utils/tmpl').tmpl;

describe('motmpl', function(){
  it('should generate a function and render right', function(){
    var render = tmpl('a + b = {> me.name + me.age } and c = {> c * 10 }');
    var data = {me: {name: 'wenshin', age: '18'}, c: 1};
    var text = render(data);
    assert.typeOf(render, 'Function');
    assert.equal(text, 'a + b = wenshin18 and c = 10');
  });
});
