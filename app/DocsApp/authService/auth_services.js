var authService = angular.module('authService.services', []);

authService.factory('authAPIservice', function($http, $auth, config) {

    var authAPI = {};

    var authUrl = {
        'endpoint': config.apiUrl+ 'auth/',
        'siteDocs': config.apiUrl + 'site/',
        'company': config.apiUrl + 'company/'
    };

    authAPI.adminSiteId = 1;
    var IndiaMobileCode = config.IndiaMobileCode;
    authAPI.companyImageUrl = "DocsApp/authService/styles/foodprodocs.jpg";

    authAPI.getUserSites = function() {
        return $http({
            method: 'GET', 
            url: authUrl.endpoint + 'me/'
        });
    };

    authAPI.registerCompany = function(params) {
        var payload = new FormData();

        // Bussiness Logic: Industry has been fixed for Food
        payload.append('industry', 1);
        payload.append('name', params.name);
        payload.append('is_active', false);
        payload.append('city', params.citySelected);
        payload.append('logo', params.logo);
        payload.append('phone_number', IndiaMobileCode + params.phone_number);
        payload.append('email', params.email);
        payload.append('is_approved', false);

        return $http({
            method: 'POST',
            url: authUrl.company,
            data: payload,
            //assign content-type as undefined, the browser
            //will assign the correct boundary for us
            headers: { 'Content-Type': undefined},
            //prevents serializing payload.  don't do it.
            transformRequest: angular.identity
        });
    };



    return authAPI;
});