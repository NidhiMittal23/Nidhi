var verticalApp = angular.module('vertical', ['ui.router', 'vertical.controllers', 'vertical.services'])

verticalApp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('vertical',{
            url: '/vertical',
            parent: 'home',
            templateUrl: 'DocsApp/vertical/templates/vertical-list.html',
            controller: 'verticalCtrl',
            authenticate: true
        })

        .state('addVertical', {
            url: '/vertical/add',
            parent: 'home',
            templateUrl: 'DocsApp/vertical/templates/vertical-alter.html',
            controller: 'verticalAlterCtrl',
            params: {},
            authenticate: true
        })

        .state('editVertical', {
            url: '/vertical/edit/{name}',
            parent: 'home',
            templateUrl: 'DocsApp/vertical/templates/vertical-alter.html',
            controller: 'verticalAlterCtrl',
            params: {id: null, name: null},
            authenticate: true
        })
})