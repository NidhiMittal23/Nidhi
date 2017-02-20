var companyService = angular.module('company.services', []);

companyService.factory('companyAPIservice', function($http, _) {

    var companyAPI = {};

    var companyUrl = {
        'endpoint': 'http://localhost:9000/company/',
        'siteEndpoint': 'http://localhost:9000/site/',
        'relationEndpoint':'http://localhost:9000/relation/',
    }

    companyAPI.getSiteDocuments = function(siteId) {
        return $http({
            method: 'GET',
            url: companyUrl.siteEndpoint + siteId + '/get_site_documents/'
        })
    }

    companyAPI.getCompany =function(params) {
        return $http({
            method: 'GET',
            url: companyUrl.endpoint,
            params: params
        });
    }

    companyAPI.getCompanyDetails = function(id) {
        return $http({
            method: 'GET', 
            url: companyUrl.endpoint + id + '/'
        });
    }

    companyAPI.getCompanySite =function(id) {
        return $http({
            method: 'GET',
            url: companyUrl.endpoint + id + "/"
        });
    }

    companyAPI.getCompanySiteDetails =function(id) {
        return $http({
            method: 'GET',
            url: companyUrl.siteEndpoint + id + "/"
        });
    }

    companyAPI.getRelationDetails = function(id) {
        return $http({
            method: 'GET', 
            url: companyUrl.relationEndpoint + id + '/'
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

        _.each(params.industrySelected, function(industry) {
            payload.append('industry', industry);
        });

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

        payload.append('company', params.siteCompanyId);
        payload.append('name', params.name);
        payload.append('location', params.location);
        
        _.each(params.licenseSelected, function(license) {
            payload.append('license', license);
        });

        _.each(params.verticalSelected, function(vertical) {
            payload.append('vertical', vertical);
        });

        return $http({
            url: companyUrl.siteEndpoint,
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