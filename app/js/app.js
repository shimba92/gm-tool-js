'use strict';

var options = {};
options.api = {};
options.api.base_url = "http://localhost:9669";

options.actions = [
  {
    name: 'Account info',
    cmdID : 10,
    paramList: [
      {
        id:'user-id',
        label: 'User ID',
        type: 'string'
      }
    ],
    updateCmdID: 110
  },
  {
    name: 'Event data',
    cmdID : 11,
    paramList: [
      {
        id:'user-id',
        label: 'User ID',
        type: 'string'
      },
      {
        id:'event-id',
        label: 'Event ID',
        type: 'string'
      }
    ],
    updateCmdID: 0
  }
];

(function() {
  var app = angular.module('myApp', [
    'ngRoute',
    'yaru22.jsonHuman',
    'myApp.directives',
    'myApp.controllers',
    'myApp.filters',
    'myApp.services'
  ]);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: './partials/main.content.html',
      controller: 'ActionController',
      access: {
        requiredAuthentication: true
      }
    }).
    when('/login', {
      templateUrl: './partials/auth.login-form.html',
      controller: 'AuthController'
    }).
    when('/admin', {
      templateUrl: './partials/auth.admin-site.html',
      controller: 'AdminController',
      access: {
        requiredAuthentication: true
      }
    }).
    when('/error', {
      templateUrl: './partials/error.html',
      controller: ''
    }).
    otherwise({
      redirectTo: '/'
    });
  }]);

  app.config(function($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
  });

  app.config(function($httpProvider) {
    $httpProvider.interceptors.push('httpResponseInterceptor');
  });

  app.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
      //redirect only if both isAuthenticated is false and no token is set
      if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
        $location.path("/login");
      }
    });
  });

})();
