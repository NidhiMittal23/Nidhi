var licenseApp = angular.module('license', ['ui.router'])

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


licenseApp.controller('licenseCtrl', function($scope) {
    $scope.licenseList = [{'id': 1, 'name': 'ISO', 'abbreviate': 'ISO', 'granting_authority': 'Comodities Organisation'},
                          {'id': 2, 'name': 'FSCC', 'abbreviate': 'FSCC', 'granting_authority': 'Food Organisation'}]
})

licenseApp.controller('licenseAlterCtrl', function($scope, $stateParams) {
    console.log("In here");
})
