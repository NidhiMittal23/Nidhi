var documentController = angular.module('document.controllers', ['ui-notification']);

documentController.controller('documentCtrl', function($state, $window ,$scope, documentAPIservice,
    _, categoryAPIservice, companyAPIservice, Notification, $http, $stateParams) {
    $scope.serverDomain = documentAPIservice.serverDomain;

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

    $scope.versionReset = function(id) {
        documentAPIservice.resetVersion(id).success(function(response) {
            // add notification message #todo
            // hint add callback
            $scope.reloadRoute();
        })
    }


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
        })
    }

    $scope.versionFileEdit = function(docfileUrl) {
        var win = window.open(docfileUrl, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }
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
        })
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
        })
    }

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
        var categories = categoryAPIservice.getcategory();
        var verticals = verticalAPIservice.getVertical(params);
        var licenses = licenseAPIservice.getlicense(params);


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

                $scope.documentRelationModel.subcategoryAddedId = response.subcategories.id;
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
                        //console.log(response);

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

                //console.log(relLicense);
                //console.log(relVertical);
                $scope.documentRelationModel.licenseSelected = relLicense;
                $scope.documentRelationModel.verticalSelected = relVertical;
            }
            else{
                $scope.noSubCategory = true;
                $scope.documentModel.newDocumentId = docId;
            }
        })

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
        var params = $scope.documentModel;
        documentAPIservice.putDocumentDetail(params).success(function (response, status) {
            Notification.success(params.name + ' updated successfully');
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
        params.category = $scope.documentSubCategoryModel.categorySelected.id;
        categoryAPIservice.postSubCategoryDetail(params).success(function (response, status) {
            $scope.documentRelationModel.subcategoryAddedId = response.id;
            var subCategoryName = response.name;
            Notification.success(subCategoryName+' added successfully');
            $scope.catMile = true;
            $scope.noSubCategory = false ;
        })
    }

    $scope.editDocumentSubCategory = function() {
        var params = $scope.documentSubCategoryModel;
        var subCatId = $scope.documentRelationModel.subcategoryAddedId;
        params.document = $scope.documentModel.id;
        params.category = $scope.documentSubCategoryModel.categorySelected.id;
        categoryAPIservice.putSubCategoryDetail(params, subCatId).success(function (response, status) {
            Notification.success(params.name + ' updated successfully');
        })
    }


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
        }

        documentAPIservice.setRelation(params).success(function (response, status) {
            Notification.success('Relationship Established');
        });
        // _.each(licenseSelectedList, function(licenseObj) {
        //     _.each(verticalSelectedList, function(verticalObj) {
        //         var params = {
        //             vertical : verticalObj.id,
        //             license : licenseObj.id,
        //             subcategory : subCatId,
        //         };
        //         promiseList.push(documentAPIservice.setRelation(params));
        //     })
        // })

        // $q.all(promiseList).then(function(values) {
        //     console.log(values);
        //     // have to make request failure more concreate #todo
        //     Notification.success('Relation created successfully');
        //     $scope.relMile = true;
        // });
    }

    $scope.editBuildDocumentRelation = function() {
        var promiseList = [];
        var deleteList = [];

        

        
        _.each($scope.relExisting, function(id) {
            deleteList.push(documentAPIservice.deleteRelation(id));
        })

        //console.log(deleteList);

        $q.all(deleteList).then(function(values) {
            Notification.error('deleted old relations');
            deleteList.length = 0;
            //console.log(deleteList);


            _.each($scope.documentRelationModel.licenseSelected, function(licenseObj) {
                _.each($scope.documentRelationModel.verticalSelected, function(verticalObj) {
                    var params = {
                        vertical_id : verticalObj.id,
                        license_id : licenseObj.id,
                        subcategory_id : $scope.documentRelationModel.subcategoryAddedId,
                    };
                    documentAPIservice.postDocumentRelationDetail(params).success(function(response){
                        //console.log(response);
                    });
                })
            })

        }).then(function(values){
            Notification.success('new relations created');
            $scope.buttonHide = true;
        });

        
        

        
    }
    //code for autofill tags, present in edit relation
    $scope.verticalQuery = function() {
        return $scope.documentRelationModel.verticalOption;
    }

    $scope.licenseQuery = function() {
        return $scope.documentRelationModel.licenseOption;
    }

});