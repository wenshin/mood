require.config({
  baseUrl: '../dist/build',
  waitSeconds: 15
});

require( ['mood'], function(mood) {
  'use strict';

  // 不设置Scope的初始值
  mood.Mood.config({debug: true});


  // 设置Scope的初始值
  mood.Mood.bootstrap({
    'myscope': {
      show: true,
      count: 0,
      people: [
        {name: 'wenshin', location: 'beijing', tags: [{ click: 10, names: ['tag1', 'tag2']}] },
        {name: 'yanwx', location: 'zhejiang', tags: [{ click: 12, names: ['tag3', 'tag4']}] }],
    },
    'myscope1': {
      lowPrice: 0, buyPrice: 0, highPrice: 0},
  });

  var myScope = mood.Mood.getScope('myscope'),
      myScope1 = mood.Mood.getScope('myscope1'),
      triggerProps = ['lowPrice', 'buyPrice', 'highPrice'];

  myScope.helper('multi2', function(num) {
    return num * 2;
  });

  myScope1.helper('vibrate', function(rate) {
    var lowPrice = this.lowPrice,
        highPrice = this.highPrice,
        basePrice = rate > 0 ? lowPrice : highPrice;
    return this.floatFormat(basePrice + (highPrice - lowPrice) * rate, 2);
  }, triggerProps);

  myScope1.helper('earn', function(rate) {
    var vPrice = this.vibrate(rate), buyPrice = this.buyPrice;
    if ( !buyPrice ) { return 0; }
    return this.floatFormat((vPrice - buyPrice) / buyPrice * 100, 2);
  }, triggerProps);

  myScope1.helper('nowEarn', function() {
    var price = this.price, buyPrice = this.buyPrice;
    if ( !buyPrice ) { return 0; }
    return this.floatFormat((price - buyPrice) / buyPrice * 100, 2);
  }, ['price', 'buyPrice']);

  myScope1.helper('lossEarn', function() {
    var price = this.lossPrice, buyPrice = this.buyPrice;
    if ( !buyPrice ) { return 0; }
    return this.floatFormat((price - buyPrice) / buyPrice * 100, 2);
  }, ['lossPrice', 'buyPrice']);

});
