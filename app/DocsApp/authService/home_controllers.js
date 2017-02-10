var homeController = angular.module('authService.home', ['ui-notification', 'satellizer']);

homeController.controller('HomeController', function($http, $auth, $scope, $state, authAPIservice, _,
                                                     categoryAPIservice) {
    var vm = this;

    vm.users;
    vm.error;
    vm.categories;
    vm.categoryGroup;
    vm.categoryIdNameMap = [];

    vm.logout = function() {
        $auth.logout();
        $state.transitionTo("auth");
    }
    vm.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };


    vm.homeInit = function() {
        // For Document Management: prerequisites get categories
        categoryAPIservice.getcategory()
        .then(function(response){
            vm.categories = response.data.results;
        })

        // For Company Management: prerequisites get user company 
    }

    vm.navList = [
    	{ name : 'License', val : 'license', type: 'link'},
    	{ name : 'Category', val : 'category', type: 'link'},
    	{ name : 'Industry', val : 'industry', type: 'link'},
    	{ name : 'Vertical', val : 'vertical', type: 'link'},
    	{ name : 'Company Management', val : 'company', type: 'toggle'},
    	{ name : 'Document Management', val : 'document', type: 'toggle'}
    ];

    
    // Document mangement Related Controlling
    userSites = localStorage.getItem('sites');
    if (userSites != "undefined" || userSites != "null") {
        // todo check for user in multiple site
        authAPIservice.getSiteDocuments(userSites)
        .then(function(response){
            results = response.data.results;
            vm.categoryGroup = _.groupBy(results, function(doc){
                return doc.subcategory.category;
            });
            
            for (var catId in vm.categoryGroup) {
                _.each(vm.categories, function(category) {
                    if (catId == String(category.id)){
                        var data = {
                            'id': category.id,
                            'name': category.name,
                            'state': 'todo',
                        }
                        vm.categoryIdNameMap.push(data);
                    }
                })
            }
        })
        
        
    }

    // Company Managemnt Related Controlling
});

// todo navigation with respect to user
// Make navigation such that docuemnt maangement->Manual, Checklist, Sop
// Company Management->Company List
// https://www.npmjs.com/package/angular-material-sidemenu sidemenu
// try to figure navigation w.r.t user login.
// 
// Navigation: (GET /get_site_documents)
// ON Portal(user is admin): 1.Docment Management(Fetch FoodProDocsSite documents) 2.Company every table view
// (user is company employee): 1.Document Management(Fetch Perticular site documents) and others
// 
// Use same Document view to navigate through company documents