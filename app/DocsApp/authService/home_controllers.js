var homeController = angular.module('authService.home', ['ui-notification', 'satellizer']);

homeController.controller('HomeController', function($http, $auth, $scope, $state, authAPIservice) {
    var vm = this;

    vm.users;
    vm.error;

    vm.logout = function() {

        $auth.logout();
        $state.transitionTo("auth");
    }

    $scope.navList = [
    	{ name : 'License', val : 'license'},
    	{ name : 'Category', val : 'category'},
    	{ name : 'Industry', val : 'industry'},
    	{ name : 'Vertical', val : 'vertical'},
    	{ name : 'Company Management', val : 'company'},
    	{ name : 'Document Management', val : 'document'}
    ];
});
