var documentController = angular.module('document.controllers', ['ui-notification']);

documentController.controller('documentCtrl', function($state, $window ,$scope, documentAPIservice,
    _, categoryAPIservice, Notification) {

    $scope.addNewDocument = function() {
        $state.go('addDocument', {});
    }

    $scope.gotoDocVersion = function(id, name) {
        $state.go('docVersion', {id: id, name : name});
    }

    $scope.editExistDocument = function(id, name) {
        $state.go('editDocument', {id: id, name: name});
    }

    $scope.versionDelete = function(id) {
        documentAPIservice.deleteVersion(id).success(function(response) {
            // add notification message #todo
            // hint add callback
            $scope.reloadRoute();
        })
    }

    $scope.reloadRoute = function() {
        $window.location.reload();
    }

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
        


    })

    }

    categoryAPIservice.getcategory().success(function(response,status) {
        $scope.categoryName = [];
        $scope.categoryName["null"] = "uncategorized";

        _.each(response.results,function(obj) {
            $scope.categoryName[obj.id]= obj.name;
        });
        //console.log($scope.categoryName);
    })

    documentAPIservice.getDocument().success(function (response, status) {
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
    })
});


documentController.controller('docVersionCtrl', function($state, $stateParams, $scope, Notification, documentAPIservice) {

    var id = $stateParams.id

    $scope.addNewDocVersion = function() {
        $state.go('addDocVersion', {docId: id});
    }

    $scope.editExistDocVersion = function(id, name) {
        $state.go('editDocVersion', {id: id, name: name});
    }

    documentAPIservice.getDocVersion(id).success(function (response, status) {
        $scope.docVersionList = response;
    })
});


documentController.controller('docVersionAlterCtrl', function($scope, $state, $stateParams,
    documentAPIservice, Notification /*, Upload */) {

    $scope.docVersionModel = {};

    var params = $scope.docVersionModel;
    var docid = $stateParams.docId;
    params.document = docid;

    // have to move this login to service
    $scope.addNewDocVersion = function(){

        var uploadUrl = 'http://localhost:9000/version/';
        documentAPIservice.postDocVersionDetail(uploadUrl, $scope.docVersionModel)
    };
});


documentController.controller('documentAlterCtrl', function($state, $stateParams, $scope,
        documentAPIservice, verticalAPIservice, licenseAPIservice, categoryAPIservice, $q,
        Notification) {
    $scope.documentModel = {};
    $scope.documentRelationModel = {};
    $scope.documentSubCategoryModel = {};
    $scope.documentVersionModel = {};

    $scope.initMile = function() {
        $scope.docMile = false;
        $scope.verMile = false;
        $scope.catMile = false;
        $scope.relMile = false;

    };

    $scope.init = function() {

        // populate option for dropDown
        // $scope.documentSubCategoryModel.selectedCategoryId = function(categoryObj) {
        //     $scope.documentSubCategoryModel.categorySelected = categoryObj;
        // }

        // $scope.documentRelationModel.selectedVerticalId = function(verticalObj) {
        //     console.log(verticalObj);
        //     $scope.documentRelationModel.verticalSelected = verticalObj;
        // }

        // $scope.documentRelationModel.selectedLicenseId = function(licenseObj) {
        //     console.log(licenseObj);
        //     $scope.documentRelationModel.licenseSelected = licenseObj;
        // }

        var categories = categoryAPIservice.getcategory();
        var verticals = verticalAPIservice.getVertical();
        var licenses = licenseAPIservice.getlicense();


        $q.all([verticals, licenses, categories]).then(function(values) {
            $scope.documentRelationModel.verticalOption = values[0].data.results;
            $scope.documentRelationModel.licenseOption = values[1].data.results;
            $scope.documentSubCategoryModel.categoryOption = values[2].data.results;

        });

        $scope.documentRelationModel.selectedLicenseId = function(licenseId) {
            $scope.documentRelationModel.licenseSelected = licenseId;
        }

        $scope.documentRelationModel.selectedVerticalId = function(verticalId) {
            $scope.documentRelationModel.verticalSelected = verticalId;
        }

    }

    if ($state.current.name == 'editDocument') {
        $scope.isEdit = true;
        var docId = $stateParams.id;
        var docName = $stateParams.name;

        // request to server to get detail of perticular vertical.
        documentAPIservice.getDocumentDetail(docId).success(function (response, status) {
            //populate the input field with data.
            $scope.documentModel = response;
            $scope.documentRelationModel.subcategoryAddedId = response.subcategories.id;
            if (response.subcategories !== null) {
                $scope.documentSubCategoryModel.name = response.subcategories.name;
                categoryAPIservice.getCategoryDetails(response.subcategories.category).success(function (response, status) {

                    //selected Category object
                    $scope.documentSubCategoryModel.categorySelected = response;
                });


                //populate edit relation fields with data

                var licId = [];// separate array to store only id as checking duplicate object was difficult
                var verId = [];
                var relLicense = [];// $scope.documentRelationModel.licenseSelected is not defined so creating separate array to store objects
                var relVertical = [];

                $scope.relExisting = response.subcategories.relations;

                _.each($scope.relExisting, function(id) {
                    documentAPIservice.getRelationDetail(id).success(function (response, status) {
                        console.log(response);

                        if(licId.indexOf(response.license.id) === -1) {
                            licId.push(response.license.id);
                            relLicense.push(response.license);
                        }

                        if(verId.indexOf(response.vertical.id) === -1) {
                            verId.push(response.vertical.id);
                            relVertical.push(response.vertical);
                        }
                        
                    })
                })

                console.log(relLicense);
                console.log(relVertical);
                $scope.documentRelationModel.licenseSelected = relLicense;
                $scope.documentRelationModel.verticalSelected = relVertical;
            }
        })

    }
    else if ($state.current.name == 'addDocument') {
        $scope.isEdit = false;
    }


    // Add new Document  
    $scope.addNewDocument = function() {
        var params = $scope.documentModel;
        documentAPIservice.postDocumentDetail(params).success(function (response, status) {
            var documentName = response.name;
            $scope.documentModel.newDocumentId = response.id;
            Notification.success(documentName+' added successfully');
            $scope.docMile = true;
            // todo
            // Add version: Upload file

        })
    }

    $scope.addNewDocumentVersion = function(){

        var params = $scope.documentVersionModel;
        var docid = $scope.documentModel.newDocumentId;
        params.document = docid;

        var uploadUrl = 'http://localhost:9000/version/';
        documentAPIservice.postDocVersionDetail(uploadUrl, $scope.documentVersionModel);
        $scope.verMile = true;
    };

    $scope.editExistDocument = function() {
        console.log("add edit document function here");

        //in .success() add following
        $scope.docMile = true;

    }

    // Associate Subcategory to newly Created Document
    $scope.addDocumentSubCategory = function() {
        var params = $scope.documentSubCategoryModel;
        params.document = $scope.documentModel.newDocumentId;
        params.category = $scope.documentSubCategoryModel.categorySelected.id;
        categoryAPIservice.postSubCategoryDetail(params).success(function (response, status) {
            $scope.documentRelationModel.subcategoryAddedId = response.id;
            var subCategoryName = response.name;
            Notification.success(subCategoryName+' added successfully');
            $scope.catMile = true;
        })
    }

    $scope.editDocumentSubCategory = function() {
        // console.log($scope.documentSubCategoryModel.categorySelected);
        console.log("edit DocumentSubCategory");

        //in success() add following
        $scope.catMile = true;

    }


    $scope.buildDocumentRelation = function() {
        var promiseList = [];
        _.each($scope.documentRelationModel.licenseSelected, function(licenseObj) {
            _.each($scope.documentRelationModel.verticalSelected, function(verticalObj) {
                var params = {
                    vertical_id : verticalObj.id,
                    license_id : licenseObj.id,
                    subcategory_id : $scope.documentRelationModel.subcategoryAddedId,
                };
                promiseList.push(documentAPIservice.postDocumentRelationDetail(params));
            })
        })

        $q.all(promiseList).then(function(values) {
            // have to make request failure more concreate #todo
            Notification.success('Relation created successfully');
            $scope.relMile = true;
        });
    }

    $scope.editBuildDocumentRelation = function() {
        var promiseList = [];
        var deleteList = [];
        _.each($scope.documentRelationModel.licenseSelected, function(licenseObj) {
            _.each($scope.documentRelationModel.verticalSelected, function(verticalObj) {
                var params = {
                    vertical_id : verticalObj.id,
                    license_id : licenseObj.id,
                    subcategory_id : $scope.documentRelationModel.subcategoryAddedId,
                };
                promiseList.push(documentAPIservice.postDocumentRelationDetail(params));
            })
        })

        _.each($scope.relExisting, function(id) {
            deleteList.push(documentAPIservice.deleteRelation(id));
        })

        $q.all(deleteList).then(function(values) {
            Notification.error('deleted old relations');
        });

        $q.all(promiseList).then(function(values) {
            // have to make request failure more concreate #todo
            Notification.success(' New Relations added !');
        });
    }

});