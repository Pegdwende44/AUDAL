//MANAGING TERMS FILTERING

 app.controller('tablesController', ['$scope','GlobalService',  function($scope, GlobalService) {
	
	 $scope.tables.reset = function(){
		 //console.log("reset");
		 $scope.tables.selectedTableIds = [];
		 for(let item of  $scope.tables.listTables){
			 $scope.tables.selectedTableIds.push(item['identifier']);
		}
	
	 };
            
            
            
}]);


