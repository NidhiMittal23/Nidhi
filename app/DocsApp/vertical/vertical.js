var verticalApp = angular.module('vertical', ['ui.router', 'vertical.controllers', 'vertical.services'])

verticalApp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('vertical',{
            url: '/vertical',
            templateUrl: 'DocsApp/vertical/templates/vertical-list.html',
            controller: 'verticalCtrl'
        })

        .state('addVertical', {
            url: '/vertical/add',
            templateUrl: 'DocsApp/vertical/templates/vertical-alter.html',
            controller: 'verticalAlterCtrl',
            params: {}
        })

        .state('editVertical', {
            url: '/vertical/edit/{name}',
            templateUrl: 'DocsApp/vertical/templates/vertical-alter.html',
            controller: 'verticalAlterCtrl',
            params: {id: null, name: null}
        })
})