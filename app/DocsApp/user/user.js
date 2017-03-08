var userApp = angular.module('user', ['ui.router', 'user.controllers', 'user.services']);

userApp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('user',{
            url: '/user',
            parent: 'home',
            templateUrl: 'DocsApp/user/templates/user-list.html',
            controller: 'userCtrl',
            authenticate: true
        })

        .state('userAdd', {
            url: '/user/add',
            parent: 'home',
            templateUrl: 'DocsApp/user/templates/user-alter.html',
            controller: 'userAlterCtrl',
            params: {},
            authenticate: true
        })

        .state('userEdit', {
            url: '/user/edit/{name}',
            parent: 'home',
            templateUrl: 'DocsApp/user/templates/user-alter.html',
            controller: 'userAlterCtrl',
            params: {id: null, name: null},
            authenticate: true
        });
});