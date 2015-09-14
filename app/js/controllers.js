/**
 * Created by niennd on 7/1/2015.
 */
'use strict';

(function() {
  var app = angular.module('myApp.controllers', [])

  app.controller('ActionController', ['$scope', '$http', 'WebSocket', function($scope, $http, socket) {
    $scope.consoleLogs = '';
    $scope.actionConfigs = {};
    $scope.jsonResult = {};
    $scope.autoScroll = true;
    $scope.ipList = {};
    $scope.currentAction = undefined;
    $scope.actionDesciption = '';
    $scope.selectedAttrIndex = undefined;

    $scope.request = undefined;
    $scope.requestUpdate = undefined;

    $scope.curIP = '10.198.48.144:1101';
    $scope.uID = 'null';

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

    $http.get('../res/GmTool.json').success(function(data){
      $scope.actionConfigs = data['ActionView'];
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
      $scope.uID = data.uID
      $scope.selectAction(0);
      print_log(data, true, true);
    });

    socket.on('log', function(data) {
      print_log(data, true, true);
    });

    socket.on('action:info', function(data) {
      parse_result(data);
    });

    // on request handler

    $scope.doAction = function() {
      if ($scope.request.actionID < 0) {
        print_log("Action invalid");
        return
      }

      socket.send('action:request', {
        actionID: $scope.request.actionID,
        paramList: $scope.request.paramList
      });

      print_log('Sent action actionID = ' + $scope.request.actionID);
      print_log(JSON.stringify($scope.request, undefined, 2), true);
    }

    $scope.updateAttr = function() {
      if ($scope.requestUpdate.actionID < 0) {
        print_log("Update action invalid");
        return
      }
      socket.send('action:request', {
        actionID: $scope.requestUpdate.actionID,
        paramList: $scope.requestUpdate.paramList
      });

      print_log('Sent action update = ' + $scope.requestUpdate.actionID);
      print_log(JSON.stringify($scope.requestUpdate, undefined, 2), true);
    }

    //
    $scope.clearAction = function() {
      $scope.jsonResult = {};
    }

    $scope.selectAction = function(actionIndex) {
      var curAction = $scope.actionConfigs[actionIndex];
      $scope.currentAction = curAction;
      console.log(curAction);
      $scope.request = {
        uID: $scope.uID,
        actionID: curAction.actionID,
        paramList: []
      };

      for (var k in curAction.paramList) {
        editParam(k, curAction.paramList[k].init);
      }

      $scope.requestUpdate = undefined;
      $scope.selectedAttrIndex = undefined;
      if ($scope.currentAction.attrUpdate === undefined) {
        $scope.selectedAttrIndex = undefined;
      } else {
        $scope.selectedAttrIndex = 0;
        $scope.requestUpdate = {
          uID: $scope.uID,
          actionID: $scope.currentAction.attrUpdate.actionID,
          paramList: []
        };
      }
      $scope.changeAttrUpdate();
      $scope.clearAction();
    }

    $scope.changeAttrUpdate = function() {
      if ($scope.selectedAttrIndex === undefined) {
        return;
      }
      var selectedAttr = $scope.currentAction.attrUpdate.attrList[$scope.selectedAttrIndex];
      $scope.requestUpdate.paramList[0] = selectedAttr.name;
      $scope.requestUpdate.paramList[1] = selectedAttr.init;
    }

    $scope.clearLogs = function() {
      $scope.consoleLogs = '';
    }

    function editParam (index, value) {
      $scope.request.paramList[index] = value;
    }

    // private function
    function responseFormatter(data, showAll) {
      var l0 = new Date().toLocaleTimeString().toString() + '\n';
      if (typeof data === 'string') {
        return l0 + data + '\n';
      }
      var l1 = 'Received: cmdID = ' + data.cmdID + ' - extraInfo : ' + data.extraInfo + ' - ' + data.result.success + '\n';
      var l2 = 'Msg: ' + data.result.msg + '\n';
      if (showAll) {
        return l0 + l1 + l2;
      }
      return l0 + l1;
    }

    function print_log(data, breakLine, showAll) {
      $scope.consoleLogs += responseFormatter(data, showAll);
      if (breakLine) {
        $scope.consoleLogs += '---------------\n';
      }
    }

    function parse_result(data) {
      // implement vew
      if (typeof data === 'string') {
        $scope.jsonResult = data;
        return;
      }
      $scope.jsonResult = prettify(data.result.msg);
      return;
    }

    function prettify(json) {
      if (typeof json === 'string') {
        return '';
      }
      return JSON.stringify(JSON.parse(json), undefined, 2);
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
