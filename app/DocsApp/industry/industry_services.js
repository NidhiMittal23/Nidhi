var industryService = angular.module('industry.services', []);

industryService.factory('industryAPIservice', function($http) {
    
    var industryAPI = {};

    var industryUrl = {
        'endpoint': 'http://localhost:9000/industry/'
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
            url: industryUrl.endpoint + id + '/'
        });
    }

    industryAPI.postIndustryDetail = function(params) {
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: industryUrl.endpoint,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    }


    industryAPI.putIndustryDetail = function(id,params) {
        return $http({
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: industryUrl.endpoint + id + '/',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { id: id, name: params.name }
        });
    }

    return industryAPI;
});