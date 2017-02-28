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

companyController.controller('userCtrl', function($state, $stateParams, $scope, companyAPIservice, _,
    Notification) {
    // Enhance: There should be a intial definition function w.r.t to state.
    // So, when state are called across, we have intial definition defined
    // eg. initial_variables = function () {} ... initial_call - function () {}
    // function_visible_to_view = function () {}

    if ($state.current.name == 'users') {
        var companyId = $stateParams.id;

        $scope.user = {};
        $scope.site = {};

        // In order to make selections w.r.t user
        // Dynamically Store user information $scope.selectedUser['abc@gmail.com'] like info
        // Help in selecting role options specific to "abc@gmail.com" 
        $scope.selectedUser = {};
        $scope.selectedUser.role = {};
        $scope.selectedUser.newRole = {};
        $scope.selectedUser.roleOption = {};

        $scope.user.userList = [];
        $scope.site.siteList = [];
        $scope.site.siteChosen = {};


        $scope.site.checkUserSite = function(siteObj, user) {
            var userSiteObjList = user.sites;
            var userSiteIdList = _.map(userSiteObjList, function(obj) { return obj.id})
            if (_.contains(userSiteIdList, siteObj.id)) {
                $scope.selectedUser.role[user.email] = user.is_lead;
                if (user.is_lead) {
                    $scope.selectedUser.roleOption[user.email] = ["Member", "None"];
                }
                else{
                    $scope.selectedUser.roleOption[user.email] = ["Lead", "None"];
                }
            }
            else{
                $scope.selectedUser.role[user.email] = undefined;
                $scope.selectedUser.roleOption[user.email] = ["Member", "Lead", "None"];
            }
        }

        $scope.selectedUser.changeUserRole = function(newRole, siteChosen, user) {
            var params = {
                'role': newRole,
                'site': siteChosen.id,
                'email': user.email
            }
            companyAPIservice.transferSiteEmployee(params).success(function(response, status) {
                Notification.success(response.message);
                $state.go('users', {id: companyId});
            })
        }

        companyAPIservice.getCompanyDetails(companyId).success(function(response, status) {
            $scope.site.siteList = response.sites;
            console.log(response);
        })

        companyAPIservice.getCompanyUsers(companyId).success(function(response, status) {
            $scope.user.userList = response.results;
            console.log(response);
        })

        // New Employee can be added to a company
        $scope.addNewCompanyEmployee = function() {
            console.log('addUser');
            console.log(companyId);
        }
    }
});

companyController.controller('companyAlterCtrl', function($scope, $state, $stateParams, $q, Notification,
    companyAPIservice, industryAPIservice, licenseAPIservice, verticalAPIservice, $filter) {
    $scope.companyModel = {};
    $scope.companyModelOptions = {};
    $scope.companySiteModel = {};
    $scope.companyModel.phone_number;
    $scope.companyModel.email;
    $scope.companyModel.isActive;
    $scope.companyModel.paymentDate;
    $scope.companyModel.citySelected = "";
    $scope.companyModel.logo;
    $scope.companyModel.industrySelected = [];

    if ($state.current.name == 'editCompany') {
        $scope.isEdit = true;
        var id = $stateParams.id
        
        // request to server to get detail of perticular company.
        companyAPIservice.getCompanyDetails(id).success(function (response, status) {
            //populate the input field with data.
            $scope.companyModel.name = response.name;
            $scope.companyModel.citySelected = response.city;
            $scope.companyModel.isActive = response.is_active;
            $scope.companyModel.phone_number = response.phone_number.substr(3, 10);
            $scope.companyModel.email = response.email;
            $scope.companyModel.paymentDate = response.payment_date;
            _.each(response.industry, function(industry) {
                $scope.companyModel.industrySelected.push(String(industry));
            });
        })

    }
    else if ($state.current.name == 'addCompany') {
        $scope.isEdit = false;
    }

    $scope.companyModel.citylist = companyAPIservice.citylist;

    $scope.onTimeSet = function (newDate, oldDate) {
        $scope.companyModel.paymentDate = $filter('date')(newDate, "yyyy-MM-ddThh:mm");
    }

    $scope.getCountryStates = function() {
    }
    
    
    

    $scope.initCompany = function () {
        $scope.companyModel.selectedIndustryId = function(industryId) {
            $scope.companyModel.industrySelected = industryId;
        }

        industryAPIservice.getIndustry().success(function(response){
            $scope.companyModelOptions.industryOption = response.results;
        });
    }

    // on submit button click
    $scope.addNewCompany = function() {
        var params = $scope.companyModel;
        // default industry has been to set to {'1': 'Food'}
        companyAPIservice.postCompanyDetail(params).success(function (response, status) {
            $scope.siteCompany = response;
            var companyName = response.name;
            $scope.companyIdAdded = response.id;
            Notification.success(companyName+' added successfully');
        })
    }

    $scope.editExistCompany = function() {
        var params = $scope.companyModel;
        params.id = $stateParams.id;
        companyAPIservice.putCompanyDetail(params).success(function(response, status) {
            Notification.success(response.name+ ' saved')
        })
    }

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

    $scope.checkCompanyUser = function() {
        $state.go('users', {id: companyId});
    }   

    companyAPIservice.getCompanySite(companyId).success(function (response, status) {
        $scope.companySiteList = response;
    })
});


companyController.controller('siteCtrl', function($state, $stateParams, $scope, companyAPIservice,
    licenseAPIservice, verticalAPIservice, $q, Notification) {
    $scope.companySiteModel = {};
    $scope.companySiteModel.citylist = companyAPIservice.citylist;

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

    $scope.constructSiteDocument = function(siteId, siteName) {
        companyAPIservice.constructSiteDocument(siteId).success(function (response, status) {
            Notification.success(siteName+ 'document Created');
            $state.go('home');
        })
    }

    $scope.addNewCompanySite = function() {
        var params = $scope.companySiteModel;
        companyAPIservice.postCompanySiteDetail(params).success(function (response, status) {
            var siteName = response.name;
            var siteId = response.id;
            Notification.success(siteName+' added successfully');
            $scope.constructSiteDocument(siteId, siteName);
        })
    }
})

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
