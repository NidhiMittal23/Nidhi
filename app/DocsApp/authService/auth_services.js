var authService = angular.module('authService.services', []);

authService.factory('authAPIservice', function($http, $auth) {

    var authAPI = {};

    var authUrl = {
        'endpoint': 'http://localhost:9000/auth/'
    }

    //todo: check if this works
    authAPI.serverLogout = function() {
        var token = $auth.getToken();
        $http({
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorization': 'Token '+ token,
            },
            url: authUrl.endpoint + 'logout/',
        });
    }

    return authAPI;
});