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
    .factory("countryData", function($http) {
        return function() {
            return $http.get('http://api.geonames.org/countryInfoJSON?username=stewartj')
        };
    })
    .factory("capitalPopulationData", function($http) {
        return function(capital, code) {
            return $http.get('http://api.geonames.org/searchJSON?name_equals='+capital+'&country='+code+'&username=stewartj')
        };
    })
    .factory("countryNeighborData", function($http) {
        return function(geonameId) {
            return $http.get('http://api.geonames.org/neighboursJSON?geonameId='+geonameId+'&username=stewartj')
        };
    })
    .controller('HomeCtrl', function($scope) {
        //empty for now
    })
    .controller('CountriesCtrl', function($scope, $rootScope, countryData, $http){
    	countryData()
    	.then(function(data){
    		$scope.countryNames = data.data.geonames;
    	},
    		function(){
    		console.log('fail')	
    		}
    	);

    })
    .controller('DetailCtrl', function($scope, $http, $routeParams, countryData, capitalPopulationData, countryNeighborData){
 
        // get ID from country page 
    	$scope.selectedCountry = $routeParams.countryCode;

    
        //get country data from factory
        countryData()
        .then(function(data){
            // $scope.countryNames = data.data.geonames;
            $scope.countryName = data.data.geonames[$scope.selectedCountry].countryName;
            $scope.population = data.data.geonames[$scope.selectedCountry].population;
            $scope.countryCode = data.data.geonames[$scope.selectedCountry].fipsCode;
            $scope.area = data.data.geonames[$scope.selectedCountry].areaInSqKm;
            $scope.capital = data.data.geonames[$scope.selectedCountry].capital;
            $scope.geonameId = data.data.geonames[$scope.selectedCountry].geonameId;
            return capitalPopulationData($scope.capital, $scope.countryCode);
        },
            function(){
            console.log('fail') 
            }
        )

        .then(function(data) {
            console.log(data);
      //  Store the profile, now get the permissions.
        if(data.data.geonames[0]['population']){
        $scope.capitalPopulation = data.data.geonames[0]['population'];
        }else{
            $scope.capitalPopulation = "unknown";
        }
        return countryNeighborData($scope.geonameId);
        }, 

        function(){
            console.log('Something went wrong')
        })


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
