/**
 * Created by LAP60033 on 6/21/2015.
 */
'use strict';

(function() {
  var app = angular.module('myApp.directives', []);

  app.directive('navBar', function() {
    return {
      restrict: 'A',
      templateUrl: './partials/main.nav-bar.html'
    };
  });

  app.directive('sideMenu', function() {
    return {
      restrict: 'A',
      templateUrl: './partials/main.side-menu.html'
    };
  });
})();
