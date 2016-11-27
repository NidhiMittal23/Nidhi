'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ui.router',
  'myApp.version',
  'license'
])

myApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/license');
});

myApp.controller('navigationCtrl', function($scope){
    $scope.navList = ['license', 'company'];
});
