var userController = angular.module('user.controllers', ['ui-notification']);

userController.controller('userController', function($state, $scope, userAPIservice) {
    var params = {};
    $scope.userInitial = function () {
        // pagination control
        $scope.bigTotalItems = undefined;
        $scope.maxSize = 5;
        $scope.bigCurrentPage = 1;

        $scope.pageChanged();
    };

    $scope.addNewUser = function() {
        $state.go('userAdd', {});
    };

    $scope.editExistUser = function(id, name) {
        $state.go('userEdit', {id: id, name: name});
    };

    $scope.pageChanged = function() {
        params.page = $scope.bigCurrentPage;
        userAPIservice.params = params;
        userAPIservice.get().then(function (response, status) {
            $scope.userList = userAPIservice.response.results;
            $scope.bigTotalItems = userAPIservice.response.count;
        });
    };
});

userController.controller('userAlterCtrl', function($scope, $state, $stateParams, userAPIservice, Notification) {

    $scope.userModel = {};

    if ($state.current.name == 'userEdit') {
        $scope.isEdit = true;
        var id = $stateParams.id;

        userAPIservice.params = {};
        userAPIservice.params.id = id;
        
        // request to server to get detail of perticular user.
        userAPIservice.get().then(function (response) {
            //populate the input field with data.
            $scope.userModel = userAPIservice.response;
        });

    }
    else if ($state.current.name == 'userAdd') {
        $scope.isEdit = false;

        // clone/copy userAPIservice.paramsStructure to userModel;
        // We want default params Structure new user;
        $scope.userModel = JSON.parse(JSON.stringify(userAPIservice.paramsStructure));
    }


    $scope.addNewUser = function() {
        $scope.userModel.phone_number = userAPIservice.IndiaMobileCode + $scope.userModel.phone_number;
        userAPIservice.params = $scope.userModel;
        console.log(userAPIservice);
        userAPIservice.post().then(function (response) {
            var email = userAPIservice.response.email;
            Notification.success(email+' added successfully');
        });
    };

    $scope.editExistUser = function() {
        userAPIservice.params = $scope.userModel;
        userAPIservice.put().then(function (response) {
            var email = userAPIservice.response.email;
            Notification.success(email+' updated successfully');
        });
    };

});