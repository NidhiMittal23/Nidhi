var documentApp = angular.module('document', ['ui.router', 'document.controllers', 'document.services', 'license.services', 'vertical.services'])

documentApp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('document', {
            url: '/document',
            parent: 'home',
            templateUrl: 'DocsApp/document/templates/document-list.html',
            controller: 'documentCtrl',
            authenticate: true
        })

        .state('addDocument', {
            url: '/document/add',
            parent: 'home',
            templateUrl: 'DocsApp/document/templates/document-alter.html',
            controller: 'documentAlterCtrl',
            params: {},
            authenticate: true
        })

        .state('editDocument', {
            url: '/document/edit/{name}',
            parent: 'home',
            templateUrl: 'DocsApp/document/templates/document-alter.html',
            controller: 'documentAlterCtrl',
            params: {id: null, name: null},
            authenticate: true
        })

        .state('docVersion', {
            url: '/{name}',
            parent: 'home',
            templateUrl: 'DocsApp/document/templates/docVersion-list.html',
            controller: 'docVersionCtrl',
            params: {id: null, name: null},
            authenticate: true
        })
})