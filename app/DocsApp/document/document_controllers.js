var documentController = angular.module('document.controllers', ['ui-notification']);

documentController.controller('documentCtrl', function($state, $scope, documentAPIservice) {

    $scope.addNewDocument = function() {
        $state.go('adddocument', {});
    }

    $scope.gotoDocVersion = function(id, name) {
        $state.go('docVersion', {id: id, name : name});
    };

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

documentController.controller('docVersionCtrl', function($state, $scope, documentAPIservice) {

    $scope.addNewDocVersion = function() {
        $state.go('adddocversion', {});
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