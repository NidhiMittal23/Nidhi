var verticalController = angular.module('vertical.controllers', ['ui-notification']);

verticalController.controller('verticalCtrl', function($state, $scope, verticalAPIservice) {

    $scope.addNewVertical = function() {
        $state.go('addVertical', {});
    }

    $scope.editExistVertical = function(id, name) {
        $state.go('editVertical', {id: id, name: name});
    }

    verticalAPIservice.getVertical().success(function (response, status) {
        $scope.verticalList = response;
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