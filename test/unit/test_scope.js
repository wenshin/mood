/* global describe, it */

'use strict';

var assert = require('chai').assert;
var Scope = require('../../dist/scope').Scope;

describe('Scope', function(){

  describe('#addProp', function(){

    it('should get property successfull', function(){
      var scope = new Scope('scope1');
      scope.addProp('a', 1);
      assert.equal(scope.a, 1);
    });

    it('should get null when not assign default value', function(){
      var scope = new Scope('scope1');
      scope.addProp('a', null);
      assert.equal(scope.a, null);
    });

    it('should run render when assign', function() {
      var scope = new Scope('scope1');
      var renderCalled = false;
      var selfRenderCalled = false;
      scope.addProp('a', 1, function() {
        assert.equal(this.a, 2);
        assert.notTypeOf(this, 'Scope');
        renderCalled = true;
      });
      scope.addRenders(function() {
        assert.equal(this.a, 2);
        selfRenderCalled = true;
      });
      scope.a = 2;
      assert.equal(renderCalled, true);
      assert.equal(selfRenderCalled, true);
    });

    it('should run all renders when assign', function() {
      var scope = new Scope('scope1');
      var count = 0;
      scope.addProp('a', 1, [function() {
        assert.equal(this.a, 2);
        count++;
      }, function() {
        assert.equal(this.a, 2);
        count++;
      }]);
      scope.addRenders('a', [function() {
        assert.equal(this.a, 2);
        count++;
      }]);
      scope.a = 2;
      assert.equal(count, 3);
    });

  });

});
