var companyApp = angular.module('company', ['ui.router', 'company.controllers', 'company.services'])

companyApp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('company',{
            url: '/company',
            parent: 'home',
            templateUrl: 'DocsApp/company/templates/company-list.html',
            controller: 'companyCtrl',
            authenticate: true
        })

        .state('users',{
            url: '/users/:id?name',
            parent: 'home',
            templateUrl: 'DocsApp/company/templates/user-list.html',
            controller: 'userCtrl',
            params: {id: null, name: null},
            authenticate: true
        })

        .state('companySite', {
            url: '/company-name/:id?name',
            parent: 'home',
            templateUrl: 'DocsApp/company/templates/companySite-list.html',
            controller: 'companySiteCtrl',
            params: {id: null, name: null},
            authenticate: true
        })

        .state('siteDoc', {
            url: '/company/site-name/:id?name',
            parent: 'home',
            templateUrl: 'DocsApp/company/templates/companySiteDoc-list.html',
            controller: 'siteDocCtrl',
            params: {id: null, name: null},
            authenticate: true
        })

        .state('addCompany', {
            url: '/company/add',
            parent: 'home',
            templateUrl: 'DocsApp/company/templates/company-alter.html',
            controller: 'companyAlterCtrl',
            params: {},
            authenticate: true
        })

        .state('editCompany', {
            url: '/company/edit/:id?name',
            parent: 'home',
            templateUrl: 'DocsApp/company/templates/company-alter.html',
            controller: 'companyAlterCtrl',
            params: {id: null, name: null},
            authenticate: true
        })

        .state('addCompanySite', {
            url: '/company-site/:id?name',
            parent: 'home',
            templateUrl: 'DocsApp/company/templates/companySite-alter.html',
            controller: 'siteCtrl',
            params: {id: null, name: null},
            authenticate: true
        })
})