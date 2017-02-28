var homeController = angular.module('authService.home', ['ui-notification', 'satellizer']);

homeController.controller('HomeController', function($http, $auth, $scope, $state, authAPIservice,
    companyAPIservice, _, $timeout) {
    var vm = this;
    $timeout(callAtTimeout, 700);
    vm.users;
    vm.error;
    vm.adminSiteId = authAPIservice.adminSiteId;
    vm.companyId;
    var params = {};
    vm.companyImageUrl = authAPIservice.companyImageUrl;

    vm.logout = function() {
        $auth.logout();
        localStorage.removeItem('company');
        localStorage.removeItem('sites');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isLead');
        localStorage.removeItem('userId');
        $state.go('auth');
    }

    // TODO: Set company Drop Dwon based on User's Company

    // 1. If the user is Admin:
    //      a. Company Management, list of all company under Admin Company (remove Admin Company From List)
    //      b. Document Management, admin's Site Document will be managed
    // 2. If the user is Client:
    //      a. Company Management, Sites Info
    //      b. No Document Management 
    
    // Timeout is called as asynchronsly home.controllers runs before auth.controller after login
    // Hence localStorage.getItem run before localStorage.setItem
    function callAtTimeout() {
        vm.isAdmin = (localStorage.getItem("isAdmin") === 'true');
        params.page = 1;
        if (vm.isAdmin) {
            // fetch all company Info
            companyAPIservice.getCompany(params).success(function (response, status) {
                // From Company Managemnt : Remove Admin Company from Company List from View fetch It
                // TODO: id is hardcoded
                var companyArr = response.results;
                companyArr = _.without(companyArr, _.findWhere(companyArr, {
                  id: vm.adminSiteId
                }));
                $scope.companyMangement = {
                    'Company Management': {
                        'Company': companyArr,
                    }
                }
            })
        }
        else {
            // TODO: populate this based on sites user is registered into
            // This will solve case when user is involved in many sites
            // create a side nave based on user's site not company..
            vm.companyId = localStorage.getItem("company");
            companyAPIservice.getCompanyDetails(vm.companyId).success(function(response, status) {
                $scope.SiteMangement = {}
                $scope.SiteMangement[response.name] = response.sites;
            })
        }
    }
    

    $scope.isNavCollapsed = true;
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;

    $scope.tileSettings = {
        data: [{
                icon: 'fa fa-certificate',
                // stat: '365',
                title: 'License',
                link: '#/home/license',
            },
            {
                icon: 'fa fa-snowflake-o',
                // stat: '365',
                title: 'Vertical',
                link: '#/home/vertical',
            },
            {
                icon: 'fa fa-tags',
                // stat: '365',
                title: 'Category',
                link: '#/home/category',
            },
            {
                icon: 'fa fa-industry',
                // stat: '365',
                title: 'Industry',
                link: '#/home/industry',
            },
            {
                icon: 'fa fa-building-o',
                // stat: '365',
                title: 'Company',
                link: '#/home/company',
            }],
        colSize: "col-lg-4",
        tileType: "tile-md-square",
        colors: ["#fca9cf", "#a8a5f7", "#efd2a0", "#8f8e91", "#5893f4"]
    };

});
