var documentService = angular.module('document.services', []);

documentService.factory('documentAPIservice', function($http, Notification) {

	var documentAPI = {};

	var documentUrl = {
		'endpoint': 'http://localhost:9000/document/',
        'relationEndPoint': 'http://localhost:9000/relation/',
        'versionEndPoint': 'http://localhost:9000/version/'
	}

	documentAPI.getDocument =function() {
        return $http({
            method: 'GET',
            url: documentUrl.endpoint
        });
    }

    documentAPI.getDocumentPage =function(url) {
        return $http({
            method: 'GET',
            url: url
        });
    }

    documentAPI.getDocumentDetails =function(id) {
        return $http({
            method: 'GET',
            url: documentUrl.endpoint+ id + '/'
        });
    }

    documentAPI.getDocumentDetail = function (id) {
        return $http({
            method: 'GET',
            url: documentUrl.endpoint + id + "/"
        });
    }

    documentAPI.getDocVersion =function(id) {
        return $http({
            method: 'GET',
            url: documentUrl.endpoint + id + '/'
        });
    }

    // documentAPI.putDocumentDetail = function(params) {
    //     var id = params.id;
    //     return $http({
    //         method: 'PUT',
    //         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    //         url: verticalUrl.endpoint + id + '/',
    //         transformRequest: function(obj) {
    //             var str = [];
    //             for(var p in obj)
    //                 str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    //             return str.join("&");
    //         },
    //         data: params
    //     });
    // }

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

    documentAPI.postDocumentDetail = function(params) {
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: documentUrl.endpoint,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    }

    documentAPI.postDocumentRelationDetail = function(params) {
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: documentUrl.relationEndPoint,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    }

    documentAPI.deleteVersion = function(id) {
        return $http({
            method: 'DELETE',
            url: documentUrl.versionEndPoint + id + '/'
        });
    }

    return documentAPI;

});