angular.module('CACApp', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl : 'home/home.html',
            controller : 'HomeCtrl'
        }).when('/countries', {
        	templateUrl :'countries/countries.html',
        	controller : 'CountriesCtrl'
        }).when('/countries/:countryCode', {
        	templateUrl : 'detail/detail.html',
        	controller : 'DetailCtrl'
        }).otherwise('/')
    }])
    .controller('HomeCtrl', function($scope) {
        //empty for now
    })
    .controller('CountriesCtrl', function($scope, $rootScope, $cacheFactory, $http){
        var url = 'http://api.geonames.org/countryInfoJSON?username=stewartj';

    	$http.get(url,{
            cache : true
        })
    	.then(function(data){
    		$scope.countryNames = data.data.geonames;
            $rootScope.countryNames = $scope.countryNames;

            //caching
            // var cache = $cacheFactory.get('$http');
            // var cachedResponse = cache.get(url); 
            // console.log(cachedResponse);
    	},
    		function(){
    		console.log('fail')	
    		}
    	);

    })
    .controller('DetailCtrl', function($scope, $rootScope, $http, $routeParams){
        // var url = 'http://api.geonames.org/countryInfoJSON?username=stewartj';

        // get country from country page 
    	$scope.selectedCountry = $routeParams.countryCode;

    
        //get country data from country page
        $scope.countryNames = $rootScope.countryNames;

        angular.forEach($scope.countryNames, function(value, key) {
           if($scope.selectedCountry == value.fipsCode){
            $scope.population = value.population;
            $scope.area = value.areaInSqKm;
            $scope.capital = value.capital;
            $scope.geonameId = value.geonameId;
           }
           console.log (value.fipsCode);
        });

        console.log($scope.countryNames);

    	$http.get('http://api.geonames.org/searchJSON?name_equals='+$scope.capital+'&country='+$scope.selectedCountry+'&username=stewartj')
    	.then(function(data){
            if(data.data.geonames[0]['population']){
    		$scope.capitalPopulation = data.data.geonames[0]['population'];
            }
    	},function(){
    		console.log('something went wrong');
    	});


        $http.get('http://api.geonames.org/neighboursJSON?geonameId='+$scope.geonameId+'&username=stewartj')
        .then(function(data){
            var neighbors = "";
           angular.forEach(data.data.geonames, function(value, key) {
            neighbors = neighbors + value.name + " ";
        });
        $scope.neighbors = neighbors;   
        }, function(){
            console.log('something went wrong');
            })
        })
