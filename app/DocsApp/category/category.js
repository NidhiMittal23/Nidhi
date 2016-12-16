var categoryApp = angular.module('category', ['ui.router', 'category.controllers', 'category.services'])

categoryApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('category', {
            url: '/category',
            parent: 'home',
            templateUrl: 'DocsApp/category/templates/category-list.html',
            controller: 'categoryCtrl'
        })

        .state('addCategory', {
            url: '/category/add',
            parent: 'home',
            templateUrl: 'DocsApp/category/templates/category-alter.html',
            controller: 'categoryAlterCtrl',
            params: {}
        })

        .state('editCategory', {
            url: '/category/edit/{name}',
            parent: 'home',
            templateUrl: 'DocsApp/category/templates/category-alter.html',
            controller: 'categoryAlterCtrl',
            params: {id: null, name: null}
        })
})