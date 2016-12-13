var licenseService = angular.module('license.services', []);

licenseService.factory('licenseAPIservice', function($http) {

    var licenseAPI = {};

    //endpoints corresponding to license
    var licenseUrl = {
        'endpoint': 'http://localhost:9000/license/'
    }

    licenseAPI.getlicense = function() {
        return $http({
            method: 'GET', 
            url: licenseUrl.endpoint
        });
    }

    licenseAPI.getLicenseDetails = function(id) {
        return $http({
            method: 'GET', 
            url: licenseUrl.endpoint + id
        });
    }

    licenseAPI.postLicenseDetail = function(params) {
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: licenseUrl.endpoint,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    }

    return licenseAPI;
});