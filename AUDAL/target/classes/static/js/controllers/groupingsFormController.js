



// MANAGING GROUPINGS FILTERING
app.controller('groupingsController', ['$scope', 'DocService', function($scope, DocService) {
	  
	
	
	// SHOW / HIDE GROUPINGS
	
    $scope.groupings.reduceExpandGrouping = function(grouping){
    	$("#"+grouping+"GroupingShowIcon").toggle();
    	$("#"+grouping+"GroupingHideIcon").toggle();
    	$("#"+grouping+"GroupingItems").toggle("slow");	
    }
    
    $scope.groupings.checkUncheckGrouping = function(grouping){
    	let newValue = $scope.groupings.checkedGroupings[grouping];
    	let groups = $scope.groupings.checkedGroups[grouping] ;
    		for (let [group, checkedValue] of Object.entries(groups)) {
    			$scope.groupings.checkedGroups[grouping][group] = newValue;
    		}
    	
    }
    
    
    $scope.groupings.unknowCheckGrouping = function(grouping){
    	$("#checkAll"+grouping).prop("indeterminate", true);
    }
    
    
	// Reset form
    $scope.groupings.reset = function(){
    	$scope.groupings.matchingSelected();
    	for (let [grouping, groups] of Object.entries($scope.groupings.checkedGroups)) {
    		for (let [group, checkedValue] of Object.entries(groups)) {
    			$scope.groupings.checkedGroups[grouping][group] = true;
    		}
    	}
    	// Query
    	 $scope.analysis.generalQuery();
    	
    	
    };
    
    
    
 // Query form
    $scope.analysis.generalQuery();
      
}]);



