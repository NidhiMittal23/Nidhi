var documentService = angular.module('document.services', []);

documentService.factory('documentAPIservice', function($http) {

	var documentAPI = {};

	var documentUrl = {
		'endpoint': 'http://localhost:9000/document/'
	}

	documentAPI.getDocument =function() {
        return $http({
            method: 'GET',
            url: documentUrl.endpoint
        });
    }

    documentAPI.getDocVersion =function(id) {
        return $http({
            method: 'GET',
            url: documentUrl.endpoint + id + "/"
        });
    }

    return documentAPI;

});