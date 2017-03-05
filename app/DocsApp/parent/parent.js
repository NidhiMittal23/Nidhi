var parentApp = angular.module('parent', ['ui.router', 'parent.controllers',
	'parent.services', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);

parentApp.config(function($stateProvider) {
	$stateProvider
		.state('modal', {
			templateUrl: 'DocsApp/parent/templates/modals.html',
			controller: 'modalCtrl as $ctrl',
			parent: 'home'
		});
});