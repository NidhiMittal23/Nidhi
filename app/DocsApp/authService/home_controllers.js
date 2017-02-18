var homeController = angular.module('authService.home', ['ui-notification', 'satellizer']);

homeController.controller('HomeController', function($http, $auth, $scope, $state, authAPIservice) {
    var vm = this;

    vm.users;
    vm.error;

    vm.logout = function() {

        $auth.logout();
        $state.transitionTo("auth");
    }

    $scope.animals = { 
        'Company Management': {
            'Company': ['FreshFoodDesk', 'Flipkart', 'many more...'],
            birds: ['hawk', 'sparrow']
        }
    };

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
            }],
        colSize: "col-lg-4",
        tileType: "tile-md-square",
        colors: ["#fca9cf", "#a8a5f7", "#efd2a0", "#8f8e91"]
    };

});
