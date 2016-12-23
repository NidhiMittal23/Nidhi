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

		.state('docVersion', {
			url: '/{name}',
			parent: 'home',
			templateUrl: 'DocsApp/document/templates/docVersion-list.html',
			controller: 'docVersionCtrl',
			params: {id: null, name: null},
			authenticate: true
		})

		.state('addDocVersion', {
            url: '/docVersion/add',
            parent: 'home',
            templateUrl: 'DocsApp/document/templates/docVersion-alter.html',
            controller: 'docVersionAlterCtrl',
            params: {id: null, name: null, docId: null},
            authenticate: true
        })
})