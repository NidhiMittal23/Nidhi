var companyService = angular.module('company.services', []);

companyService.factory('companyAPIservice', function($http, _) {

    var companyAPI = {};

    var companyUrl = {
        'endpoint': 'http://localhost:9000/company/',
        'siteEndpoint': 'http://localhost:9000/site/',
        'relationEndpoint':'http://localhost:9000/relation/',
        'user': "http://localhost:9000/user/"
    };

    companyAPI.citylist = [
        "Agra", "Ahmedabad", "Alappuzha", "Alwar", "Amritsar", "Aurangabad",
        "Bangalore", "Bharatpur", "Bhavnagar", "Bhikaner", "Bhopal", "Bhubaneshwar",
        "Bodh Gaya", "Calangute", "Chandigarh", "Chennai", "Chittaurgarh", "Coimbatore",
        "Cuttack", "Dalhousie", "Dehradun", "Delhi", "Diu-Island", "Ernakulam", "Faridabad", "Gaya",
        "Gangtok", "Ghaziabad", "Gurgaon", "Guwahati", "Gwalior", "Haridwar", "Hyderabad",
        "Imphal", "Indore", "Jabalpur", "Jaipur", "Jaisalmer", "Jalandhar", "Jamshedpur",
        "Jodhpur", "Junagadh", "Kanpur", "Kanyakumari", "Khajuraho", "Khandala", "Kochi",
        "Kodaikanal", "Kolkata", "Kota", "Kottayam", "Kovalam", "Lucknow", "Ludhiana", "Madurai",
        "Manali", "Mangalore", "Margao", "Mathura", "Mountabu", "Mumbai", "Mussoorie", "Mysore",
        "Nagpur", "Nainital", "Noida", "Ooty", "Orchha", "Panaji", "Patna", "Pondicherry",
        "Porbandar", "Portblair", "Pune", "Puri", "Pushkar", "Rajkot", "Rameswaram", "Ranchi", "Sanchi",
        "Secunderabad", "Shimla", "Surat", "Thanjavur", "Thiruchchirapalli", "Thrissur", "Tirumala",
        "Udaipur", "Vadodra", "Varanasi", "Vasco-Da-Gama", "Vijayawada", "Visakhapatnam"
    ];

    var IndiaMobileCode = "+91";
    // while adding new company fetch user whose has not been assigned to any site
    // http://localhost:9000/user/null/no_company

    companyAPI.getUserWithNoCompany = function() {
        return $http({
            method: 'GET',
            url: companyUrl.user + 'null' + '/no_company/'
        });
    };

    companyAPI.getCompanyEmployees = function(companyId) {
        return $http({
            method: 'GET',
            url: companyUrl.endpoint + companyId + '/get_company_employees/'
        });
    };

    companyAPI.getSiteDocuments = function(siteId) {
        return $http({
            method: 'GET',
            url: companyUrl.siteEndpoint + siteId + '/get_site_documents/'
        });
    };

    companyAPI.getCompany =function(params) {
        params.is_approved = params.isApproved;
        delete params.isApproved;
        return $http({
            method: 'GET',
            url: companyUrl.endpoint,
            params: params
        });
    };

    companyAPI.getCompanyUsers =function(params) {
        return $http({
            method: 'GET',
            url: companyUrl.endpoint + params +"/get_company_employees/",
        });
    };

    companyAPI.getCompanyDetails = function(id) {
        return $http({
            method: 'GET', 
            url: companyUrl.endpoint + id + '/'
        });
    };

    companyAPI.getCompanyDetailsWithFilter = function(params) {
        var id = params.id;
        var isApproved = params.isApproved;
        return $http({
            method: 'GET', 
            url: companyUrl.endpoint + id + '/',
            params: params
        });
    };

    companyAPI.getCompanySite =function(id) {
        return $http({
            method: 'GET',
            url: companyUrl.endpoint + id + "/"
        });
    };

    companyAPI.getCompanySiteDetails =function(id) {
        return $http({
            method: 'GET',
            url: companyUrl.siteEndpoint + id + "/"
        });
    };

    companyAPI.getRelationDetails = function(id) {
        return $http({
            method: 'GET', 
            url: companyUrl.relationEndpoint + id + '/'
        });
    };

    companyAPI.postCompanyDetail = function(params) {

        // Enhance: there can be a form TEMPLATE ; because chances of 
        // getting this wrong is highly likable
        console.log(params);

        var payload = new FormData();

        payload.append('name', params.name);

        _.each(params.industrySelected, function(industry) {
            payload.append('industry', industry);
        });

        payload.append('is_active', params.isActive);
        payload.append('city', params.citySelected);
        payload.append('logo', params.logo);
        payload.append('phone_number', IndiaMobileCode + params.phone_number);
        payload.append('payment_date', params.paymentDate);
        payload.append('email', params.email);
        // Admin is building this company from his portal
        payload.append('is_approved', params.isApproved);
        // isApproved

        return $http({
            url: companyUrl.endpoint,
            method: 'POST',
            data: payload,
            //assign content-type as undefined, the browser
            //will assign the correct boundary for us
            headers: { 'Content-Type': undefined},
            //prevents serializing payload.  don't do it.
            transformRequest: angular.identity
        });
    };

    companyAPI.putCompanyDetail = function(params) {
        var payload = new FormData();
        payload.append('name', params.name);

        _.each(params.industrySelected, function(industry) {
            payload.append('industry', industry);
        });

        payload.append('is_active', params.isActive);
        payload.append('city', params.citySelected);
        if (params.hasOwnProperty('logo')){
            payload.append('logo', params.logo);
        }
        payload.append('phone_number', IndiaMobileCode + params.phone_number);
        payload.append('payment_date', params.paymentDate);
        payload.append('email', params.email);
        payload.append('is_approved', params.isApproved);

        return $http({
            url: companyUrl.endpoint + params.id + '/',
            method: 'PUT',
            data: payload,
            headers: { 'Content-Type': undefined},
            transformRequest: angular.identity
        });
    };

    companyAPI.deleteCompanyDetail = function(params) {
        return $http({
            method: 'DELETE',
            url: companyUrl.endpoint + params.id + '/'
        })
    }

    companyAPI.postCompanySiteDetail = function(params) {
        var payload = new FormData();
        payload.append('company', params.companyId);
        payload.append('name', params.name);
        payload.append('location', params.location);
        payload.append('license', params.licenseSelected);
        payload.append('vertical', params.verticalSelected);
        // payload.append('employee', params.companyEmployeesSelected);
        _.each(params.companyEmployeesSelected, function(employee) {
            payload.append('employee', employee);
        });

        return $http({
            url: companyUrl.siteEndpoint,
            method: 'POST',
            data: payload,
            //assign content-type as undefined, the browser
            //will assign the correct boundary for us
            headers: { 'Content-Type': undefined},
            //prevents serializing payload.  don't do it.
            transformRequest: angular.identity
        });
    };

    companyAPI.transferSiteEmployee = function(params) {
        var siteId = params.site;
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: companyUrl.siteEndpoint + siteId + '/transfer_site_employee/',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: params
        });

    };

    companyAPI.constructSiteDocument = function(siteId) {
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: companyUrl.siteEndpoint + siteId + '/construct_site_documents/',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        });
    };

    return companyAPI;

});