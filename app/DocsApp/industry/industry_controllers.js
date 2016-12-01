var industryController = angular.module('industry.controllers', ['ui-notification']);

industryController.controller('industryCtrl', function($state, $scope, industryAPIservice) {

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