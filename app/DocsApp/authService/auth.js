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
            templateUrl: 'DocsApp/authService/views/registerUserView.html',
            controller: 'AuthController as auth',
        })

        .state('registerCompany', {
            url: '/register-company',
            templateUrl: 'DocsApp/authService/views/registerCompanyView.html',
            controller: 'AuthController as auth',
        })

        .state('home', {
            url: '/home',
            data : {requireLogin : true },
            templateUrl: 'DocsApp/authService/views/homeView.html',
            controller: 'HomeController as home',
            authenticate: true
        })

        .state('reset', {
            url: '/forgotPassword',
            templateUrl: 'DocsApp/authService/views/resetPass.html',
        });
});

// Issue: Fugure out and resolve
// git diff fb3ce46b04ba25f751bb8fbf806ffff60677a7b8 6db19abf3c29a49adfc10a5292ecaf64e94211f6
// 6db19abf3c29a49adfc10a5292ecaf64e94211f6 onward have TypeError: Cannot read property 'insertBefore' of null
// in browser