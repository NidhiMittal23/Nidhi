var industryApp = angular.module('industry', ['ui.router', 'industry.controllers', 'industry.services'])

industryApp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('industry',{
            url: '/industry',
            templateUrl: 'DocsApp/industry/templates/industry-list.html',
            controller: 'industryCtrl'
        })

})