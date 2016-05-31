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
    .controller('CountriesCtrl', function($scope, $http){

    	$http.get('http://api.geonames.org/countryInfoJSON?username=stewartj')
    	.then(function(data){
    		$scope.countryNames = data.data.geonames;
    	},
    		function(){
    		console.log('fail')	
    		}
    	);

    })
    .controller('DetailCtrl', function($scope){

    })