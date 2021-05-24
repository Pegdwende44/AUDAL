


//MANAGING LEFT SUBSECTIONS REDUCE/EXPAND ANIMATIONS
app.controller('leftController', ['$scope', function($scope) {
	//Expand Left Sub Section
    $scope.expandLS = function(subsectionId) {   
    	var expandBtn = subsectionId+"ExpandBtn";
    	var reduceBtn = subsectionId+"ReduceBtn";
        //$("#"+subsectionId).show();
        $("#"+subsectionId).toggle("slow");
        $("#"+expandBtn).hide();
        $("#"+reduceBtn).show();
    };
    
  //Reduce Left Sub Section
    $scope.reduceLS = function(subsectionId) {        
    	var expandBtn = subsectionId+"ExpandBtn";
    	var reduceBtn = subsectionId+"ReduceBtn";
        //$("#"+subsectionId).hide();
    	 $("#"+subsectionId).toggle("slow");
        $("#"+expandBtn).show();
        $("#"+reduceBtn).hide();
    };
    
  
    
    
   
}]);




//MANAGING RIGHT SUBSECTIONS DISPLAY AND REDUCE/EXPAND ANIMATIONS
app.controller('rightController', ['$scope', function($scope) {
	//Activate doc analyses
    $scope.docAnalysis = function() {   
    	$("#tableAnalysis").removeClass("active");
        $("#docAnalysis").addClass("active");
        $scope.analysis.docAnalysis = true;
        $scope.analysis.generalQuery();	
        
    };
    
  //Activate tables analyses
    $scope.tableAnalysis = function() {        
    	$("#docAnalysis").removeClass("active");
        $("#tableAnalysis").addClass("active");
        $scope.analysis.docAnalysis = false;
        $scope.analysis.generalQuery();	
    };
    
 
 

    
    $scope.setActiveDocAnalysis = function(analysis, titleId){
    	$(".docAnalysisItemTitle").removeClass("active");
    	$("#"+titleId).addClass("active");
    	$scope.analysis.activeDocAnalysis = analysis;
    	$scope.analysis.generalQuery();	
    }; 
    
    
    $scope.setActiveTabAnalysis = function(analysis, titleId){
    	$(".tabAnalysisItemTitle").removeClass("active");
    	$("#"+titleId).addClass("active");
    	$scope.analysis.activeTabAnalysis = analysis;
    	$scope.analysis.generalQuery();	
    }; 
    
   
}]);