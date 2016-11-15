'use strict';

angular.module('myApp.license', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/license', {
    templateUrl: 'license/license.html',
    controller: 'licenseCtrl'
  });
}])

.controller('licenseCtrl', [function() {

}]);