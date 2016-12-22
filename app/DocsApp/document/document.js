var documentApp = angular.module('document', ['ui.router', 'document.controllers', 'document.services'])

documentApp.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('document', {
			url: '/document',
			parent: 'home',
			templateUrl: 'DocsApp/document/templates/document-list.html',
			controller: 'documentCtrl',
			authenticate: true
		})
})