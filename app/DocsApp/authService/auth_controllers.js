var authController = angular.module('authService.auth', ['ui-notification', 'satellizer']);

authController.controller('AuthController', function($auth, $state) {
    var vm = this;
    vm.authStatus = {}

    vm.register = function() {
        var user = {
            username: vm.userName,
            email: vm.email,
            password: vm.password
        };

        $auth.signup(user)
        .then(function(data) {
            vm.authStatus.alert = true;
            vm.authStatus.message = "You have registered successfully ";
            vm.authStatus.register = true
        })
        .catch(function(response) {
            // Handle errors here.
            var status = response['status'].toString();
            if (['400', '405'].indexOf(status) >= 0) {
                vm.authStatus.alert = true;
                if ('username' in response.data) {
                    vm.authStatus.message = response.data.username[0];
                }
                else {
                    vm.authStatus.message = "Error occured while Register !";
                }
                
            }
        });
    }

    vm.login = function() {
        var credentials = {
            username: vm.username,
            password: vm.password
        }
        
        // Use Satellizer's $auth service to login
        $auth.login(credentials)
        .then(function(data) {

            // var authToken = auth_token
            vm.authStatus.alert = false;
            // If login is successful, redirect to the users state
            $state.go('home', {});
        })
        .catch(function(response) {
            // Handle errors here.
            var status = response['status'].toString();
            if (['400', '405'].indexOf(status) >= 0) {
                vm.authStatus.alert = true;
                // debugger;
                if ('non_field_errors' in response.data) {
                    vm.authStatus.message = response.data.non_field_errors[0];
                }
                else {
                    vm.authStatus.message = "Invalid Credentials";
                }
            }
        });
    }
});
