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

verticalController.controller('verticalAlterCtrl', function($scope, $state, $stateParams, verticalAPIservice, Notification) {

    $scope.verticalModel = {};

    if ($state.current.name == 'editVertical') {
        $scope.isEdit = true;
        var id = $stateParams.id
        
        // request to server to get detail of perticular vertical.
        verticalAPIservice.getVerticalDetails(id).success(function (response, status) {
            //populate the input field with data.
            $scope.verticalModel = response;
        })

    }
    else if ($state.current.name == 'addVertical') {
        $scope.isEdit = false;
    }

    var params = $scope.verticalModel;

    $scope.addNewVertical = function() {
        verticalAPIservice.postVerticalDetail(params).success(function (response, status) {
            var verticalName = params.name;
            Notification.success(verticalName+' added successfully');
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

    $scope.editExistVertical = function() {
        var newval = $scope.verticalModel;
        verticalAPIservice.putVerticalDetail(newval).success(function (response, status) {
            Notification.success(newval.name+' updated successfully');
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