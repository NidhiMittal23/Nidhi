var authServiceApp = angular.module('authService', ['ui.router', 'authService.auth', 'authService.home', 'authService.services'])


authServiceApp.config(function($stateProvider, $urlRouterProvider, $authProvider) {
    // put urls at some global place
    $authProvider.loginUrl = 'http://localhost:9000/auth/login';

    $stateProvider
        .state('auth', {
            url: '/auth',
            templateUrl: 'DocsApp/authService/views/authView.html',
            controller: 'AuthController as auth',
        })
        .state('home', {
            url: '/home',
            data : {requireLogin : true },
            templateUrl: 'DocsApp/authService/views/homeView.html',
            controller: 'HomeController as home',
            authenticate: true
        });
});