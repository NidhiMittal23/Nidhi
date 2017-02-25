var industryController = angular.module('industry.controllers', ['ui-notification']);

industryController.controller('industryCtrl', function($state, $scope, industryAPIservice) {
    var params = {};
    $scope.industryInitial = function () {
        // pagination control
        $scope.bigTotalItems;
        $scope.maxSize = 5;
        $scope.bigCurrentPage = 1;

        $scope.pageChanged();
    }

    $scope.addNewIndustry = function() {
        $state.go('addIndustry', {});
    }

    $scope.editExistIndustry = function(id, name) {
        $state.go('editIndustry', {id: id, name: name});
    }

    $scope.pageChanged = function() {
        params.page = $scope.bigCurrentPage;
        industryAPIservice.getIndustry(params).success(function (response, status) {
            $scope.industryList = response;
            $scope.bigTotalItems = response.count;
        })
    }
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
        })
    }

    $scope.editExistIndustry = function() {
        var newval = $scope.industryModel;
        var pid = id
        industryAPIservice.putIndustryDetail(pid, newval).success(function (response, status) {

            Notification.success(newval.name+' updated successfully');
        })
    }

})