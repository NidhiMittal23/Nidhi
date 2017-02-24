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

companyController.controller('userCtrl', function($state, $stateParams, $scope, companyAPIservice) {

    $scope.userList = {};
    $scope.siteList = {};
    $scope.selectSite = {};
    var companyId = $stateParams.id;


    companyAPIservice.getCompanyDetails(companyId).success(function(response, status) {
        $scope.siteList = response.sites;
    })

    companyAPIservice.getCompanyUsers(companyId).success(function(response, status) {
        var users = response.results[0];
        for (k in users){
            $scope.userList = users[k];
        }
        console.log($scope.userList);
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

companyController.controller('companySiteCtrl', function($state, $stateParams, $scope, companyAPIservice) {

    var id = $stateParams.id

    $scope.addNewCompanySite = function() {
        $state.go('addCompanySite', {companyId: id});
    }

    $scope.gotoSiteDoc = function(id, name) {
        $state.go('siteDoc', {id: id, name : name});
    }

    $scope.editExistCompanySite = function(id, name) {
        $state.go('editCompanySite', {id: id, name: name});
    }

    companyAPIservice.getCompanySite(id).success(function (response, status) {
        $scope.companySiteList = response;
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

