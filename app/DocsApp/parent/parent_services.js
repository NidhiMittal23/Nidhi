var parentService = angular.module('parent.services', []);

parentService.factory('parentAPIService', function($http) {

    var parentAPIService = function() {
        this.apiUrl = null;
        this.params = null;
        this.response = null;
    };

    parentAPIService.prototype.get = function() {
        // pagination
        // if there are any callbcks; this and self will make difference then.
        var self = this;
        var params = self.params;
        var apiUrl = self.apiUrl;
        if (params.hasOwnProperty('id')) {
            apiUrl = apiUrl + params.id + "/";
        }
        return $http.get(apiUrl, params=params).then(function(response) {
            self.response = response.data;
            return response;
        });
    };

    parentAPIService.prototype.delete = function() {
        var self = this;
        var params = self.params;
        var apiUrl = self.apiUrl;
        var id = params.id;
        return $http({
            method: 'DELETE',
            url: apiUrl + id + '/'
        }).then(function(response) {
            console.log(response);
            return response
        });
    };

    parentAPIService.prototype.put = function() {
        var self = this;
        // write function in service of component say license; to set params;
        // Make list of valid params that will be used for add/edit;
        // params can be form() or payload
        var params = self.params;
        var apiUrl = self.apiUrl;
        var id = params.id;
        return $http({
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: apiUrl + id + '/',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        }).then(function (response) {
            // set this.response here
            console.log(response);
            return response;
        });
    };

    parentAPIService.prototype.post = function() {
        var self = this;
        // params can be a form data or a dictionary
        var params = self.params;
        var apiUrl = self.apiUrl;
        var id = params.id;
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: apiUrl,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        }).then(function (response) {
            // set this.response here
            self.response = response.data;
            return response;
        });
    };

    return parentAPIService;
});