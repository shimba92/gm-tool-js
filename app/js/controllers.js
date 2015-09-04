/**
 * Created by niennd on 7/1/2015.
 */
'use strict';

(function () {
    var app = angular.module('myApp.controllers', [])

    app.controller('ContentController', function ($scope, $http) {
        $scope.ipList = {};
        $scope.curIP = '10.198.48.144:1101';

        $http.get(options.api.base_url + '/api/ip-list')
            .success(function (data) {
                $scope.ipList = data;
                $scope.curIP = data[0];
                console.log(data);
            })
            .error(function (status, data) {
                console.log('Status: ' + status);
                console.log('Error: ' + data);
            });

        $scope.setupConnection = function () {
            $http.get(options.api.base_url + '/api/socket-connect/' + $scope.curIP)
                .success(function(data){
                    console.log(data);
                })
                .error(function (status, data) {
                    console.log('Status: ' + status);
                    console.log('Error: ' + data);
                });
        }
    });

    app.controller('UserController', ['$scope', 'AuthenticationService', function ($scope, AuthenticationService) {
        $scope.authenService = AuthenticationService;
    }]);

    app.controller('AdminController', function ($scope, $http) {
        $scope.users = {};
        $scope.newUser = {};
        $scope.newUser.role = 'admin';

        $http.get(options.api.base_url + '/api/users')
            .success(function (data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function (status, data) {
                console.log('Status: ' + status);
                console.log('Error: ' + data);
            });

        $http.get(options.api.base_url + '/api/config-roles')
            .success(function (data) {
                $scope.userRoles = data;
                console.log(data);
            })
            .error(function (status, data) {
                console.log('Status: ' + status);
                console.log('Error: ' + data);
            });

        $scope.deleteUser = function (uID) {
            $http.delete(options.api.base_url + '/api/delete-user/' + uID)
                .success(function (data) {
                    $scope.users = data;
                    console.log(data);
                })
                .error(function (status, data) {
                    console.log('Status: ' + status);
                    console.log('Error: ' + data);
                });
        };

        $scope.addUser = function () {
            $http.post(options.api.base_url + '/api/add-user', this.newUser)
                .success(function (data) {
                    $scope.users.push($scope.newUser);
                    $scope.newUser = {};
                    console.log(data);
                })
                .error(function (status, data) {
                    console.log('Status: ' + status);
                    console.log('Error: ' + data);
                });
        };
    });

    app.controller('AuthController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
        function ($scope, $location, $window, UserService, AuthenticationService) {
            $scope.authUser = {email: 'admin@root.com', password: 'root'};
            //Admin User Controller (signIn, logOut)
            $scope.signIn = function signIn() {
                var email = $scope.authUser.email;
                var password = $scope.authUser.password;
                $scope.authUser = {email: 'admin@root.com', password: 'root'};
                if (email != null && password != null) {
                    UserService.signIn(email, password).success(function (data) {
                        AuthenticationService.isAuthenticated = true;
                        AuthenticationService.isAdmin = data.user.role === 'admin';
                        AuthenticationService.uInfo = data.user;
                        $window.sessionStorage.token = data.token;
                        $window.sessionStorage.uRole = data.user.role;
                        $location.path("/");
                    }).error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            }

            $scope.logOut = function logOut() {
                if (AuthenticationService.isAuthenticated) {
                    UserService.logOut().success(function (data) {
                        AuthenticationService.isAuthenticated = false;
                        AuthenticationService.uInfo = undefined;
                        delete $window.sessionStorage.token;
                        $location.path("/login");
                    }).error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
                else {
                    $location.path("/login");
                }
            }
        }
    ]);

    function json2array(json) {
        var result = [];
        var keys = Object.keys(json);
        keys.forEach(function (key) {
            result.push(json[key]);
        });
        return result;
    }
})();
