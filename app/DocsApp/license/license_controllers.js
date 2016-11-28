var licenseController = angular.module('license.controllers', ['ui-notification']);

licenseController.controller('licenseCtrl', function($state, $scope, licenseAPIservice) {

    $scope.addNewLicense = function() {
        $state.go('addLicense', {});
    }

    $scope.editExistLicense = function(id, name) {
        $state.go('editLicense', {id: id, name: name});
    }

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


licenseController.controller('licenseAlterCtrl', function($scope, $state, $stateParams, licenseAPIservice, Notification) {
    
    $scope.licenseModel = {};
    
    if ($state.current.name == 'editLicense') {
        $scope.isEdit = true;
        var id = $stateParams.id
        
        // request to server to get detail of perticular license.
        licenseAPIservice.getLicenseDetails(id).success(function (response, status) {
            //populate the input field with data.
            $scope.licenseModel = response;
        })

    }
    else if ($state.current.name == 'addLicense') {
        $scope.isEdit = false;
    }

    var params = $scope.licenseModel;
    // on submit button click
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