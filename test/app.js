require.config({
  baseUrl: '../dist',
  waitSeconds: 15
});

require( ['mood'], function(mood) {
  'use strict';

  // 不设置Scope的初始值
  // mood.Mood.config({bootstrap: true});


  // 设置Scope的初始值
  mood.Mood.bootstrap({
    'myscope': { show: true, count: 0 },
    'myscope1': { lowPrice: 0, buyPrice: 0, highPrice: 0 },
  });

  var myScope1 = mood.Mood.getScope('myscope1'),
      triggerProps = ['lowPrice', 'buyPrice', 'highPrice'];

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

});
