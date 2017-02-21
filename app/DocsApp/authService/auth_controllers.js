var authController = angular.module('authService.auth', ['ui-notification', 'satellizer']);

authController.controller('AuthController', function($auth, $state, authAPIservice) {
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
        var setUserLocally = function() {
            if (localStorage) {
                authAPIservice.getUserSites()
                .then(function(response){
                    var sitesObjList = response.data.sites;
                    var sites = _.map(sitesObjList, function(site){
                        return site.id
                    })
                    var site_filter = _.find(sitesObjList, function(site) {
                        return typeof site.company != null;
                    })
                    // Store locally User related info
                    // Remove item key on logout
                    localStorage.setItem('company', String(site_filter.company));
                    localStorage.setItem('sites', String(sites));
                    localStorage.setItem('isAdmin', response.data.is_superuser);
                    localStorage.setItem('isLead', response.data.is_lead);
                })   
            }
            else{
                alert("sorry.. No Web Storage Supported");
                $state.go('auth', {});
            }
        }

        var whenLoggedIn = function(callback) {
            callback();
        }

        var credentials = {
            email: vm.email,
            password: vm.password
        }
        
        // Use Satellizer's $auth service to login
        $auth.login(credentials)
        .then(function(data) {
            whenLoggedIn(setUserLocally);
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
