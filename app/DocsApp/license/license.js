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
