var homeController = angular.module('authService.home', ['ui-notification', 'satellizer']);

homeController.controller('HomeController', function($http, $auth, $scope) {
    var vm = this;

    vm.users;
    vm.error;

    vm.logout = function() {
        // implement logout
        $auth.logout();
    }

    $scope.navList = ['license', 'category', 'industry', 'vertical', 'company'];

    // vm.getUsers = function() {

    //     // This request will hit the index method in the AuthenticateController
    //     // on the Laravel side and will return the list of users
    //     $http.get('api/authenticate').success(function(users) {
    //         vm.users = users;
    //     }).error(function(error) {
    //         vm.error = error;
    //     });
    // }
});
