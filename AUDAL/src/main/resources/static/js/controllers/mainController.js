
//MANAGING SECTIONS REDUCE/EXPAND BEHAVIOUR
app.controller('mainController',  function($scope, $location, $q, DocService, GlobalService, $http, $rootScope,  NgTableParams, $cookies,TabService) {
	//SCOPE DATA
	$scope.analysis = {};
	
	//ANIMATIONS
	var initAnimations = function(){
		
		let defer = $q.defer();
		
		//Reduce Left Section
	    $scope.reduceL = function() {
	        $("#leftSection").removeClass("leftDefault").addClass("leftMin");
	        if( $("#centerSection").hasClass("centerDefault")){
	        	$("#centerSection").removeClass("centerDefault").addClass("centerL");
	        }else{//(centerR)
	        	$("#centerSection").removeClass("centerR").addClass("centerLR");
	        }
	        $("#leftExpanded").hide();
	        $("#leftReduced").show();
	    };
	    
	  //Reduce Right Section
	    $scope.reduceR = function() {
	        $("#rightSection").removeClass("rightDefault").addClass("rightMin");
	        if( $("#centerSection").hasClass("centerDefault")){
	        	$("#centerSection").removeClass("centerDefault").addClass("centerR");
	        }else{//(centerL)
	        	$("#centerSection").removeClass("centerL").addClass("centerLR");
	        }
	        

	        $("#rightExpanded").hide();
	        $("#rightReduced").show();
	    };
	    
	  //Expand Left Section
	    $scope.expandL = function() {
	        $("#leftSection").removeClass("leftMin").addClass("leftDefault");
	        if( $("#centerSection").hasClass("centerL")){
	        	$("#centerSection").removeClass("centerL").addClass("centerDefault");
	        }else{//(centerLR)
	        	$("#centerSection").removeClass("centerLR").addClass("centerR");
	        }
	        
	        $("#leftReduced").hide();
	        $("#leftExpanded").show();
	       
	    };
	    
	    
	  //Expand Right Section
	    $scope.expandR = function() {
	        $("#rightSection").removeClass("rightMin").addClass("rightDefault");
	        if( $("#centerSection").hasClass("centerR")){
	        	$("#centerSection").removeClass("centerR").addClass("centerDefault");
	        }else{//(centerLR)
	        	$("#centerSection").removeClass("centerLR").addClass("centerL");
	        }
	        
	        $("#rightReduced").hide();
	        $("#rightExpanded").show();
	    };
	    
	    defer.resolve();
	    return defer.promise;
	}
  
    
    //INIT TERMS FUNCTION
	var initTerms = function(){
		 ////// TERMS FILTERING FORM
	    $scope.terms = {};
		$scope.terms.listPositiveTerms = [];
		$scope.terms.listNegativeTerms = [];
		$scope.terms.strictMatching = 0;
		$scope.terms.fuzzySearch = 1;
		$scope.terms.semanticResources = null;
		$scope.terms.selectedSemanticResource = "None";
		$scope.terms.extendTerms = null;
		$scope.terms.additionalPositiveTerms = [];
		$scope.terms.additionalNegativeTerms = [];
	}
	
	
	
	   //INIT TABLES FUNCTION
	var initTables = function(){
		 ////// TABLES FILTERING FORM
	    $scope.tables = {};
	    $scope.tables.listTables = [];
	    $scope.tables.selectedTables = null;
	    $scope.analysis.activeTabAnalysis = 'tabProperties';
	    
	    
	    
	    //INIT TAB PROPERTIES ANALYSIS
	    $scope.analysis.tabProperties = {};
	    $scope.analysis.tabProperties.query = function(){};
	    //$scope.analysis.tabProperties.selectedProperty = null;
	    //$scope.analysis.tabProperties.selectedVisu = null;
	}
	
	var loadTables = function(){
		let positiveTerms = $scope.terms.listPositiveTerms.concat($scope.terms.additionalPositiveTerms);
    	let negativeTerms = $scope.terms.listNegativeTerms.concat($scope.terms.additionalNegativeTerms);
    	
	    let promise = TabService.loadTables(
				$scope.groupings.checkedGroups, 
				positiveTerms,
				negativeTerms,
				$scope.terms.strictMatching,
				$scope.terms.fuzzySearch,	
				'title'	);
	
		promise.then(function(data){
			for(let [key, val] of Object.entries(data)){
				 $scope.tables.listTables.push({'identifier':key, 'title':val});
			}
			$scope.tables.selectedTables =  $scope.tables.listTables;
		},
		function(errResponse){
			console.log("Error while loading tables");
			$location.url("#/logout");
		});
	}
	
	
	
	
	//INIT GROUPINGS FUNCTION
	var initGroupings = function(){	
		$scope.groupings = {};
	    //$scope.groupings.matching = 1;
	    $scope.groupings.listGroupings = null;
	    $scope.groupings.checkedGroups = null;
	   
	}
	
	//LOAD GROUPINGS
	var loadGroupings = function(){
		let defer = $q.defer();
		let promise =  GlobalService.loadListGroupings();
	    promise.then(function(data) {
	    	$scope.groupings.listGroupings = data['listGroupings'];
	    	$scope.groupings.checkedGroups = data['checkedGroups'];
	    	$scope.groupings.checkedGroupings = data['checkedGroupings'];
	    	defer.resolve();
	    	//console.log($scope.groupings.listGroupings);
	    	//console.log($scope.groupings.checkedGroups);
	    });
		return defer.promise;
	};
	
	
	//LOAD DOC REPRESENTATIONS
	var loadDocRepresentations = function(){
		let defer = $q.defer();
		$scope.analysis.data.keyValueRepresentations = [];
		$scope.analysis.data.embeddingRepresentations = [];
		$scope.analysis.data.representationsWithSim = [];
		
		let promise1 =  DocService.loadDocRepresentations();
	    promise1.then(function(data) {
	    	for(item of data){
				if(item.format == "key-values"){
					$scope.analysis.data.keyValueRepresentations.push(item);
				}else if (item.format == "embedding"){
					$scope.analysis.data.embeddingRepresentations.push(item);
				}
			}
	    	//console.log($scope.groupings.listGroupings);
	    	//console.log($scope.groupings.checkedGroups);
	    });

		let promise2 =  DocService.loadDocRepresentationsWithSim();
	    promise1.then(function(data) {
	    	$scope.analysis.data.representationsWithSim = data;
	    });


		$q.all([promise1, promise2]).then(function(data){
			defer.resolve(data);
		}, function(errResponse){
			defer.reject(errResponse);
		});
		return defer.promise;
	};
	
	

	// INIT DOC PROPERTIES FUNCTION
	var initDocProperties = function(){
		
		$scope.analysis.docProperties = {};
		$scope.analysis.docProperties.query = function(){};
	   $scope.analysis.docProperties.isQuerying = false;	
	   $scope.analysis.docProperties.queryResults = [];
	   
	    //Function to handle visu selection
	   var updateActiveVisualisations = function(query=true){
			var listVisualisations = 
			{"Grouping":["Barchart", "Piechart", "Polar"],
			"STRING":["Table"],
			"INTEGER":["Boxplot"],
			"LocalDate":["Timeline", "Table"]};
			
			for (var property in $scope.analysis.docProperties.properties){
				if($scope.analysis.docProperties.properties[property]['name'] == $scope.analysis.docProperties.selectedProperty){
					$scope.analysis.docProperties.activeVisualisations = listVisualisations[$scope.analysis.docProperties.properties[property]['type']];
					$scope.analysis.docProperties.selectedVisualisation = listVisualisations[$scope.analysis.docProperties.properties[property]['type']][0];
				}
			}
			if(query){//Query only when it is not init
				$scope.analysis.docProperties.query();
			}
			
		}
	   $scope.analysis.docProperties.updateActiveVisualisations = updateActiveVisualisations; 
	 //Other data
	   
	}
	
	var loadDocProperties = function(){
	let defer = $q.defer();
	// FORM INITIALIZATION  
	let promise1 =  DocService.loadDocProperties();
    
	promise1.then(function(data) { //After form data loading
    	$scope.analysis.docProperties.selectedProperty = "title";
    	$scope.analysis.docProperties.properties = data;
    	$scope.analysis.docProperties.updateActiveVisualisations(false);
    	$scope.analysis.docProperties.selectedVisualisation = "Table";
		//return defer.promise;
    	defer.resolve();
    });
	
   return defer.promise;
};	
	
	
	
	
	
	
	// GENERAL QUERY
	
	//INIT GENERAL DATA AND FUNCTIONS
	var initGeneral = function(){
		$scope.errorMessage = null;
		$scope.analysis.data = {};
		$scope.analysis.data.isQuerying = false;
		$scope.analysis.docAnalysis = true;
		$scope.analysis.activeDocAnalysis = 'docProperties';
	    $scope.analysis.data.centerSectionTitle = "Document Properties";
	    
	    
		//General Query
		var generalQuery = function(){
	    	$scope.analysis.data.isQuerying = true;
	    	const start = new Date().getTime();
	    	if($scope.terms.addPositiveTerm != undefined){
	    		$scope.terms.addPositiveTerm();
	    	}
	    	if($scope.terms.addNegativeTerm != undefined){
	    		$scope.terms.addNegativeTerm();
	    	}
	    	
	    	let positiveTerms = $scope.terms.listPositiveTerms.concat($scope.terms.additionalPositiveTerms);
	    	let negativeTerms = $scope.terms.listNegativeTerms.concat($scope.terms.additionalNegativeTerms);
	    	
	    	if($scope.analysis.docAnalysis){ //Documents query
		    	let promise1 = DocService.loadDocuments(
						$scope.groupings.checkedGroups, 
						positiveTerms,
						negativeTerms,
						$scope.terms.strictMatching,
						$scope.terms.fuzzySearch,	
						'title'	);
				promise1.then(function(data){
					// Updatation
					$scope.analysis.data.isQuerying = false;
					$scope.analysis.data.identifiers = Object.keys(data);	
					$scope.analysis.data.objects = data ;
					const elapsedTime = (new Date().getTime() - start) ;
					//console.log($scope.terms.additionalPositiveTerms);
					
					switch($scope.analysis.activeDocAnalysis){
						case 'docProperties':
							$scope.analysis.data.centerSectionTitle = "Document Properties";
							
							$scope.analysis.docProperties.query(elapsedTime);
							break;
						case 'docCrossAnalysis':
							$scope.analysis.data.centerSectionTitle = "Document Correlation Analysis";	
							$scope.analysis.docCrossAnalysis.query(elapsedTime);
							break;
						case 'docHighlights':
							$scope.analysis.data.centerSectionTitle = "Document Highlights";	
							$scope.analysis.docHighlights.query(elapsedTime);
							break;
						case 'docScores':
							$scope.analysis.data.centerSectionTitle = "Document Scores";	
							$scope.analysis.docScores.query(elapsedTime);
							break;
						case 'docTopKw':
							$scope.analysis.data.centerSectionTitle = "Document Top Keywords";	
							$scope.analysis.docTopKw.query(elapsedTime);
							break;
						case 'docLinks':
							$scope.analysis.data.centerSectionTitle = "Document Links";	
							$scope.analysis.docLinks.query(elapsedTime);
							break;
						case 'docClustering':
							$scope.analysis.data.centerSectionTitle = "Document Clustering";	
							$scope.analysis.docClustering.query(elapsedTime);
							break;
						default:
							console.log("ERROR IN DOC ANALYSIS CHOICE");
						}
					},
					function(errResponse){
						console.log("****************** Error in general INIT Documents ****************");
						
						$scope.analysis.data.isQuerying = false;
						$cookies.put('restartMessage',"We need to restart due to an error!");
						$cookies.remove("login");
						$cookies.remove("access");
						$rootScope.authenticated = false;
						$scope.analysis.docProperties.errorMessage = "We need to restart due to an error!";
						//console.log("We need to restart due to an error!");
						$location.path("/login")
						console.log("We need to restart due to an error!");
						//$cookies.remove('access');
						/*$http.post('logout', {}).finally(function() {
						    $rootScope.authenticated = false;
		 					
						    $location.path("/login");
							$rootScope.rootErrorMessage = "We need to restart due to an error!";
							console.log("LOGOUT");
						});*/
						
					});
					
				}else{//Tables analysis
					//console.log("LOAD TABLES");
					let promise2 = TabService.loadTables(
							$scope.groupings.checkedGroups, 
							positiveTerms,
							negativeTerms,
							$scope.terms.strictMatching,
							$scope.terms.fuzzySearch,	
							'title'	);
					promise2.then(function(data){
						// Updatation
						$scope.analysis.data.isQuerying = false;
						let oldSelectedTableIds = $scope.tables.selectedTableIds;
						//Update list of tables
						$scope.tables.listTables = [];
						for(let [key, val] of Object.entries(data)){
							 $scope.tables.listTables.push({'identifier':key, 'title':val});
						}
						//var hasMatch = arr.some(a => match.some(m => a === m));
						
						if(oldSelectedTableIds == undefined || oldSelectedTableIds == null || oldSelectedTableIds.length == 0){
							$scope.tables.selectedTableIds =  Object.keys(data);
						}else{
							$scope.tables.selectedTableIds =  _.intersection(Object.keys(data),oldSelectedTableIds);
						}
						 $scope.tables.selectedTables = _.filter($scope.tables.listTables, function(o) { 
							    return $scope.tables.selectedTableIds.includes(o.identifier); 
						 });
						 
						const elapsedTime = (new Date().getTime() - start) ;
						
					
					switch($scope.analysis.activeTabAnalysis){
						case 'tabProperties':
							$scope.analysis.data.centerSectionTitle = "Table Properties";	
							$scope.analysis.tabProperties.query(elapsedTime);
							break;
						case 'tabColumns':
							$scope.analysis.data.centerSectionTitle = "Table Columns";	
							$scope.analysis.tabColumns.query(elapsedTime);
							break;
						case 'tabQueries':
							$scope.analysis.data.centerSectionTitle = "Table Data Querying";	
							$scope.analysis.tabQueries.query(elapsedTime);
							break;
						case 'tabClustering':
							$scope.analysis.data.centerSectionTitle = "Table Data Clustering";	
							$scope.analysis.tabClustering.query(elapsedTime);
							break;
						default:
							console.log("ERROR IN DOC ANALYSIS CHOICE");
						}
					},
					function(errResponse){
						console.log("****************** Error in general INIT Tables ****************");
						$scope.analysis.data.isQuerying = false;
						$cookies.put('restartMessage',"We need to restart due to an error!");
						$cookies.remove("login");
						$cookies.remove("access");
						$rootScope.authenticated = false;
						//$scope.analysis.docProperties.errorMessage = "We need to restart due to an error!";
						//console.log("We need to restart due to an error!");
						//$location.path("/login")
						$location.path("/login")
						console.log("We need to restart due to an error!");
						
					});
				}
			
	    	
	    };
	    $scope.analysis.generalQuery = generalQuery;
	};
	
	
	
	
	
	//INITIALISATIONS
	
	initAnimations();
	
	initTerms();
	initGroupings();
	initDocProperties();
	initTables();
	initGeneral();
	let p1 = loadGroupings();
	p1.then(function(data){
		let p2 = loadDocProperties();
		p2.then( function(){
				$scope.analysis.generalQuery();
				loadDocRepresentations();	
		});
		//loadTables();
	});

	//initDocHighlights();
	

		
	

		    
	
	
});



