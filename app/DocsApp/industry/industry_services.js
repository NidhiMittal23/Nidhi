var industryService = angular.module('industry.services', []);

industryService.factory('industryAPIservice', function($http) {
	var industryAPI = {};

	var industryUrl = {
		'endpoint': 'http://localhost:9000/industries/'
	}

	industryAPI.getIndustry = function() {
		return $http({
			method: 'GET',
			url: industryUrl.endpoint
		});
	}

    industryAPI.getIndustryDetails = function(id) {
        return $http({
            method: 'GET', 
            url: industryUrl.endpoint + id
        });
    }

    return industryAPI;
});