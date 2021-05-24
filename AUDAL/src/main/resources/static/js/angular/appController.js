app.controller('homeController', function($rootScope, $scope, 
		$http, $location, $route, $cookies, $window){	
	
	 if ($rootScope.authenticated) {
         $location.path("/");
         $scope.error = false;
       } 
	 else if($cookies.get('access') != null){//Try to reactivate access from cookies
		 var headers = 'Basic ' + $cookies.get('access');
		 $http.get('user', {
				headers : headers
			}).then(function(response) {
				if (response.data.name) {
					$rootScope.authenticated = true;
					//Retrieve login
					$rootScope.login = atob($cookies.get('login'));
					$location.path("/");
					
				} else {
					$rootScope.authenticated = false;
					$location.path("/login");
				}	
			});
		 	
	 }
	 else {

         $location.path("/login");
         $scope.error = true;
       }
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
});



app.controller('loginController', function($rootScope, $scope, 
		$http, $location, $route, $cookies){		
	$scope.credentials = {};
	
	
	

	var authenticate = function(credentials, callback) {
		var headers = $scope.credentials ? {
			authorization : "Basic "
					+ btoa($scope.credentials.username + ":"
							+ $scope.credentials.password)
			} : {};
			
		$http.get('user', {
			headers : headers
		}).then(function(response) {
			if (response.data.name) {
				$rootScope.authenticated = true;
				$rootScope.login = $scope.credentials.username;
			} else {
				$rootScope.authenticated = false;
			}
			callback && callback();
		}, function() {
			$rootScope.authenticated = false;
			callback && callback();
		});
	}
	
	authenticate();
	
	$scope.loginUser = function() {
	      authenticate($scope.credentials, function() {
	          if ($rootScope.authenticated) {
	            $location.path("/");
	            $scope.error = false;
				$rootScope.rootErrorMessage = false;
	            //Save access in cookies
	            $cookies.put("access", btoa($scope.credentials.username + ":"
								+ $scope.credentials.password));
	            $cookies.put("login", btoa($scope.credentials.username));
	          } else {
	            $location.path("/login");
	            $scope.error = true;
	            //$rootScope.rootErrorMessage = "####";

	          }
	     });
	};
});




app.controller('logoutController', function($rootScope, $scope, 
		$http, $location, $route, $cookies){	
	$cookies.remove('access');
	$http.post('logout', {}).finally(function() {
	    $rootScope.authenticated = false;
	    $location.path("/login");
	});
});


app.filter('safeHtml', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});





