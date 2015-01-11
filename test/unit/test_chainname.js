/* global describe, it */

'use strict';

var assert = require('chai').assert;
var ChainName = require('../../src/utils/chainame').ChainName;


describe('ChainName', function() {

  describe('#name2Obj', function() {

    it('should return one layer object with not chain name', function() {
      var obj = ChainName.name2Obj('me');
      assert.deepEqual(obj, {me: null});
    });

    it('should return embeded object with chain name', function() {
      var obj = ChainName.name2Obj('me.abc.c');
      assert.deepEqual(obj, {me: {abc: {c: null}}});
    });
  });

});
