var userController = angular.module('user.controllers', ['ui-notification']);

userController.controller('userCtrl', function($state, $scope, userAPIservice) {
    var params = {};
    $scope.categoryInitial = function () {
        // pagination control
        $scope.bigTotalItems = undefined;
        $scope.maxSize = 5;
        $scope.bigCurrentPage = 1;

        $scope.pageChanged();
    };

    $scope.addNewUser = function() {
        $state.go('addUser', {});
    };

    $scope.editExistUser = function(id, name) {
        $state.go('editUser', {id: id, name: name});
    };

    $scope.pageChanged = function() {
        params.page = $scope.bigCurrentPage;
        userAPIservice.getUser(params).success(function (response, status) {
            $scope.userList = response;
            $scope.bigTotalItems = response.count;
        });
    };
});

userController.controller('userAlterCtrl', function($scope, $state, $stateParams, userAPIservice, Notification) {

    $scope.userModel = {};

    if ($state.current.name == 'editUser') {
        $scope.isEdit = true;
        var id = $stateParams.id;
        
        // request to server to get detail of perticular user.
        userAPIservice.getuserDetails(id).success(function (response, status) {
            //populate the input field with data.
            $scope.userModel = response;
        });

    }
    else if ($state.current.name == 'adduser') {
        $scope.isEdit = false;
    }

    var params = $scope.userModel;

    $scope.addNewuser = function() {
        userAPIservice.postuserDetail(params).success(function (response, status) {
            var userName = params.name;
            Notification.success(userName+' added successfully');
        });
    };

    $scope.editExistuser = function() {
        var newval = $scope.userModel;
        userAPIservice.putuserDetail(newval).success(function (response, status) {
            Notification.success(newval.name+' updated successfully');
        });
    };

});