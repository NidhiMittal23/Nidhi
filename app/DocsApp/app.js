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
  'ngTagsInput',
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap',
  'ngTile'
])

myApp.config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider) {
    $httpProvider.interceptors.push('RequestsErrorHandler');
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

myApp.factory('RequestsErrorHandler', function($q) {
  return {
    'responseError': function(rejection) {
      if (rejection.status == 401) {
        console.log("Refresh token...or logout user and ask him to re-login..");
        $state.transitionTo("auth");
      }
      if (rejection.status == 400) {
        if ('data' in rejection){
          if (('non_field_errors') in rejection.data) {
            // have to include Notification #todo
            alert(rejection.data.non_field_errors);
          }
          if (('name') in rejection.data) {
            alert(rejection.data.name[0]);
          }
        }
      }
      else if (rejection.status == 500) {
        alert("Server error occured, Contact Admin");
        // Notification.error("Server error occured, Contact Admin");
      }
      else {
        alert("Error occured, contact Admin");
        // Notification.error("Error occured, contact Admin");
      }
      return $q.reject(rejection);
    },
  }
});

myApp.constant('_',
    window._
);