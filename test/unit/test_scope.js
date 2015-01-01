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

    it('should run updator when assign', function() {
      var scope = new Scope('scope1');
      var updatorCalled = false;
      scope.addProp('a', 1, function() {
        assert.equal(this.a, 2);
        assert.notTypeOf(this, 'Scope');
        updatorCalled = true;
      });
      scope.a = 2;
      assert.equal(updatorCalled, true);
    });

    it('should run all updators when assign', function() {
      var scope = new Scope('scope1');
      var updator1Called =false, updator2Called = false;
      scope.addProp('a', 1, [function() {
        assert.equal(this.a, 2);
        updator1Called = true;
      }, function() {
        assert.equal(this.a, 2);
        updator2Called = true;
      }]);
      scope.a = 2;
      assert.equal(updator1Called, true);
      assert.equal(updator2Called, true);
    });

  });

});
