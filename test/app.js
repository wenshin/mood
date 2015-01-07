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
    'myscope': { show: true, count: 0 }
  });

});
