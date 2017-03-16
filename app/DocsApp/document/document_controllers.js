var documentController = angular.module('document.controllers', ['ui-notification']);

documentController.controller('documentCtrl', function($state, $window ,$scope, documentAPIservice,
    _, categoryAPIservice, companyAPIservice, Notification, $http, $stateParams) {
    $scope.serverDomain = documentAPIservice.serverDomain;
    $scope.isEmployeeLead = localStorage.getItem('isLead') === 'true';

    $scope.addNewDocument = function() {
        $state.go('addDocument', {});
    };

    $scope.gotoDocVersion = function(id, name) {
        $state.go('docVersion', {id: id, name : name});
    };

    $scope.editExistDocument = function(id, name) {
        $state.go('editDocument', {id: id, name: name});
    };

    $scope.versionDelete = function(id) {
        documentAPIservice.deleteVersion(id).success(function(response) {
            // add notification message #todo
            // hint add callback
            $scope.reloadRoute();
        });
    };

    $scope.versionReset = function(id) {
        documentAPIservice.resetVersion(id).success(function(response) {
            // add notification message #todo
            // hint add callback
            $scope.reloadRoute();
        });
    };


    $scope.versionFileView = function(docfileUrl) {
        // Its a hackey way to view file as file recieved as embedded textarea (used by tinymce)
        // Just remove textarea with div and it works to view the page without any editor
        documentAPIservice.getFileSource(docfileUrl).success(function(response) {
            response = response.replace("textarea", "div");
            var wnd = window.open("about:blank", "", "_blank");
            if (wnd) {
                //Browser has allowed it to be opened
                wnd.focus();
            } else {
                //Browser has blocked it
                alert('Please allow popups for this website');
            }
            wnd.document.write(response);
        });
    };

    $scope.versionFileEdit = function(docfileUrl) {
        var win = window.open(docfileUrl, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }
    };

    $scope.reloadRoute = function() {
        $window.location.reload();
    };

    $scope.getDocumentByPage = function(link) {
        documentAPIservice.getDocumentPage(link).success(function (response, status) {
        $scope.documentList = response;

        // some subcategories may be null
        $scope.groupByCategory = _.groupBy(response.results, function(obj) {
            if (obj.subcategories == null) {
                return obj.subcategories;
            }
            else {
                return obj.subcategories.category;
            }

        });
        //console.log($scope.groupByCategory);
    });

    };

    categoryAPIservice.getcategory().success(function(response,status) {
        $scope.categoryName = [];
        $scope.categoryName["null"] = "uncategorized";

        _.each(response.results,function(obj) {
            $scope.categoryName[obj.id]= obj.name;
        });
        //console.log($scope.categoryName);
    });

    if ($state.current.name == "siteDocument") {
        userSite = $stateParams.siteId;
        companyAPIservice.getSiteDocuments(userSite)
        .then(function(response) {
            var siteDocuments = response.data
            // todo: build site TOC
            // embed server domain Name to docfile if not present
            $scope.groupByCategory = _.groupBy(siteDocuments.results, function(obj){
                if (obj.subcategory == null) {
                    return obj.subcategory;
                }
                else {
                    return obj.subcategory.category;
                }
            });
        });
    }
    else {
        documentAPIservice.getDocument().success(function (response, status) {
            $scope.documentList = response;
            $scope.groupByCategory = _.groupBy(response.results, function(obj) {
                if (obj.subcategory == null) {
                    return obj.subcategory;
                }
                else {
                    return obj.subcategory.category;
                }

            });
        });
    }

});


documentController.controller('docVersionCtrl', function($state, $stateParams, $scope, Notification, documentAPIservice) {

    var id = $stateParams.id;

    $scope.addNewDocVersion = function() {
        $state.go('addDocVersion', {docId: id});
    };

    $scope.editExistDocVersion = function(id, name) {
        $state.go('editDocVersion', {id: id, name: name});
    };

    documentAPIservice.getDocVersion(id).success(function (response, status) {
        $scope.docVersionList = response;
    });
});


documentController.controller('docVersionAlterCtrl', function($scope, $state, $stateParams,
    documentAPIservice, Notification, config /*, Upload */) {

    $scope.docVersionModel = {};

    var params = $scope.docVersionModel;
    var docid = $stateParams.docId;
    params.document = docid;

    // have to move this login to service
    $scope.addNewDocVersion = function(){
        var uploadUrl = config.apiUrl + 'version/';
        documentAPIservice.postDocVersionDetail(uploadUrl, $scope.docVersionModel)
    };
});


documentController.controller('documentAlterCtrl', function($state, $stateParams, $scope,
        documentAPIservice, verticalAPIservice, licenseAPIservice, categoryAPIservice, $q,
        Notification, $timeout, config) {
    $scope.documentModel = {};
    $scope.documentRelationModel = {};
    $scope.documentSubCategoryModel = {};
    $scope.documentVersionModel = {};

    $scope.buttonHide = false ;
    $scope.noSubCategory = false;

    $scope.initMile = function() {
        $scope.docMile = false;
        $scope.verMile = false;
        $scope.catMile = false;
        $scope.relMile = false;

    };

    $scope.init = function() {
        var params = {};
        params.page = 1;
        // TODO: have to configure way to should to data in dropdown
        // Or choose any different UX
        var categories = categoryAPIservice.getcategory(params);
        var verticals = verticalAPIservice.getVertical(params);
        var licenses = licenseAPIservice.getlicense(params);

        $q.all([verticals, licenses, categories]).then(function(values) {
            $scope.documentRelationModel.verticalOption = values[0].data.results;
            $scope.documentRelationModel.licenseOption = values[1].data.results;
            $scope.documentSubCategoryModel.categoryOption = values[2].data.results;

        });

        $scope.documentRelationModel.selectedLicenseId = function(licenseId) {
            $scope.documentRelationModel.licenseSelected = licenseId;
        };

        $scope.documentRelationModel.selectedVerticalId = function(verticalId) {
            $scope.documentRelationModel.verticalSelected = verticalId;
        };

    };

    if ($state.current.name == 'editDocument') {
        $scope.isEdit = true;
        var docId = $stateParams.id;
        var docName = $stateParams.name;
        $scope.documentRelationModel.licenseSelected = [];
        $scope.documentRelationModel.verticalSelected = [];

        // request to server to get detail of perticular vertical.
        documentAPIservice.getDocumentDetail(docId).success(function (response, status) {
            //populate the input field with data.
            $scope.documentModel = response;
            
            if (response.subcategory !== null) {
                $scope.documentRelationModel.subcategoryAddedId = response.subcategory.id;
                $scope.documentSubCategoryModel.name = response.subcategory.name;
                var categoryId = response.subcategory.category;
                categoryAPIservice.getCategoryDetails(categoryId).success(function (response, status) {

                    //selected Category object
                    $scope.documentSubCategoryModel.categorySelected = response;
                    $scope.documentSubCategoryModel.categoryNameSelected = response.name; 
                });


                //populate edit relation fields with data

                var licId = [];// separate array to store only id as checking duplicate object was difficult
                var verId = [];
                var relLicense = [];// $scope.documentRelationModel.licenseSelected is not defined so creating separate array to store objects
                var relVertical = [];

                $scope.relExisting = response.subcategory.relations;
                // console.log($scope.relExisting);

                // get licId and verId after 1 sec..
                // or create documentRelationModel.licenseSelected after 1 sec
                $timeout(function () {
                    _.each($scope.relExisting, function(id) {
                        documentAPIservice.getRelationDetail(id).success(function (response, status) {
                            if(licId.indexOf(response.license.id) === -1) {
                                licId.push(response.license.id);
                                // relLicense.push(response.license);
                                $scope.documentRelationModel.licenseSelected.push(response.license);
                            }

                            if(verId.indexOf(response.vertical.id) === -1) {
                                verId.push(response.vertical.id);
                                // relVertical.push(response.vertical);
                                $scope.documentRelationModel.verticalSelected.push(response.vertical);
                            }
                            
                        });
                    });
                }, 1000);
                // $scope.documentRelationModel.licenseSelected = relLicense;
                // $scope.documentRelationModel.verticalSelected = relVertical;
            }
            else{
                $scope.noSubCategory = true;
                $scope.documentModel.newDocumentId = docId;
            }
        });

    }
    else if ($state.current.name == 'addDocument') {
        $scope.isEdit = false;
    }


    // Add new Document  
    $scope.addNewDocument = function() {
        var params = $scope.documentModel;
        params.subcategory_id = $scope.documentRelationModel.subcategoryAddedId;
        params.owner = localStorage.getItem("userId");
        params.site = localStorage.getItem("sites");

        documentAPIservice.postDocumentDetail(params).success(function (response, status) {
            var documentName = response.name;
            $scope.documentModel.newDocumentId = response.id;
            Notification.success(documentName+' added successfully');
            $scope.docMile = true;
            // todo
            // Add version: Upload file

        });
    };

    $scope.addNewDocumentVersion = function(){

        var params = $scope.documentVersionModel;
        var docid = $scope.documentModel.newDocumentId;
        params.document = docid;
        var uploadUrl = config.apiUrl + 'version/';
        documentAPIservice.postDocVersionDetail(uploadUrl, $scope.documentVersionModel);
        $scope.verMile = true;
    };

    $scope.editExistDocument = function() {
        // TODO: update Exist Document not working
        Notification.error("Edit document Name; Feature coming soon");
        // var params = {};
        // params.site = $scope.documentModel.site;
        // params.subcategory_id = $scope.documentRelationModel.subcategoryAddedId;
        // params.name = $scope.documentModel.name;
        // params.id = $scope.documentModel.id;
        // documentAPIservice.putDocumentDetail(params).success(function (response, status) {
        //     Notification.success(params.name + ' updated successfully');
        // })
    };

    $scope.deleteExistDocument = function() {
        var params = {};
        params.id = $scope.documentModel.id;
        documentAPIservice.deleteDocumentDetail(params).success(function (response, status) {
            Notification.success('Deleted successfully');
            $state.go('document');
        })
    }

    // Associate Subcategory to newly Created Document
    $scope.addDocumentSubCategory = function() {
        var params = $scope.documentSubCategoryModel;
        params.category = $scope.documentSubCategoryModel.categorySelected.id;
        categoryAPIservice.postSubCategoryDetail(params).success(function (response, status) {
            $scope.documentRelationModel.subcategoryAddedId = response.id;
            var subCategoryName = response.name;
            Notification.success(subCategoryName+' added successfully');
            $scope.catMile = true;
            $scope.noSubCategory = false ;
        });
    };

    $scope.editDocumentSubCategory = function() {
        // debugger;
        var params = $scope.documentSubCategoryModel;
        var subCatId = $scope.documentRelationModel.subcategoryAddedId;
        // params.document = $scope.documentModel.id;
        params.category = $scope.documentSubCategoryModel.categorySelected.id;
        categoryAPIservice.putSubCategoryDetail(params, subCatId).success(function (response, status) {
            Notification.success(params.name + ' updated successfully');
        });
    };


    $scope.buildDocumentRelation = function() {
        var verticalSelectedList = $scope.documentRelationModel.verticalSelected;
        var licenseSelectedList = $scope.documentRelationModel.licenseSelected;
        var subCatId = $scope.documentRelationModel.subcategoryAddedId;
        var licenseList = _.map(licenseSelectedList, function(licenseObj) {
            return licenseObj.id
        });
        var verticalList = _.map(verticalSelectedList, function(verticalObj) {
            return verticalObj.id
        });
        var licenseStr = licenseList.toString();
        var verticalStr = verticalList.toString();
        var params = {
            license: licenseStr,
            vertical: verticalStr,
            subcategory: subCatId
        };

        documentAPIservice.setRelation(params).success(function (response, status) {
            Notification.success('Relationship Established');
            $scope.relMile = true;
        });
    };

    $scope.editBuildDocumentRelation = function() {
        // TODO: send request to server to delete provided sub category from (license, vertical) tuple
        Notification.error("Edit Relations; Feature coming soon");
        // var promiseList = [];
        // var deleteList = [];

        // _.each($scope.relExisting, function(id) {
        //     deleteList.push(documentAPIservice.deleteRelation(id));
        // })

        // console.log($scope.relExisting);

        // $q.all(deleteList).then(function(values) {
        //     Notification.error('deleted old relations');
        //     deleteList.length = 0;
        //     //console.log(deleteList);


        //     _.each($scope.documentRelationModel.licenseSelected, function(licenseObj) {
        //         _.each($scope.documentRelationModel.verticalSelected, function(verticalObj) {
        //             var params = {
        //                 vertical_id : verticalObj.id,
        //                 license_id : licenseObj.id,
        //                 subcategory_id : $scope.documentRelationModel.subcategoryAddedId,
        //             };
        //             documentAPIservice.postDocumentRelationDetail(params).success(function(response){
        //                 //console.log(response);
        //             });
        //         })
        //     })

        // }).then(function(values){
        //     Notification.success('new relations created');
        //     $scope.buttonHide = true;
        // });
        
    }
    //code for autofill tags, present in edit relation
    $scope.verticalQuery = function() {
        return $scope.documentRelationModel.verticalOption;
    };

    $scope.licenseQuery = function() {
        return $scope.documentRelationModel.licenseOption;
    };

});