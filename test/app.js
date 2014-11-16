require.config({
  baseUrl: '../dist',
  waitSeconds: 15
});

require( ['mood'], function(mood) {
  'use strict';

  // debug is true will print the info in console
  mood.Mood.config({ debug: false });

  var app = new mood.Mood('myapp');

  var myScope = app.getScope('myscope');

  myScope.defineControllers(function(scope) {
    var i = 0;
    setInterval(function() {
      scope.test = i;
      scope.name = ', wenshin' + i;
      i++;
    }, 1000);
  });
});