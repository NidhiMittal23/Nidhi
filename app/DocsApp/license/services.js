var licenseService = angular.module('license.services', []);

licenseService.factory('licenseAPIservice', function($http) {

    var licenseAPI = {};

    licenseAPI.getlicense = function() {
        return $http({
            method: 'GET', 
            url: 'http://localhost:9000/licences/'
        });
    }

    licenseAPI.getLicenseDetails = function(id) {
        return $http({
            method: 'JSONP', 
            url: 'http://ergast.com/api/f1/2013/drivers/'+ id +'/driverStandings.json?callback=JSON_CALLBACK'
        });
    }

    return licenseAPI;
});