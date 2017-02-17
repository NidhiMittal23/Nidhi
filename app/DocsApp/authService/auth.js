var authServiceApp = angular.module('authService', ['ui.router', 'authService.auth', 'authService.home', 'authService.services'])


authServiceApp.config(function($stateProvider, $urlRouterProvider, $authProvider) {
    // put urls at some global place
    $authProvider.tokenType = 'JWT';
    $authProvider.loginUrl = 'http://localhost:9000/auth/login/';
    $authProvider.signupUrl = 'http://localhost:9000/auth/register/'    

    $stateProvider
        .state('auth', {
            url: '/auth',
            templateUrl: 'DocsApp/authService/views/loginView.html',
            controller: 'AuthController as auth',
        })

        .state('signup', {
            url: '/signup',
            templateUrl: 'DocsApp/authService/views/registerView.html',
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