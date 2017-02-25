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

companyController.controller('userCtrl', function($state, $stateParams, $scope, companyAPIservice, _) {
    if ($state.current.name == 'users') {
        $scope.user = {};
        $scope.site = {};
        $scope.selectedUser = {};

        $scope.user.userList = [];
        $scope.site.siteList = [];
        $scope.site.siteChosen;
        $scope.site.checkUserSite = function(siteObj, user) {
            var userSiteObjList = user.sites;
            var userSiteIdList = _.map(userSiteObjList, function(obj) { return obj.id})
            if (_.contains(userSiteIdList, siteObj.id)) {
                $scope.selectedUser.role = user.is_lead;
                if (user.is_lead) {
                    $scope.selectedUser.roleOption = ["Member", "None"];
                }
                else{
                    $scope.selectedUser.roleOption = ["Lead", "None"];
                }
            }
            else{
                $scope.selectedUser.role = undefined;
                $scope.selectedUser.roleOption = ["Member", "Lead", "None"];
            }
        }

        $scope.selectedUser.changeUserRole = function(newRole) {
            console.log("call server to change role");
        }

        var companyId = $stateParams.id;

        companyAPIservice.getCompanyDetails(companyId).success(function(response, status) {
            $scope.site.siteList = response.sites;
            console.log(response);
        })

        companyAPIservice.getCompanyUsers(companyId).success(function(response, status) {
            $scope.user.userList = response.results;
            console.log(response);
            // var users = response.results[0];
            // for (k in users){
            //     $scope.userList = users[k];
            // }
            // console.log($scope.userList);
        })
    }
});

companyController.controller('companyAlterCtrl', function($scope, $state, $stateParams, $q, Notification, companyAPIservice, industryAPIservice,
    licenseAPIservice, verticalAPIservice, $filter) {
    $scope.companyModel = {};
    $scope.companySiteModel = {};
    $scope.companyModel.phone_number;
    $scope.companyModel.email;
    $scope.companyModel.isActive;
    $scope.companyModel.paymentDate;
    $scope.companyModel.citySelected = "";
    $scope.companyModel.logo;
    $scope.companyModel.citylist = [
        "Agra", "Ahmedabad", "Alappuzha", "Alwar", "Amritsar", "Aurangabad",
        "Bangalore", "Bharatpur", "Bhavnagar", "Bhikaner", "Bhopal", "Bhubaneshwar",
        "Bodh Gaya", "Calangute", "Chandigarh", "Chennai", "Chittaurgarh", "Coimbatore",
        "Cuttack", "Dalhousie", "Dehradun", "Delhi", "Diu-Island", "Ernakulam", "Faridabad", "Gaya",
        "Gangtok", "Ghaziabad", "Gurgaon", "Guwahati", "Gwalior", "Haridwar", "Hyderabad",
        "Imphal", "Indore", "Jabalpur", "Jaipur", "Jaisalmer", "Jalandhar", "Jamshedpur",
        "Jodhpur", "Junagadh", "Kanpur", "Kanyakumari", "Khajuraho", "Khandala", "Kochi",
        "Kodaikanal", "Kolkata", "Kota", "Kottayam", "Kovalam", "Lucknow", "Ludhiana", "Madurai",
        "Manali", "Mangalore", "Margao", "Mathura", "Mountabu", "Mumbai", "Mussoorie", "Mysore",
        "Nagpur", "Nainital", "Noida", "Ooty", "Orchha", "Panaji", "Patna", "Pondicherry",
        "Porbandar", "Portblair", "Pune", "Puri", "Pushkar", "Rajkot", "Rameswaram", "Ranchi", "Sanchi",
        "Secunderabad", "Shimla", "Surat", "Thanjavur", "Thiruchchirapalli", "Thrissur", "Tirumala",
        "Udaipur", "Vadodra", "Varanasi", "Vasco-Da-Gama", "Vijayawada", "Visakhapatnam"
    ];

    $scope.onTimeSet = function (newDate, oldDate) {
        $scope.companyModel.paymentDate = $filter('date')(newDate, "yyyy-MM-ddThh:mm");
    }

    $scope.getCountryStates = function() {
    }
    
    
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
    licenseAPIservice, verticalAPIservice, $q, Notification) {
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
        companyAPIservice.postCompanySiteDetail($scope.companySiteModel).success(function (response, status) {
            var siteName = response.name;
            Notification.success(siteName+' added successfully');
        })
    }
})
