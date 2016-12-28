var companyController = angular.module('company.controllers', ['ui-notification']);

companyController.controller('companyCtrl', function($state, $scope, companyAPIservice) {

    $scope.addNewCompany = function() {
        $state.go('addCompany', {});
    }

    $scope.editExistCompany = function(id, name) {
        $state.go('editCompany', {id: id, name: name});
    }

    companyAPIservice.getCompany().success(function (response, status) {
        $scope.companyList = response;
    }).error(function(response, status) {
        if (status == 400) {
            if ('name' in response) {
                Notification.error(response['name'][0]);
            }
        }
        else if (status == 500) {
            Notification.error("Server error occured, Contact Admin");
        }
        else {
            Notification.error("Error occured, contact Admin");
        }
    })
});

companyController.controller('companyAlterCtrl', function($scope, $state, $stateParams, $q, companyAPIservice,
    licenseAPIservice, verticalAPIservice) {
    $scope.companyModel = {};
    $scope.companySiteModel = {};
    
    if ($state.current.name == 'editCompany') {
        $scope.isEdit = true;
        var id = $stateParams.id
        
        // request to server to get detail of perticular company.
        companyAPIservice.getCompanyDetails(id).success(function (response, status) {
            //populate the input field with data.
            $scope.companyModel = response;
        })

    }
    else if ($state.current.name == 'addCompany') {
        $scope.isEdit = false;
    }

    $scope.init = function () {
        $scope.companySiteModel.selectedLicenseId = function(licenseId) {
            console.log(licenseId);
            $scope.companySiteModel.licenseSelected = licenseId;
        }

        $scope.companySiteModel.selectedVerticalId = function(verticalId) {
            console.log(verticalId);
            $scope.companySiteModel.verticalSelected = verticalId;
        }

        var licenses = licenseAPIservice.getlicense();
        var verticals = verticalAPIservice.getVertical();

        $q.all([verticals, licenses]).then(function(values) {
            $scope.companySiteModel.verticalOption = values[0].data.results;
            $scope.companySiteModel.licenseOption = values[1].data.results;
        });
    }

    // on submit button click
    $scope.addNewCompany = function() {
        var params = $scope.companyModel;
        // default industry has been to set to {'1': 'Food'}
        params.industry = "1";
        companyAPIservice.postCompanyDetail(params).success(function (response, status) {
            console.log(response);
            var companyName = params.name;
            // Notification.success(companyName+' added successfully');
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

    // todo: complete POST.. adding site info
    $scope.addNewCompanySite = function() {
        var params = $scope.companySiteModel;
        params.license = $scope.companySiteModel.licenseSelected;
        delete params.licenseSelected;
        params.vertical = $scope.companySiteModel.verticalSelected;
        delete params.verticalSelected;
        delete params.licenseOption;
        delete params.verticalOption;
        console.log(params);
        // companyAPIservice.postCompanyDetail(params).success(function (response, status) {
        //     console.log(response);
        //     var companyName = params.name;
        //     Notification.success(companyName+' added successfully');
        // }).error( function(response, status) {
        //     if (status == 400) {
        //         if ('name' in response) {
        //             Notification.error(response['name'][0]);
        //         }
        //     }
        //     else if (status == 500) {
        //         Notification.error("Server error occured, Contact Admin");
        //     }
        //     else {
        //         Notification.error("Error occured, Contact Admin");
        //     }
        // })
    }
});