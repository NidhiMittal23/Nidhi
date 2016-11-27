var licenseController = angular.module('license.controllers', ['ui-notification']);

licenseController.controller('licenseCtrl', function($scope, licenseAPIservice) {

    licenseAPIservice.getlicense().success(function (response, status) {
        $scope.licenseList = response;
    }).error( function(response, status) {
        if (status == 400) {
            if ('name' in response) {
                Notification.error(response['name'][0]);
            }
        }
        else if (status == 500) {
            Notification.error("Server error occured, Contact Admin");
        }
        else {
            Notification.error("Error occured, Contact Admin");
        }
    })
});


licenseController.controller('licenseAlterCtrl', function($scope, $stateParams, licenseAPIservice, Notification) {
    $scope.licenseModel = {};

    var params = $scope.licenseModel;

    $scope.addNewLicense = function() {
        licenseAPIservice.postLicenseDetail(params).success(function (response, status) {
            var licenseName = params.name;
            Notification.success(licenseName+' added successfully');
        }).error( function(response, status) {
            if (status == 400) {
                if ('name' in response) {
                    Notification.error(response['name'][0]);
                }
            }
            else if (status == 500) {
                Notification.error("Server error occured, Contact Admin");
            }
            else {
                Notification.error("Error occured, Contact Admin");
            }
        })
    }
})