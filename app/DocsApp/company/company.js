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
})