var documentService = angular.module('document.services', []);

documentService.factory('documentAPIservice', function($http, Notification) {

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

    documentAPI.postDocVersionDetail = function(uploadUrl, data){
        var fd = new FormData();
        for(var key in data)
            fd.append(key, data[key]);
        $http.post(uploadUrl,fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined  }
        }).success(function(data, status) {
        // file is uploaded successfully
        Notification.success(data.name+' added successfully');
        })

    }

    return documentAPI;

});