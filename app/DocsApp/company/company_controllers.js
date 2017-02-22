var companyController = angular.module('company.controllers', ['ui-notification']);

companyController.controller('companyCtrl', function($state, $scope, companyAPIservice) {
    var params = {};
    $scope.companyInitial = function () {
        // pagination control
        $scope.bigTotalItems;
        $scope.maxSize = 5;
        $scope.bigCurrentPage = 1;

        $scope.pageChanged();
    }

    $scope.addNewCompany = function() {
        $state.go('addCompany', {});
    }

    $scope.gotoCompanySite = function(id, name) {
        $state.go('companySite', {id: id, name : name});
    }

    $scope.editExistCompany = function(id, name) {
        $state.go('editCompany', {id: id, name: name});
    }

    $scope.pageChanged = function() {
        params.page = $scope.bigCurrentPage;
        companyAPIservice.getCompany(params).success(function (response, status) {
            $scope.companyList = response;
            $scope.bigTotalItems = response.count;
        })
    }
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

    // $scope.initSite = function () {
    //     $scope.companySiteModel.licenseSelected = [];
    //     $scope.companySiteModel.verticalSelected = [];

    //     $scope.companySiteModel.selectedLicenseId = function(licenseId) {
    //         $scope.companySiteModel.licenseSelected = licenseId;
    //     }

    //     $scope.companySiteModel.selectedVerticalId = function(verticalId) {
    //         $scope.companySiteModel.verticalSelected = verticalId;
    //     }

    //     var licenses = licenseAPIservice.getlicense();
    //     var verticals = verticalAPIservice.getVertical();

    //     $q.all([verticals, licenses]).then(function(values) {
    //         $scope.companySiteModel.verticalOption = values[0].data.results;
    //         $scope.companySiteModel.licenseOption = values[1].data.results;
    //     });
    // }

    // on submit button click
    $scope.addNewCompany = function() {
        var params = $scope.companyModel;
        // default industry has been to set to {'1': 'Food'}
        console.log(params);
        companyAPIservice.postCompanyDetail(params).success(function (response, status) {
            $scope.siteCompany = response;
            var companyName = response.name;
            $scope.companyIdAdded = response.id;
            Notification.success(companyName+' added successfully');
            // $scope.companyIdAdded = 
        })
    }


    // $scope.addNewCompanySite = function() {
    //     var params = $scope.companySiteModel;
    //     params.siteCompanyId = $scope.siteCompany.id;
        
    //     companyAPIservice.postCompanySiteDetail(params).success(function (response, status) {
    //         var siteName = params.name;
    //         Notification.success(siteName+' added successfully');
    //     })
    // }
});

companyController.controller('companySiteCtrl', function($state, $stateParams, $scope, companyAPIservice) {

    var companyId = $stateParams.id

    $scope.addNewCompanySite = function() {
        $state.go('addCompanySite', {id: companyId});
    }

    $scope.gotoSiteDoc = function(id, name) {
        $state.go('siteDoc', {id: companyId, name : name});
    }

    $scope.editExistCompanySite = function(id, name) {
        $state.go('editCompanySite', {id: companyId, name: name});
    }

    companyAPIservice.getCompanySite(companyId).success(function (response, status) {
        $scope.companySiteList = response;
    })
});


companyController.controller('siteDocCtrl', function($state, $stateParams, $scope, companyAPIservice, licenseAPIservice, documentAPIservice) {

    var id = $stateParams.id

    $scope.editExistSiteDoc = function(id, name) {
        $state.go('editSiteDoc', {id: id, name: name});
    }

    $scope.resultArray = [];
    $scope.siteDocList = [];
    var params = $scope.siteDocModel;
    //getting site detail...
    companyAPIservice.getCompanySiteDetails(id).success(function (response, status) {
        

        //getting license and vertical from site for intersection...
        var licences=response.license;
        var verticals = response.vertical;


        //loop for taking all licences...
        _.each(licences, function(lic) {
            //getting license detail...to get relation...
            licenseAPIservice.getLicenseDetails(lic).success(function(response, status) {
                var relations=response.relations;

                //taking each relation associated with license
                _.each(relations, function(rel) {
                    companyAPIservice.getRelationDetails(rel).success(function(response, status) {
                        var relVerId = response.vertical.id;

                        //intersecting site:vertical with relation:vertical
                        _.each(verticals, function(vert) {
                            if(vert == relVerId){

                                //avoiding duplicate document entry in the List
                                if($scope.resultArray.indexOf(response.subcategory.document) === -1) {

                                    $scope.resultArray.push(response.subcategory.document);

                                    documentAPIservice.getDocumentDetails(response.subcategory.document).success(function(response, status){
                                        $scope.siteDocList.push({name :response.name, id : response.id, versions : response.versions });
                                    })
                                }
                            }
                        });
                        
                    })
                });
            })
        });
        
    })
});

companyController.controller('siteCtrl', function($state, $stateParams, $scope, companyAPIservice,
    licenseAPIservice, verticalAPIservice, $q) {
    $scope.companySiteModel = {};

    if ($state.current.name == 'addCompanySite') {
        $scope.companySiteModel.companyId = $stateParams.id;
    }

    $scope.initSite = function () {
        $scope.companySiteModel.licenseSelected = [];
        $scope.companySiteModel.verticalSelected = [];
        $scope.companySiteModel.companyEmployeesSelected = [];
        var companyId = $scope.companySiteModel.companyId;

        $scope.companySiteModel.selectedLicenseId = function(licenseId) {
            $scope.companySiteModel.licenseSelected = licenseId;
        }

        $scope.companySiteModel.selectedVerticalId = function(verticalId) {
            $scope.companySiteModel.verticalSelected = verticalId;
        }

        $scope.companySiteModel.selectedcompanyEmployeesId = function(employeeId) {
            $scope.companySiteModel.companyEmployeesSelected = employeeId;
        }


        var licenses = licenseAPIservice.getlicense();
        var verticals = verticalAPIservice.getVertical();
        // companyEmployees means probable candidate for company
        var companyEmployees = companyAPIservice.getUserWithNoCompany();

        $q.all([verticals, licenses, companyEmployees]).then(function(values) {
            $scope.companySiteModel.verticalOption = values[0].data.results;
            $scope.companySiteModel.licenseOption = values[1].data.results;
            $scope.companySiteModel.companyEmployeesOption = values[2].data.results;
            // TODO: think about user with multiple site access..
        });
    }

    $scope.addNewCompanySite = function() {
        var params = {}
        params.name = $scope.companySiteModel.name;
        params.location = $scope.companySiteModel.location;
        params.employee = // ask for user to input from pertical drop dwon
        params.company = $scope.companySiteModel.companyId;
        params.license = $scope.companySiteModel.licenseSelected;
        params.vertical = $scope.companySiteModel.verticalSelected;

        // params.siteCompanyId = $scope.siteCompany.id;
        console.log(params);
        // companyAPIservice.postCompanySiteDetail(params).success(function (response, status) {
        //     var siteName = params.name;
        //     Notification.success(siteName+' added successfully');
        // })
    }
})
