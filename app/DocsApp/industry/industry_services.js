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

    return industryAPI;
});