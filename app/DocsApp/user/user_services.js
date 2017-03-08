var userService = angular.module('user.services', []);

userService.factory('userAPIservice', function($http, parentAPIService) {
    // userAPIservice is subclass for parentAPIService
    function userAPIservice () {
        parentAPIService.call(this); // call super constructor
    }

    // subclass exend superclass
    userAPIservice.prototype = Object.create(parentAPIService.prototype);
    userAPIservice.prototype.constructor = userAPIservice;

    userAPIservice.prototype.IndiaMobileCode = "+91";
    userAPIservice.prototype.paramsStructure = {
        username: null,
        email: undefined,
        password: undefined,
        is_staff: true,
        is_active: true,
        is_lead: false,
        is_editor: false,
        phone_number: undefined,
        first_name: null,
        last_name: null
    };

    var userAPIserviceObj = new userAPIservice();
    userAPIserviceObj.apiUrl = "http://localhost:9000/user/";
    // set userAPIserviceObj.params = {} from controller;
    // userParams member method extends userAPIserviceObj
    return userAPIserviceObj; 
});