require.config({
  baseUrl: "../src",
  waitSeconds: 15
});

require( ['mood'], function(mood) {
  'use strict';

  var app = new mood.Mood();

  app.createScope('v123', {
      name: '',
      test: 0,
      is_right: true
    },

    function(scope) {
      var i = 0;
      setInterval(function() {
        scope.test = i;
        scope.name = 'wenshin' + i;
        i++;
      }, 1000);
    },

    function(scope) {
      document.getElementById('123').innerHTML = scope.name + scope.test;
    }
  );
});