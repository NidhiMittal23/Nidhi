var companyService = angular.module('company.services', []);

companyService.factory('companyAPIservice', function($http) {

	var companyAPI = {};

    var companyUrl = {
        'endpoint': 'http://localhost:9000/company/',
        'siteEndpoint': 'http://localhost:9000/site/'
    }

    companyAPI.getCompany =function() {
        return $http({
            method: 'GET',
            url: companyUrl.endpoint
        });
    }

    companyAPI.getCompanyDetails = function(id) {
        return $http({
            method: 'GET', 
            url: companyUrl.endpoint + id + '/'
        });
    }

    companyAPI.postCompanyDetail = function(params) {
        var payload = new FormData();

        payload.append('name', params.name);
        payload.append('industry', params.industry);

        return $http({
            url: companyUrl.endpoint,
            method: 'POST',
            data: payload,
            //assign content-type as undefined, the browser
            //will assign the correct boundary for us
            headers: { 'Content-Type': undefined},
            //prevents serializing payload.  don't do it.
            transformRequest: angular.identity
        });
    }

    companyAPI.postCompanyDetail = function(params) {
        var payload = new FormData();

        payload.append('name', params.name);
        payload.append('industry', params.industry);

        return $http({
            url: companyUrl.endpoint,
            method: 'POST',
            data: payload,
            //assign content-type as undefined, the browser
            //will assign the correct boundary for us
            headers: { 'Content-Type': undefined},
            //prevents serializing payload.  don't do it.
            transformRequest: angular.identity
        });
    }

    companyAPI.postCompanySiteDetail = function(params) {
        var payload = new FormData();

        payload.append('name', params.name);
        payload.append('location', params.location);
        // loop within params.vertical and params.license to complete payload
        // form.append("vertical", "1");
        // form.append("vertical", "2");

        return $http({
            url: companyUrl.endpoint,
            method: 'POST',
            data: payload,
            //assign content-type as undefined, the browser
            //will assign the correct boundary for us
            headers: { 'Content-Type': undefined},
            //prevents serializing payload.  don't do it.
            transformRequest: angular.identity
        });
    }

    return companyAPI;

});