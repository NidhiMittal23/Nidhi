var industryApp = angular.module('industry', ['ui.router', 'industry.controllers', 'industry.services'])

industryApp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('industry',{
            url: '/industry',
            parent: 'home',
            templateUrl: 'DocsApp/industry/templates/industry-list.html',
            controller: 'industryCtrl'
        })

        .state('addIndustry', {
            url: '/industry/add',
            parent: 'home',
            templateUrl: 'DocsApp/industry/templates/industry-alter.html',
            controller: 'industryAlterCtrl',
            params: {}
        })

        .state('editIndustry', {
            url: '/industry/edit/{name}',
            parent: 'home',
            templateUrl: 'DocsApp/industry/templates/industry-alter.html',
            controller: 'industryAlterCtrl',
            params: {id: null, name: null}
        })
})
