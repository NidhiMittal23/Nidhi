var verticalService = angular.module('vertical.services', []);

verticalService.factory('verticalAPIservice', function($http) {

    var verticalAPI = {};

    var verticalUrl = {
        'endpoint': 'http://localhost:9000/vertical/'
    };

    verticalAPI.getVertical =function(params) {
        return $http({
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: verticalUrl.endpoint,
            params: params
        });
    };

    verticalAPI.getVerticalDetails = function(id) {
        return $http({
            method: 'GET', 
            url: verticalUrl.endpoint + id + '/'
        });
    };

    verticalAPI.postVerticalDetail = function(params) {
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: verticalUrl.endpoint,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    };

    verticalAPI.putVerticalDetail = function(params) {
        var id = params.id;
        return $http({
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: verticalUrl.endpoint + id + '/',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    };


    return verticalAPI;
});