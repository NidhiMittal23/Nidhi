var companyService = angular.module('company.services', []);

companyService.factory('companyAPIservice', function($http) {

	var companyAPI = {};

    var companyUrl = {
        'endpoint': 'http://localhost:9000/company/'
    }

    companyAPI.getCompany =function() {
        return $http({
            method: 'GET',
            url: companyUrl.endpoint
        });
    }

    return companyAPI;

});