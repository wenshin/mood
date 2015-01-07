/* global describe, it */

'use strict';

var assert = require('chai').assert;
var Scope = require('../../dist/scope').Scope;

describe('Scope', function(){

  var scope = new Scope('scope1');
  describe('#addProp', function(){

    it('should get null when not assign default value', function(){
      scope.addProp('b');
      assert.equal(scope.b, null);
    });

    it('should success add default value for property', function(){
      scope.addProp('a', 1);
      assert.equal(scope.a, 1);
    });

    it('should assign property success and call renders', function(){
      var renderCalled = false;
      scope.addRenders(scope.chainName('a'), function() {
        assert.equal(this.a, 2);
        assert.notTypeOf(this, 'Scope');
        renderCalled = true;
      });
      scope.a = 2;
      assert.equal(renderCalled, true);
    });

    it('should run the render added by addProp when assign value', function() {
      // 在添加属性时添加的渲染函数，触发成功，且render中的this是scope的赋值
      var renderCalled = false;
      scope.addProp('c', 1, function() {
        assert.equal(this.c, 2);
        renderCalled = true;
      });
      scope.c = 2;
      assert.equal(renderCalled, true);
    });

    it('should run the boot scope render when assigning property', function() {
      var renderCalled = false;
      // 触发添加根 Scope 的渲染函数
      scope.addRenders(function() {
        assert.equal(this.b, 2);
        renderCalled = true;
      });
      scope.b = 2;
      assert.equal(renderCalled, true);
    });

    it('should run all renders when assign', function() {
      var count = 0;
      scope.addProp('d', 1, [function() {
        assert.equal(this.d, 2);
        count++;
      }, function() {
        assert.equal(this.d, 2);
        count++;
      }]);
      scope.addRenders(scope.chainName('d'), [function() {
        assert.equal(this.d, 2);
        count++;
      }]);
      assert.equal(scope.d, 1);
      scope.d = 2;
      assert.equal(count, 3);
    });

  });

});
