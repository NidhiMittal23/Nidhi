'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ui.router',
  'satellizer',
  'myApp.version',
  'license',
  'category',
  'industry',
  'vertical',
  'company',
  'authService'
])

myApp.config(function($stateProvider, $urlRouterProvider, $authProvider) {
	// put urls at some global place
	// $authProvider.loginUrl = 'http://localhost:9000/auth/login';
    
    $urlRouterProvider.otherwise('/auth');

    // $stateProvider
    //     .state('auth', {
    //         url: '/auth',
    //         templateUrl: 'DocsApp/authService/views/authView.html',
    //         controller: 'AuthController as auth'
    //     })
    //     .state('home', {
    //         url: '/home',
    //         templateUrl: 'DocsApp/authService/views/homeView.html',
    //         controller: 'HomeController as home'
    //     });
});

// myApp.controller('navigationCtrl', function($scope){
//     $scope.navList = ['license', 'category', 'industry', 'vertical', 'company'];
// });
