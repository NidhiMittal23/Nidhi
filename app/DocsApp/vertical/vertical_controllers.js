var verticalController = angular.module('vertical.controllers', ['ui-notification']);

verticalController.controller('verticalCtrl', function($state, $scope, verticalAPIservice) {
    var params = {};
    $scope.categoryInitial = function () {
        // pagination control
        $scope.bigTotalItems = undefined;
        $scope.maxSize = 5;
        $scope.bigCurrentPage = 1;

        $scope.pageChanged();
    };

    $scope.addNewVertical = function() {
        $state.go('addVertical', {});
    };

    $scope.editExistVertical = function(id, name) {
        $state.go('editVertical', {id: id, name: name});
    };

    $scope.pageChanged = function() {
        params.page = $scope.bigCurrentPage;
        verticalAPIservice.getVertical(params).success(function (response, status) {
            $scope.verticalList = response;
            $scope.bigTotalItems = response.count;
        });
    };
});

verticalController.controller('verticalAlterCtrl', function($scope, $state, $stateParams, verticalAPIservice, Notification) {

    $scope.verticalModel = {};

    if ($state.current.name == 'editVertical') {
        $scope.isEdit = true;
        var id = $stateParams.id;
        
        // request to server to get detail of perticular vertical.
        verticalAPIservice.getVerticalDetails(id).success(function (response, status) {
            //populate the input field with data.
            $scope.verticalModel = response;
        });

    }
    else if ($state.current.name == 'addVertical') {
        $scope.isEdit = false;
    }

    var params = $scope.verticalModel;

    $scope.addNewVertical = function() {
        verticalAPIservice.postVerticalDetail(params).success(function (response, status) {
            var verticalName = params.name;
            Notification.success(verticalName+' added successfully');
        });
    };

    $scope.editExistVertical = function() {
        var newval = $scope.verticalModel;
        verticalAPIservice.putVerticalDetail(newval).success(function (response, status) {
            Notification.success(newval.name+' updated successfully');
        });
    };

    $scope.deleteExistVertical = function() {
        var newval = $scope.verticalModel;
        verticalAPIservice.deleteVerticalDetail(newval).success(function (response, status) {
            Notification.success('Delete successfully');
            $state.go('vertical');
        });
    };

});