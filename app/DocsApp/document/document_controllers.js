var documentController = angular.module('document.controllers', ['ui-notification']);

documentController.controller('documentCtrl', function($state, $scope, documentAPIservice, _, categoryAPIservice) {

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
            $scope.reloadRoute();
        })
    }

    $scope.reloadRoute = function() {
        $window.location.reload();
    }

    categoryAPIservice.getcategory().success(function(response,status) {
        $scope.categoryName = [];
        $scope.categoryName["null"] = "uncategorized";

        _.each(response.results,function(obj) {
            $scope.categoryName[obj.id]= obj.name;
        });
        //console.log($scope.categoryName);
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

    documentAPIservice.getDocument().success(function (response, status) {
        $scope.documentList = response;
        //console.log(response);

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
            if (response.subcategories !== null) {
                $scope.documentSubCategoryModel.name = response.subcategories.name;
                categoryAPIservice.getCategoryDetails(response.subcategories.category).success(function (response, status) {

                    //selected Category object
                    $scope.documentSubCategoryModel.categorySelected = response;
                });
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
            // todo
            // Add version: Upload file

        }).error(function (response, status) {
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

    $scope.editExistDocument = function() {
        console.log("add edit document function here");

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
        }).error(function (response, status) {
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

    $scope.editDocumentSubCategory = function() {
        // console.log($scope.documentSubCategoryModel.categorySelected);
        console.log("edit DocumentSubCategory");
    }


    $scope.buildDocumentRelation = function() {
        

        _.each($scope.documentRelationModel.verticalSelected, function(verticalObj) {

            _.each($scope.documentRelationModel.licenseSelected, function(licenseObj) {
                var params = {
                    vertical_id : verticalObj.id,
                    license_id : licenseObj.id,
                    subcategory_id : $scope.documentRelationModel.subcategoryAddedId,
                };
                /*defining params before the loop leds to requesting sam params reference*/

                documentAPIservice.postDocumentRelationDetail(params).success(function (response, status) {
                //console.log(response);
                Notification.success('Relation created successfully');
                }).error(function (response, status) {
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
        });
        
    }

    $scope.editBuildDocumentRelation = function() {
        console.log("edit buildDocumentRelation");
    }

});