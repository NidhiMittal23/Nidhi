var authController = angular.module('authService.auth', ['ui-notification', 'satellizer']);

authController.controller('AuthController', function($auth, $state) {
    var vm = this;

    vm.login = function() {

        var credentials = {
            username: vm.username,
            password: vm.password
        }
        
        // Use Satellizer's $auth service to login
        $auth.login(credentials).then(function(data) {

            // If login is successful, redirect to the users state
            $state.go('home', {});
        });
    }
});
