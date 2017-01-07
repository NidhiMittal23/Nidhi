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

companyController.controller('companyAlterCtrl', function($scope, $state, $stateParams, $q, Notification, companyAPIservice, industryAPIservice,
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

    $scope.initCompany = function () {
        $scope.companyModel.industrySelected = [];
        $scope.companyModel.selectedIndustryId = function(industryId) {
            $scope.companyModel.industrySelected = industryId;
        }

        industryAPIservice.getIndustry().success(function(response){
            $scope.companyModel.industryOption = response.results;
        });
    }

    $scope.initSite = function () {
        $scope.companySiteModel.licenseSelected = [];
        $scope.companySiteModel.verticalSelected = [];

        $scope.companySiteModel.selectedLicenseId = function(licenseId) {
            $scope.companySiteModel.licenseSelected = licenseId;
        }

        $scope.companySiteModel.selectedVerticalId = function(verticalId) {
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

        companyAPIservice.postCompanyDetail(params).success(function (response, status) {
            $scope.siteCompany = response;
            var companyName = params.name;
            Notification.success(companyName+' added successfully');
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


    $scope.addNewCompanySite = function() {
        var params = $scope.companySiteModel;
        params.siteCompanyId = $scope.siteCompany.id;
        
        companyAPIservice.postCompanySiteDetail(params).success(function (response, status) {
            var siteName = params.name;
            Notification.success(siteName+' added successfully');
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
});