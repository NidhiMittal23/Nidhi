'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ui.router',
  'satellizer',
  'myApp.version',
  'license',
  'category',
  'industry',
  'vertical',
  'company',
  'authService'
])

myApp.config(function($stateProvider, $urlRouterProvider, $authProvider) {

    $urlRouterProvider.otherwise('/auth');

});

myApp.run(function ($rootScope, $state, $auth) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        var userToken = $auth.getToken(); //(userToken == null)
        // debugger;
        // todo: cross check token, will be another good check
        if (toState.authenticate && (userToken == null)) {
            $state.transitionTo("auth");
            event.preventDefault(); 
        }
    });
});