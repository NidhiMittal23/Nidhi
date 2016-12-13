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

    verticalAPI.getVerticalDetails = function(id) {
        return $http({
            method: 'GET', 
            url: verticalUrl.endpoint + id
        });
    }

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
    }

    verticalAPI.putVerticalDetail = function(id,params) {
        console.log(id + "=" + params.name);
        return $http({
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: verticalUrl.endpoint,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { id: id, name: params.name }
        });
    }


    return verticalAPI;
});