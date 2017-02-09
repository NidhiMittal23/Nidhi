var authService = angular.module('authService.services', []);

authService.factory('authAPIservice', function($http, $auth) {

    var authAPI = {};

    var authUrl = {
        'endpoint': 'http://localhost:9000/auth/',
        'siteDocs': 'http://localhost:9000/site/'
    }

    authAPI.getUserSites = function() {
        return $http({
            method: 'GET', 
            url: authUrl.endpoint + 'me/'
        })
    }

    authAPI.getSiteDocuments = function(siteId) {
        return $http({
            method: 'GET',
            url: authUrl.siteDocs + siteId + '/get_site_documents/'
        })
    }

    return authAPI;
});