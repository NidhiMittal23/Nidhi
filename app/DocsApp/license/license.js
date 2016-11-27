var licenseApp = angular.module('license', ['ui.router', 'license.controllers', 'license.services'])

licenseApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('license', {
            url: '/license',
            templateUrl: 'DocsApp/license/templates/license-list.html',
            controller: 'licenseCtrl'
        })

        .state('addLicense', {
            url: '/license/add',
            templateUrl: 'DocsApp/license/templates/license-alter.html',
            controller: 'licenseAlterCtrl'
        })

        .state('editLicense', {
            url: '/license/edit/{name}',
            template: "<p>Edit license state </p>"
        })
})


// licenseApp.controller('licenseCtrl', function($scope, licenseAPIservice) {
//     licenseAPIservice.getlicense().success(function (response) {
//         $scope.licenseList = response;
//     })
// })


// licenseApp.controller('licenseAlterCtrl', function($scope, $stateParams) {
    
// })


// licenseApp.factory('licenseAPIservice', function($http) {

//     var licenseAPI = {};

//     licenseAPI.getlicense = function() {
//       return $http({
//         method: 'GET', 
//         url: 'http://localhost:9000/licences/'
//       });
//     }

//     licenseAPI.getLicenseDetails = function(id) {
//       return $http({
//         method: 'JSONP', 
//         url: 'http://ergast.com/api/f1/2013/drivers/'+ id +'/driverStandings.json?callback=JSON_CALLBACK'
//       });
//     }

//     return licenseAPI;
//   });