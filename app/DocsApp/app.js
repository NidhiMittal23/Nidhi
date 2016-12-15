'use strict';

angular.module('Home', []);

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ui.router',
  'ngCookies',
  'myApp.version',
  'license',
  'category',
  'industry',
  'vertical',
  'Home'
])

myApp.config(function ($stateProvider, $urlRouterProvider) {
 
    $stateProvider
        // available for anybody
        .state('public',{
            url : '/public',
            template : '<div>public</div>',
        })
        // just for authenticated
        .state('main',{
            url : '/main',
            template : '<div>main for authenticated</div>',
            data : {requireLogin : true },
        })

        .state('home',{
            url : '/home',
            templateUrl : 'DocsApp/home/views/home.html',
            controller: 'HomeController',
            data : {requireLogin : true },
        })
        // just for authenticated
        .state('other',{
            url : '/other',
            template : '<div>other for authenticated</div>',
            data : {requireLogin : true },
        })
        // the log-on screen
        .state('login',{
            url : '/login',
            templateUrl : 'DocsApp/login.html',
            controller : 'LoginController',
        })
    
    $urlRouterProvider.otherwise("/other");

})

myApp.controller('LoginController',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
 
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                if(response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('/home');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    });




 
myApp.factory('AuthenticationService',
    function (Base64, $http, $cookieStore, $rootScope, $timeout) {
        var service = {};

        service.Login = function (username, password, callback) {

            // /* Dummy authentication for testing, uses $timeout to simulate api call
            //  ----------------------------------------------*/
            // $timeout(function(){
            //     var response = { success: username === 'test' && password === 'test' };
            //     if(!response.success) {
            //         response.message = 'Username or password is incorrect';
            //     }
            //     callback(response);
            // }, 1000);


            /* Use this for real authentication
             ----------------------------------------------*/
            // $http.post('/auth/login', { username: username, password: password })
            //    .success(function (response) {
            //        callback(response);
            //    });
            
            // var settings = {
            //   "async": true,
            //   "crossDomain": true,
            //   "url": "http://127.0.0.1:9000/auth/login/",
            //   "method": "POST",
            //   "headers": {
            //     "content-type": "application/x-www-form-urlencoded",
            //     "authorization": "Basic ZGpvc2VyOmRqb3Nlcg==",
            //     "cache-control": "no-cache",
            //     "postman-token": "cbd765ad-ab6c-400e-c0a2-5c2b8b10a832"
            //   },
            //   "data": {
            //     "username": "djoser",
            //     "password": "djoser"
            //   }
            // }


            $http({
                'method': 'POST',
                'headers': {"content-type": "application/x-www-form-urlencoded",
                'authorization': "Basic ZGpvc2VyOmRqb3Nlcg==",
                'cache-control': "no-cache"},
                'url': 'http://127.0.0.1:9000/auth/login/',
                'async': true,
                'crossDomain': true,
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                'data': { username: username, password: password },

            }).then(function successCallback(response) {
                // console.log(response);
                var authToken = response.data.auth_token;
                // debugger;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        };
 
        service.SetCredentials = function (username, password) {
            var authdata = Base64.encode(username + ':' + password);
 
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
 
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return service;
    })



myApp.factory('Base64', function () {
    /* jshint ignore:start */
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
 
    /* jshint ignore:end */
});

myApp.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$stateChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);


// myApp.config(function($stateProvider, $urlRouterProvider) {
//     $urlRouterProvider.otherwise('/license');
// });

// myApp.controller('navigationCtrl', function($scope){
//     $scope.navList = ['license', 'category', 'industry', 'vertical'];
// });
