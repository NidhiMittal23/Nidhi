var homeController = angular.module('authService.home', ['ui-notification', 'satellizer']);

homeController.controller('HomeController', function($http, $auth, $scope, $state, authAPIservice) {
    var vm = this;

    vm.users;
    vm.error;

    vm.logout = function() {

        $auth.logout();
        $state.transitionTo("auth");
    }

    $scope.navList = ['license', 'category', 'industry', 'vertical', 'company'];
});
