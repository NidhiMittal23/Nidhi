var licenseController = angular.module('license.controllers', []);

licenseController.controller('licenseCtrl', function($scope, licenseAPIservice) {
    licenseAPIservice.getlicense().success(function (response) {
        $scope.licenseList = response;
    });
});


licenseController.controller('licenseAlterCtrl', function($scope, $stateParams) {
	console.log("dfjkjb"); 
})