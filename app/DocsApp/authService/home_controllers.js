var homeController = angular.module('authService.home', ['ui-notification', 'satellizer']);

homeController.controller('HomeController', function($http, $auth, $scope, $state, authAPIservice,
    companyAPIservice, _) {
    var vm = this;

    vm.users;
    vm.error;
    var params = {};

    vm.logout = function() {
        $auth.logout();
        localStorage.removeItem('company');
        localStorage.removeItem('sites');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isLead');
        $state.go('auth');
    }

    $scope.animals = { 
        'Company Management': {
            'Company': ['FreshFoodDesk', 'Flipkart', 'many more...'],
            birds: ['hawk', 'sparrow']
        }
    };

    // [{name: 'FoodDocs', sites: [{name: 'FoodDocs-Site1'}, {name: 'FoodDocs-Site2'}]}]

    params.page = 1;
    companyAPIservice.getCompany(params).success(function (response, status) {
        // From Company Managemnt : Remove Admin Company from Company List from View fetch It
        // TODO: id is hardcoded
        var companyArr = response.results;
        companyArr = _.without(companyArr, _.findWhere(companyArr, {
          id: 1
        }));
        $scope.companyMangement = {
            'Company Management': {
                'Company': companyArr,
            }
        }
    })

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
