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
  'document',
  'authService',
  '720kb.tooltips'
])

myApp.config(function($stateProvider, $urlRouterProvider, $authProvider) {

    $urlRouterProvider.otherwise('/auth');

});

myApp.run(function ($rootScope, $state, $auth) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        var userToken = $auth.getToken(); //(userToken == null)
        // todo: cross check token, will be another good check
        if (toState.authenticate && (userToken == null)) {
            $state.transitionTo("auth");
            event.preventDefault(); 
        }
    });
});

myApp.directive('fileModel', ['$parse', function($parse){
    return {
    restrict: 'A',
    link: function(scope, element, attrs){
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
                })
            })
        }
    }
}])

myApp.constant('_',
    window._
);