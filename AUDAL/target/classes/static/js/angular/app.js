var app=angular.module('audalsystem', ['ngRoute', 'ngResource', 'ngCookies', 'ngTable']);

//Routes handling
app.config(function($routeProvider){
	$routeProvider
	
	.when('/', {
		templateUrl:'/template/home.html',
		controller:'homeController',
	})
	
	
	.when('/login',{
		templateUrl : '/login/login.html',
		controller: 'loginController',
	})
	
	.when('/logout',{
		templateUrl : '/template/home.html',
		controller: 'logoutController',
	})
	
	.otherwise({
		redirectTo:'/',
	});
	
})

//Handling urls encoding problem
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);



app.config(['$httpProvider', function($httpProvider) {
	  //$httpProvider.interceptors.push('AuthInterceptor');
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}]);





