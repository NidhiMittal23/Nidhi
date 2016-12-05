var industryController = angular.module('industry.controllers', ['ui-notification']);

industryController.controller('industryCtrl', function($state, $scope, industryAPIservice) {

    $scope.addNewIndustry = function() {
        $state.go('addIndustry', {});
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
})