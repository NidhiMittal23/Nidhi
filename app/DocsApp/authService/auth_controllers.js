var authController = angular.module('authService.auth', ['ui-notification', 'satellizer']);

authController.controller('AuthController', function($auth, $state, $scope, authAPIservice,
    companyAPIservice) {
    var vm = this;
    vm.authStatus = {};
    $scope.companyModel = {};

    if ($state.current.name == 'registerCompany') {
        $scope.companyModel.citylist = companyAPIservice.citylist;

        $scope.registerNewCompany = function () {
            var params = $scope.companyModel;
            authAPIservice.registerCompany(params)
            .then(function(data) {
                vm.authStatus.alert = true;
                vm.authStatus.message = "Your company have registered successfully; Our executives will be in touch with you";
                vm.authStatus.register = true;  
            })
        }
    }

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
            vm.authStatus.register = true;   
        });
    };

    vm.login = function() {
        var setUserLocally = function() {
            if (localStorage) {
                authAPIservice.getUserSites()
                .then(function(response){
                    var sitesObjList = response.data.sites;
                    var sites = _.map(sitesObjList, function(site){
                        return site.id
                    });
                    var site_filter = _.find(sitesObjList, function(site) {
                        return typeof site.company != null;
                    });
                    // Store locally User related info
                    // Remove item key on logout
                    // TODO: If user have multiple Site have to look into docuemnt management System
                    // IMP
                    localStorage.setItem('company', String(site_filter.company));
                    localStorage.setItem('sites', String(sites));
                    localStorage.setItem('isAdmin', response.data.is_superuser);
                    localStorage.setItem('isLead', response.data.is_lead);
                    localStorage.setItem('userId', response.data.id);
                });   
            }
            else{
                alert("sorry.. No Web Storage Supported");
                $state.go('auth', {});
            }
        };

        var whenLoggedIn = function(callback) {
            callback();
        };

        var credentials = {
            email: vm.email,
            password: vm.password
        };
        
        // Use Satellizer's $auth service to login
        $auth.login(credentials)
        .then(function(data) {
            whenLoggedIn(setUserLocally);
            // var authToken = auth_token
            vm.authStatus.alert = false;
            // If login is successful, redirect to the users state
            $state.go('home', {});
        });
    };
});
