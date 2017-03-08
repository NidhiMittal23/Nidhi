var parentController = angular.module('parent.controllers', []);

parentController.controller('modalCtrl', function($uibModal, $log, $document) {
    var $ctrl = this;
    $ctrl.items = ['item1212', 'item2', 'item3'];

    $ctrl.animationsEnabled = true;

    $ctrl.open = function (size, parentSelector) {
        var parentElem = parentSelector ? 
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                items: function () {
                    return $ctrl.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

parentController.controller('ModalInstanceCtrl', function($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
        item: $ctrl.items[0]
    };

    $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

parentController.component('modalComponent', {
    templateUrl: 'myModalContent.html',
    bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
    },
    controller: function () {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.items = $ctrl.resolve.items;
            $ctrl.selected = {
                item: $ctrl.items[0]
            };
        };

        $ctrl.ok = function () {
            $ctrl.close({$value: $ctrl.selected.item});
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
        };
    }
});

// TODO: basic controller pattern that has been getting repitive in all conponents developed
// Create a template of controller on top and inherit it further to expand or resuse this controller
// Basic contoller operation handled are: 1. add 2. edit 

// var userController = angular.module('user.controllers', ['ui-notification']);

// userController.controller('userController', function($state, $scope, userAPIservice) {
//     var params = {};
//     $scope.userInitial = function () {
//         // pagination control
//         $scope.bigTotalItems = undefined;
//         $scope.maxSize = 5;
//         $scope.bigCurrentPage = 1;

//         $scope.pageChanged();
//     };

//     $scope.addNewUser = function() {
//         $state.go('userAdd', {});
//     };

//     $scope.editExistUser = function(id, name) {
//         $state.go('userEdit', {id: id, name: name});
//     };

//     $scope.pageChanged = function() {
//         params.page = $scope.bigCurrentPage;
//         userAPIservice.params = params;
//         userAPIservice.get().then(function (response, status) {
//             $scope.userList = userAPIservice.response.results;
//             $scope.bigTotalItems = userAPIservice.response.count;
//         });
//     };
// });

// userController.controller('userAlterCtrl', function($scope, $state, $stateParams, userAPIservice, Notification) {

//     $scope.userModel = {};

//     if ($state.current.name == 'userEdit') {
//         $scope.isEdit = true;
//         var id = $stateParams.id;

//         userAPIservice.params = {};
//         userAPIservice.params.id = id;
        
//         // request to server to get detail of perticular user.
//         userAPIservice.get().then(function (response) {
//             //populate the input field with data.
//             $scope.userModel = userAPIservice.response;
//         });

//     }
//     else if ($state.current.name == 'userAdd') {
//         $scope.isEdit = false;

//         // clone/copy userAPIservice.paramsStructure to userModel;
//         // We want default params Structure new user;
//         $scope.userModel = JSON.parse(JSON.stringify(userAPIservice.paramsStructure));
//     }


//     $scope.addNewUser = function() {
//         $scope.userModel.phone_number = userAPIservice.IndiaMobileCode + $scope.userModel.phone_number;
//         userAPIservice.params = $scope.userModel;
//         console.log(userAPIservice);
//         userAPIservice.post().then(function (response) {
//             var email = userAPIservice.response.email;
//             Notification.success(email+' added successfully');
//         });
//     };

//     $scope.editExistUser = function() {
//         userAPIservice.params = $scope.userModel;
//         userAPIservice.put().then(function (response) {
//             var email = userAPIservice.response.email;
//             Notification.success(email+' updated successfully');
//         });
//     };

// });