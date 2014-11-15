/* global require, setInterval, document */

require.config({
  baseUrl: '../dist',
  waitSeconds: 15
});

require( ['mood'], function(mood) {
  'use strict';

  // debug is true will print the info in console
  mood.Mood.config({ debug: true });

  var app = new mood.Mood('myapp');

  app.initScope('myscope', {
      name: '',
      test: 0,
      isRight: true
    },

    function(scope) {
      var i = 0;
      setInterval(function() {
        scope.test = i;
        scope.name = ', wenshin' + i;
        i++;
      }, 1000);
    },

    function(scope) {
      document.getElementById('123').innerHTML = scope.test + scope.name;
    }
  );
});