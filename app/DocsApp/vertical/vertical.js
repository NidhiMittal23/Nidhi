var verticalApp = angular.module('vertical', ['ui.router', 'vertical.controllers', 'vertical.services'])

verticalApp.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('vertical',{
			url: '/vertical',
			templateUrl: 'DocsApp/vertical/templates/vertical-list.html',
			controller: 'verticalCtrl'
		})
})