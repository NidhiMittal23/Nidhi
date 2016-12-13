var verticalService = angular.module('vertical.services', []);

verticalService.factory('verticalAPIservice', function($http) {

	var verticalAPI = {};

	var verticalUrl = {
		'endpoint': 'http://localhost:9000/vertical/'
	}

	verticalAPI.getVertical =function() {
		return $http({
			method: 'GET',
			url: verticalUrl.endpoint
		});
	}


	return verticalAPI;
});