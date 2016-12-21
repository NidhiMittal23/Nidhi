var authService = angular.module('authService.services', []);

authService.factory('authAPIservice', function($http, $auth) {

    var authAPI = {};

    var authUrl = {
        'endpoint': 'http://localhost:9000/auth/'
    }

    return authAPI;
});