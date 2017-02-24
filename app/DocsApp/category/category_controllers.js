var categoryController = angular.module('category.controllers', ['ui-notification']);

categoryController.controller('categoryCtrl', function($state, $scope, categoryAPIservice) {
    var params = {};
    $scope.categoryInitial = function () {
        // pagination control
        $scope.bigTotalItems;
        $scope.maxSize = 5;
        $scope.bigCurrentPage = 1;

        $scope.pageChanged();
    }
    $scope.addNewCategory = function() {
        $state.go('addCategory', {});
    }

    $scope.editExistCategory = function(id, name) {
        $state.go('editCategory', {id: id, name: name});
    }

    $scope.pageChanged = function() {
        params.page = $scope.bigCurrentPage;
        categoryAPIservice.getcategory().success(function (response, status) {
            $scope.categoryList = response;
            $scope.bigTotalItems = response.count;
        })
    }
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
    $scope.addNewCategory = function() {
        categoryAPIservice.postCategoryDetail(params).success(function (response, status) {
            var categoryName = params.name;
            Notification.success(categoryName+' added successfully');
        })
    }

})