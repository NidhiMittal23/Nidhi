var categoryController = angular.module('category.controllers', ['ui-notification']);

categoryController.controller('categoryCtrl', function($state, $scope, categoryAPIservice) {

    $scope.addNewCategory = function() {
        $state.go('addCategory', {});
    }

    $scope.editExistCategory = function(id, name) {
        $state.go('editCategory', {id: id, name: name});
    }

    categoryAPIservice.getcategory().success(function (response, status) {
        $scope.categoryList = response;
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
});


categoryController.controller('categoryAlterCtrl', function($scope, $state, $stateParams, categoryAPIservice, Notification) {
    
    $scope.categoryModel = {};
    
    if ($state.current.name == 'editCategory') {
        $scope.isEdit = true;
        var id = $stateParams.id
        
        // request to server to get detail of particular category.
        categoryAPIservice.getCategoryDetails(id).success(function (response, status) {
            //populate the input field with data.
            $scope.categoryModel = response;
        })

    }
    else if ($state.current.name == 'addCategory') {
        $scope.isEdit = false;
    }

    var params = $scope.categoryModel;
    // on submit button click
    $scope.addNewLicense = function(params) {
        licenseAPIservice.postCategoryDetail(params).success(function (response, status) {
            var categoryName = params.name;
            Notification.success(categoryName+' added successfully');
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

})