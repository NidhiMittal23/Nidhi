'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ui.router',
  'satellizer',
  'myApp.version',
  'parent',
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
  'ngTile',
  'ngSanitize',
  'ui.utils',
  'ui.bootstrap.datetimepicker'
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

myApp.factory('RequestsErrorHandler', function($q, _, $injector) {
  // Notification injection causes circular dependencies error while using ui.state
  // $injector is used to solve this issue
  var errorMessage;
  return {
    'request': function(config) {
      // can be done better
      // Trying to change url in fly to Production server;
      if ('url' in config ) {
        var url = config.url;
        if ((config.url).search("localhost:9000") !== -1) {
          config.url = (config.url).replace("localhost:9000", "127.0.0.1:8010");
        }
      }
      return config || $q.when(config);
    },
    'responseError': function(rejection) {
      if (rejection.status == 401) {
        errorMessage = "Logout.. your key has expired";
      }
      if (rejection.status == 400) {
        var error = _.map(rejection.data, function(obj) {
          return obj
        });
        errorMessage = error.toString();
      }
      else if (rejection.status == 500) {
        var error = _.map(rejection.data, function(obj) {
          return obj
        })
        errorMessage = error.toString() + "...Contact ADMIN";
      }
      else {
        errorMessage = "Error Occured...Contact ADMIN ";
      }
      var Notification = $injector.get('Notification');
      Notification.error(errorMessage);
      return $q.reject(rejection);
    }
  }
});

myApp.constant('_',
    window._
);

// myApp.constant('config', {  
//   apiUrl: 'https://35.154.197.42:9010',
//   baseUrl: '/',
//   enableDebug: true
// });
