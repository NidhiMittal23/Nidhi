var industryController = angular.module('industry.controllers', ['ui-notification']);

industryController.controller('industryCtrl', function($state, $scope, industryAPIservice) {

    $scope.addNewIndustry = function() {
        $state.go('addIndustry', {});
    }

    $scope.editExistIndustry = function(id, name) {
        $state.go('editIndustry', {id: id, name: name});
    }

    industryAPIservice.getIndustry().success(function (response, status) {
        $scope.industryList = response;
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

industryController.controller('industryAlterCtrl', function($scope, $state, $stateParams, industryAPIservice, Notification) {

    $scope.industryModel = {};

    if ($state.current.name == 'editIndustry') {
        $scope.isEdit = true;
        var id = $stateParams.id
        
        // request to server to get detail of perticular industry.
        industryAPIservice.getIndustryDetails(id).success(function (response, status) {
            //populate the input field with data.
            $scope.industryModel = response;
        })

    }
    else if ($state.current.name == 'addIndustry') {
        $scope.isEdit = false;
    }

    var params = $scope.industryModel;

    $scope.addNewIndustry = function() {
        industryAPIservice.postIndustryDetail(params).success(function (response, status) {
            var industryName = params.name;
            Notification.success(industryName+' added successfully');
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

    $scope.editExistIndustry = function() {
        var newval = $scope.industryModel;
        var pid = id
        industryAPIservice.putIndustryDetail(pid, newval).success(function (response, status) {

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

})