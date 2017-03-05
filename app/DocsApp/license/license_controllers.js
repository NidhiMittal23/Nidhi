var licenseController = angular.module('license.controllers', ['ui-notification']);

licenseController.controller('licenseCtrl', function($state, $scope, licenseAPIservice, $log) {
    var params = {};
    $scope.licenseInitial = function () {
        // pagination control
        $scope.bigTotalItems=undefined;
        $scope.maxSize = 5;
        $scope.bigCurrentPage = 1;

        $scope.pageChanged();
    };
    

    $scope.addNewLicense = function() {
        $state.go('addLicense', {});
    };

    $scope.editExistLicense = function(id, name) {
        $state.go('editLicense', {id: id, name: name});
    };


    $scope.pageChanged = function() {
        // $log.log('Page changed to: ' + $scope.bigCurrentPage);
        params.page = $scope.bigCurrentPage;
        licenseAPIservice.getlicense(params).success(function (response, status) {
            $scope.licenseList = response;
            $scope.bigTotalItems = response.count;
        });
    };
});


licenseController.controller('licenseAlterCtrl', function($scope, $state, $stateParams, licenseAPIservice, Notification) {
    
    $scope.licenseModel = {};
    
    if ($state.current.name == 'editLicense') {
        $scope.isEdit = true;
        var id = $stateParams.id;
        
        // request to server to get detail of perticular license.
        licenseAPIservice.getLicenseDetails(id).success(function (response, status) {
            //populate the input field with data.
            $scope.licenseModel = response;
        });

    }
    else if ($state.current.name == 'addLicense') {
        $scope.isEdit = false;
    }

    var params = $scope.licenseModel;
    // on submit button click
    $scope.addNewLicense = function() {
        licenseAPIservice.postLicenseDetail(params).success(function (response, status) {
            var licenseName = response.name;
            Notification.success(licenseName+' added successfully');
        });
    };

    $scope.editExistLicense = function() {
        var newval = $scope.licenseModel;
        licenseAPIservice.putLicenseDetail(newval).success(function (response, status) {
            var licenseName = response.name;
            Notification.success(licenseName+' Edited successfully');
        });
    };

});