var categoryService = angular.module('category.services', []);

categoryService.factory('categoryAPIservice', function($http) {

    var categoryAPI = {};

    //endpoints corresponding to category
    var categoryUrl = {
        'endpoint': 'http://localhost:9000/category/',
        'subcategoryEndpoint': 'http://localhost:9000/subcategory/'
    };

    //Enhance: Use Protype inheritance to Make a single function and inherit it to 
    // get basic request like getcategory, post, etc..
    categoryAPI.getcategory = function(params) {
        return $http({
            method: 'GET', 
            url: categoryUrl.endpoint,
            params: params
        });
    };

    categoryAPI.getSubcategory = function() {
        return $http({
            method: 'GET', 
            url: categoryUrl.subcategoryEndpoint
        });
    };

    categoryAPI.getCategoryDetails = function(id) {
        return $http({
            method: 'GET', 
            url: categoryUrl.endpoint + id + '/'
        });
    };

    categoryAPI.postCategoryDetail = function(params) {
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: categoryUrl.endpoint,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    };

    categoryAPI.postSubCategoryDetail = function(params) {
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: categoryUrl.subcategoryEndpoint,
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    };

    categoryAPI.putSubCategoryDetail = function(params, id) {
        return $http({
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: categoryUrl.subcategoryEndpoint + id + '/',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    };

    categoryAPI.putCategoryDetail = function(params) {
        return $http({
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: categoryUrl.endpoint + params.id + '/',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });
    };

    categoryAPI.deleteCategoryDetail = function(params) {
        var id = params.id;
        return $http({
            method: 'DELETE',
            url: categoryUrl.endpoint + id + '/',
        })
    }

    return categoryAPI;
});