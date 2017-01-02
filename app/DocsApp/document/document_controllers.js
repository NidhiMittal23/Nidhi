var documentController = angular.module('document.controllers', ['ui-notification']);

documentController.controller('documentCtrl', function($state, $scope, documentAPIservice) {

    $scope.addNewDocument = function() {
        $state.go('addDocument', {});
    }

    $scope.gotoDocVersion = function(id, name) {
        $state.go('docVersion', {id: id, name : name});
    }

    $scope.editExistDocument = function(id, name) {
        $state.go('editDocument', {id: id, name: name});
    }

    documentAPIservice.getDocument().success(function (response, status) {
        $scope.documentList = response;
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


documentController.controller('docVersionCtrl', function($state, $stateParams, $scope, documentAPIservice) {

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


documentController.controller('docVersionAlterCtrl', function($scope, $state, $stateParams, documentAPIservice, Notification /*, Upload */) {

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
        documentAPIservice, verticalAPIservice, licenseAPIservice, categoryAPIservice, $q) {
    $scope.documentModel = {};
    $scope.documentRelationModel = {};
    $scope.documentSubCategoryModel = {};

    $scope.init = function() {

        // populate option for dropDown
        $scope.documentSubCategoryModel.selectedCategoryId = function(categoryId) {
            // console.log(categoryId);
            $scope.documentSubCategoryModel.categorySelected = categoryId;
        }

        $scope.documentRelationModel.selectedVerticalId = function(verticalId) {
            console.log(verticalId);
            $scope.documentRelationModel.verticalSelected = verticalId;
        }

        $scope.documentRelationModel.selectedLicenseId = function(licenseId) {
            console.log(licenseId);
            $scope.documentRelationModel.licenseSelected = licenseId;
        }

        var categories = categoryAPIservice.getcategory();
        var verticals = verticalAPIservice.getVertical();
        var licenses = licenseAPIservice.getlicense();


        $q.all([verticals, licenses, categories]).then(function(values) {
            $scope.documentRelationModel.verticalOption = values[0].data.results;
            $scope.documentRelationModel.licenseOption = values[1].data.results;
            $scope.documentSubCategoryModel.categoryOption = values[2].data.results;

        });


    }

    if ($state.current.name == 'editDocument') {
        $scope.isEdit = true;
        var docId = $stateParams.id;
        var docName = $stateParams.name;


        
        // request to server to get detail of perticular vertical.
        verticalAPIservice.getVerticalDetails(id).success(function (response, status) {
            //populate the input field with data.
            $scope.documentModel = response;
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
            // Notification.success(documentName+' added successfully');
            console.log("New Document Added");
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

    // Associate Subcategory to newly Created Document
    $scope.addDocumentSubCategory = function() {
        var params = $scope.documentSubCategoryModel;
        params.document = $scope.documentModel.newDocumentId;
        params.category = $scope.documentSubCategoryModel.categorySelected;
        categoryAPIservice.postSubCategoryDetail(params).success(function (response, status) {
            $scope.documentRelationModel.subcategoryAdded = response.id;
            console.log(response.name);
            // var subCategoryName = params.name;
            // Notification.success(subCategoryName+' added successfully');
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
        console.log("here");
        // var newval = $scope.documentModel;
        // verticalAPIservice.putVerticalDetail(newval).success(function (response, status) {
        //     Notification.success(newval.name+' updated successfully');
        // }).error(function (response, status) {
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


    $scope.buildDocumentRelation = function() {
        var params = {};
        params.vertical_id = $scope.documentRelationModel.verticalSelected;
        params.license_id = $scope.documentRelationModel.licenseSelected;
        params.subcategory_id = $scope.documentRelationModel.subcategoryAdded;
        documentAPIservice.postDocumentRelationDetail(params).success(function (response, status) {
            console.log(response);
            // var subCategoryName = params.name;
            // Notification.success(subCategoryName+' added successfully');
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

});