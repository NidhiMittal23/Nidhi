var licenseApp = angular.module('license', ['ui.router', 'license.controllers', 'license.services'])

licenseApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('license', {
            url: '/license',
            parent: 'home',
            templateUrl: 'DocsApp/license/templates/license-list.html',
            controller: 'licenseCtrl',
            authenticate: true
        })

        .state('addLicense', {
            url: '/license/add',
            parent: 'home',
            templateUrl: 'DocsApp/license/templates/license-alter.html',
            controller: 'licenseAlterCtrl',
            params: {},
            authenticate: true
        })

        .state('editLicense', {
            url: '/license/edit/{name}',
            parent: 'home',
            templateUrl: 'DocsApp/license/templates/license-alter.html',
            controller: 'licenseAlterCtrl',
            params: {id: null, name: null},
            authenticate: true
        })
})
