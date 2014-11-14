/* global module, test, Hook, deepEqual */

module('Hook util test');

test(
  'Hook.getAllHookNames',
  function () {
    var name = 'abc.bcd.ddd';
    var names = Hook.getAllHookNames(name);
    deepEqual(names, ['abc', 'abc.bcd', 'abc.bcd.ddd']);
  }
);
