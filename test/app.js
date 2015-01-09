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
    'myscope1': { price: 0, buyPrice: 0, referPrice: 0 },
  });

  var myScope1 = mood.Mood.getScope('myscope1'),
      triggerProps = ['price', 'buyPrice', 'referPrice'];

  myScope1.helper('vibrate', function(rate) {
    var price = this.toFloat(this.price) || 0, referPrice = this.toFloat(this.referPrice);
    return this.floatFormat(price + (price - referPrice) * rate, 2);
  }, triggerProps);

  myScope1.helper('earn', function(rate) {
    var vPrice = this.vibrate(rate), buyPrice = this.toFloat(this.buyPrice);
    if ( !buyPrice ) { return 0; }
    return this.floatFormat((vPrice - buyPrice) / buyPrice * 100, 2);
  }, triggerProps);

});
