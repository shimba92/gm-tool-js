/**
 * Created by niennd on 7/1/2015.
 */

'use strict';

(function(){
    var app = angular.module('myApp.services', []);

    app.factory('AuthenticationService', function() {
        var auth = {
            isAuthenticated: false,
            isAdmin: false
        }

        return auth;
    });

    app.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },

            requestError: function(rejection) {
                return $q.reject(rejection);
            },

            /* Set Authentication.isAuthenticated to true if 200 received */
            response: function (response) {
                if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                    AuthenticationService.isAuthenticated = true;
                    AuthenticationService.isAdmin = $window.sessionStorage.uRole === 'admin';
                }
                return response || $q.when(response);
            },

            /* Revoke client authentication if 401 is received */
            responseError: function(rejection) {
                if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                    delete $window.sessionStorage.token;
                    AuthenticationService.isAuthenticated = false;
                    AuthenticationService.uInfo = undefined;
                    $location.path("/login");
                }

                return $q.reject(rejection);
            }
        };
    });

    app.factory('httpResponseInterceptor', function ($q, $window, $location) {
        return {
            responseError: function(rejection) {

                if (rejection != null ) {
                    console.log(rejection);
                    var error_status = rejection.status === null  || rejection.status === 404|| rejection.status === 401;
                    if ( error_status === true ) $location.path("/error");
                }
                return $q.reject(rejection);
            }
        };
    });

    app.factory('UserService', function ($http) {
        return {
            signIn: function(email, password) {
                return $http.post(options.api.base_url + '/api/authentication', {email: email, password: password});
            },

            logOut: function() {
                return $http.get(options.api.base_url + '/api/logout');
            }
        }
    });

    app.factory('WebSocket', function($rootScope) {
      var socket = io.connect();
      return {
        on: function(eventName, callback) {
          socket.on(eventName, function() {
            var args = arguments;
            $rootScope.$apply(function() {
              callback.apply(socket, args);
            });
          })
        },
        emit: function(eventName, data, callback) {
          socket.emit(eventName, data, function(){
            if ( callback ) {
              callback.apply(socket, args);
            }
          });
        },
        send: function(eventName, data, callback) {
          socket.emit(eventName, data, function(){
            if ( callback ) {
              callback.apply(socket, args);
            }
          })
        }
      };
    });
})();
