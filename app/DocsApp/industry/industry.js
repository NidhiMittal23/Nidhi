var industryApp = angular.module('industry', ['ui.router', 'industry.controllers', 'industry.services'])

industryApp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('industry',{
            url: '/industry',
            templateUrl: 'DocsApp/industry/templates/industry-list.html',
            controller: 'industryCtrl'
        })

        .state('addIndustry', {
            url: '/industry/add',
            templateUrl: 'DocsApp/industry/templates/industry-alter.html',
            controller: 'industryAlterCtrl',
            params: {}
        })

})