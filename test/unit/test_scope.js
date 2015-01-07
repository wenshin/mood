/* global describe, it */

'use strict';

var assert = require('chai').assert;
var Scope = require('../../dist/scope').Scope;

describe('Scope', function(){

  var myScope = new Scope('scope1');
  describe('#addProp', function(){

    it('should get default helpers after instantiate Scope', function(){
      assert.typeOf(myScope.defaults, 'Function');
    });

    it('should get null when not assign default value', function(){
      myScope.addProp('b');
      assert.equal(myScope.b, null);
    });

    it('should success add default value for property', function(){
      myScope.addProp('a', 1);
      assert.equal(myScope.a, 1);
    });

    it('should run the render added by addProp when assign value', function() {
      // 在添加属性时添加的渲染函数，触发成功，且render中的this是null, scope的赋值
      var renderCalled = false;
      myScope.addProp('c', 1, function(scope) {
        assert.equal(scope.c, 2);
        assert.equal(this, null);
        renderCalled = true;
      });
      myScope.c = 2;
      assert.equal(renderCalled, true);
    });

    it('should add property when call Scope.helper', function(){
      var helperCalled = false;
      myScope.helper('renderAbc', function() {
        helperCalled = true;
      });
      myScope.renderAbc();
      assert.equal(helperCalled, true);
    });

    it('should assign property success and call renders', function(){
      var renderCalled = false;
      myScope.addRenders(myScope.chainName('a'), function(scope) {
        assert.equal(scope.a, 2);
        assert.notTypeOf(scope, 'Scope');
        renderCalled = true;
      });
      myScope.a = 2;
      assert.equal(renderCalled, true);
    });

    it('should run the boot scope render when assigning property', function() {
      var renderCalled = false;
      // 触发添加根 Scope 的渲染函数
      myScope.addRenders(function(scope) {
        assert.equal(scope.b, 2);
        renderCalled = true;
      });
      myScope.b = 2;
      assert.equal(renderCalled, true);
    });

    it('should run all renders when assign', function() {
      var count = 0;
      myScope.addProp('d', 1, [function(scope) {
        assert.equal(scope.d, 2);
        count++;
      }, function(scope) {
        assert.equal(scope.d, 2);
        count++;
      }]);
      myScope.addRenders(myScope.chainName('d'), function(scope) {
        assert.equal(scope.d, 2);
        count++;
      });
      assert.equal(myScope.d, 1);
      myScope.d = 2;
      assert.equal(count, 3);
    });

  });

});
