'use strict';

// define angular module with its dependencies(), config is passing control to controller
angular.module('myApp', [
  'ngRoute',
  'myApp.company',
  'myApp.license',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/company'});
}]);
