var documentService = angular.module('document.services', []);

documentService.factory('documentAPIservice', function($http, Notification, config) {

    var documentAPI = {};
    var documentUrl = {
        'endpoint': config.apiUrl + 'document/',
        'relationEndPoint': config.apiUrl + 'relation/',
        'versionEndPoint': config.apiUrl + 'version/',
    }

    documentAPI.serverDomain = (config.apiUrl).slice(0, -1);

    documentAPI.getDocument =function() {
        return $http({
            method: 'GET',
            url: documentUrl.endpoint
        });
    };

    documentAPI.getDocumentPage =function(url) {
        return $http({
            method: 'GET',
            url: url
        });
    };

    documentAPI.getDocumentDetails =function(id) {
        return $http({
            method: 'GET',
            url: documentUrl.endpoint+ id + '/'
        });
    };

    documentAPI.getDocumentDetail = function (id) {
        return $http({
            method: 'GET',
            url: documentUrl.endpoint + id + "/"
        });
    };

    documentAPI.getDocVersion =function(id) {
        return $http({
            method: 'GET',
            url: documentUrl.endpoint + id + '/'
        });
    };

    documentAPI.setRelation = function(params) {
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: documentUrl.relationEndPoint + 'null' + '/set_relation/',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    };

    documentAPI.getRelationDetail = function(id) {
        return $http({
            method: 'GET',
            url: documentUrl.relationEndPoint + id + '/'
        });
    };


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
        });
    };

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
    };

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
    };

    documentAPI.deleteVersion = function(id) {
        return $http({
            method: 'DELETE',
            url: documentUrl.versionEndPoint + id + '/'
        });
    };

    documentAPI.resetVersion = function(id) {
        return $http({
            method: 'POST',
            url: documentUrl.versionEndPoint + id + '/version_reset/'
        });
    };

    documentAPI.deleteRelation = function(id) {
        return $http({
            method: 'DELETE',
            url: documentUrl.relationEndPoint + id + '/'
        });
    };

    documentAPI.putDocumentDetail = function(params) {
        return $http({
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: documentUrl.endpoint + params.id + '/',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    };

    documentAPI.getFileSource = function(url) {
        return $http({
            method: 'GET',
            url: url
        });
    };

    return documentAPI;

});