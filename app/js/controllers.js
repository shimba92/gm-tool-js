/**
 * Created by niennd on 7/1/2015.
 */
'use strict';

(function() {
  var app = angular.module('myApp.controllers', [])

  app.controller('ActionController', ['$scope', '$http', 'WebSocket', function($scope, $http, socket) {
    $scope.consoleLogs = '';
    $scope.ipList = {};
    $scope.curIP = '10.198.48.144:1101';
    $scope.uID = 'null'
    $scope.request = {
      uID: $scope.uID,
      cmdID: 0,
      paramList: []
    }

    $http.get(options.api.base_url + '/api/ip-list')
      .success(function(data) {
        $scope.ipList = data;
        $scope.curIP = data[0];
        console.log(data);
      })
      .error(function(status, data) {
        console.log('Status: ' + status);
        console.log('Error: ' + data);
      });

    $scope.setupConnection = function() {
      $http.get(options.api.base_url + '/api/socket-connect/' + $scope.curIP)
        .success(function(data) {
          console.log(data);
        })
        .error(function(status, data) {
          console.log('Status: ' + status);
          console.log('Error: ' + data);
        });
    }

    // on receive messages handler
    socket.on('init', function(data) {
      $scope.uID = data.uID;
      $scope.request.uID = data.uID;
      print_log(data, true, true);
    });

    socket.on('action:log', function(data) {
      print_log(data, true, true);
    });

    socket.on('action:info', function(data) {
      parse_result(data);
    });

    // on request handler

    $scope.doAction = function() {
      if ( $scope.request.cmdID  < 0) {
        print_log("Request invalid");
        return
      }

      socket.send('action:request', {
        request: $scope.request
      });
      print_log('Sent request cmdID = ' + $scope.request.cmdID, true);
    }

    // private function
    function responseFormatter(data, showAll) {
      if (typeof data === 'string') {
        return data + '\n';
      }
      var l1 = 'Received: cmdID = ' + data.cmdID + ' - ' + data.result.success + '\n';
      var l2 = 'Msg: ' + data.result.msg + '\n';
      if (showAll) {
        return l1 + l2;
      }
      return l1;
    }

    function print_log(data, breakLine, showAll) {
      $scope.consoleLogs += responseFormatter(data, showAll);
      if (breakLine) {
        $scope.consoleLogs += '---------------\n';
      }
    }

    function parse_result(data) {
      // implement custome vew
      console.log(data);
    }
  }]);

  app.controller('UserController', ['$scope', 'AuthenticationService', function($scope, AuthenticationService) {
    $scope.authenService = AuthenticationService;
  }]);

  app.controller('AdminController', function($scope, $http) {
    $scope.users = {};
    $scope.newUser = {};
    $scope.newUser.role = 'admin';

    $http.get(options.api.base_url + '/api/users')
      .success(function(data) {
        $scope.users = data;
        console.log(data);
      })
      .error(function(status, data) {
        console.log('Status: ' + status);
        console.log('Error: ' + data);
      });

    $http.get(options.api.base_url + '/api/config-roles')
      .success(function(data) {
        $scope.userRoles = data;
        console.log(data);
      })
      .error(function(status, data) {
        console.log('Status: ' + status);
        console.log('Error: ' + data);
      });

    $scope.deleteUser = function(uID) {
      $http.delete(options.api.base_url + '/api/delete-user/' + uID)
        .success(function(data) {
          $scope.users = data;
          console.log(data);
        })
        .error(function(status, data) {
          console.log('Status: ' + status);
          console.log('Error: ' + data);
        });
    };

    $scope.addUser = function() {
      $http.post(options.api.base_url + '/api/add-user', this.newUser)
        .success(function(data) {
          $scope.users.push($scope.newUser);
          $scope.newUser = {};
          console.log(data);
        })
        .error(function(status, data) {
          console.log('Status: ' + status);
          console.log('Error: ' + data);
        });
    };
  });

  app.controller('AuthController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function($scope, $location, $window, UserService, AuthenticationService) {
      $scope.authUser = {
        email: 'admin@root.com',
        password: 'root'
      };
      //Admin User Controller (signIn, logOut)
      $scope.signIn = function signIn() {
        var email = $scope.authUser.email;
        var password = $scope.authUser.password;
        $scope.authUser = {
          email: 'admin@root.com',
          password: 'root'
        };
        if (email != null && password != null) {
          UserService.signIn(email, password).success(function(data) {
            AuthenticationService.isAuthenticated = true;
            AuthenticationService.isAdmin = data.user.role === 'admin';
            AuthenticationService.uInfo = data.user;
            $window.sessionStorage.token = data.token;
            $window.sessionStorage.uRole = data.user.role;
            $location.path("/");
          }).error(function(status, data) {
            console.log(status);
            console.log(data);
          });
        }
      }

      $scope.logOut = function logOut() {
        if (AuthenticationService.isAuthenticated) {
          UserService.logOut().success(function(data) {
            AuthenticationService.isAuthenticated = false;
            AuthenticationService.uInfo = undefined;
            delete $window.sessionStorage.token;
            $location.path("/login");
          }).error(function(status, data) {
            console.log(status);
            console.log(data);
          });
        } else {
          $location.path("/login");
        }
      }
    }
  ]);

  function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key) {
      result.push(json[key]);
    });
    return result;
  }
})();
