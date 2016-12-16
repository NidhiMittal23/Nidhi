var companyApp = angular.module('company', ['ui.router', 'company.controllers', 'company.services'])

companyApp.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('company',{
			url: '/company',
			templateUrl: 'DocsApp/company/templates/company-list.html',
            controller: 'companyCtrl'
		})
})