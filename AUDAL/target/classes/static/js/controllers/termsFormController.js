//MANAGING TERMS FILTERING

 app.controller('termsController', ['$scope','DocService','GlobalService',  function($scope, DocDataAccessService, GlobalService) {
	  // Manage ON/OFF behaviour
    /*
	 * $scope.changeActive = function(objectClass, objectId) {
	 * 
	 * $("."+objectClass).removeClass("active");
	 * $("#"+objectId).addClass("active"); };
	 */	
	$scope.terms.errorMessage = "";

	$scope.terms.matchingAny = function(){
    	$(".terms-matchingType").removeClass("active");
    	$("#matchingAny").addClass("active");
    	
    	$scope.terms.strictMatching = 0;
    };
    
    $scope.terms.matchingAll = function(){
    	$(".terms-matchingType").removeClass("active");
    	$("#matchingAll").addClass("active");
    	
    	$scope.terms.strictMatching = 1;
    };
	
    
    $scope.terms.fuzzySearchOn = function(){
    	$(".fuzzySearch").removeClass("active");
    	$("#fuzzySearchOn").addClass("active");
    	
    	$scope.terms.fuzzySearch = 1;
    };
    
    $scope.terms.fuzzySearchOff = function(){
    	$(".fuzzySearch").removeClass("active");
    	$("#fuzzySearchOff").addClass("active");
    	
    	$scope.terms.fuzzySearch = 0;
    };
    
	// Add new term to positive filtering
	 $scope.terms.addPositiveTerm = function() {        
		 if($scope.terms.positiveTerm != null){
			 var tabTerms = $scope.terms.positiveTerm.split(";");
			 var temp = $scope.terms.listPositiveTerms.concat(tabTerms);
			 $scope.terms.listPositiveTerms = Array.from(new Set(temp));// Remove
			 $scope.terms.positiveTerm = null;															// duplicates
		    }	 
      };
      
      
    // Add new term to negative filtering
 	 $scope.terms.addNegativeTerm = function() {  	 
 		 if($scope.terms.negativeTerm != null){
 			 var tabTerms = $scope.terms.negativeTerm.split(";");
 			 var temp = $scope.terms.listNegativeTerms.concat(tabTerms);
 			 $scope.terms.listNegativeTerms = Array.from(new Set(temp));// Remove
																		// duplicates
 			$scope.terms.negativeTerm = null;
 		    }	 
       };
       
       
       // Remove Positive term
       $scope.terms.removePositiveTerm = function(term) { 
    	// Remove from list of terms
    	  $scope.terms.listPositiveTerms.splice( $scope.terms.listNegativeTerms.indexOf(term), 1 );
         };
         
         // Remove Negative term
         $scope.terms.removeNegativeTerm = function(term) { 
        	 // Remove from list of terms
       	  $scope.terms.listNegativeTerms.splice( $scope.terms.listNegativeTerms.indexOf(term), 1 );
            };
            
            
            
        // Reset form
            $scope.terms.reset = function(){
            	// Restaure initial values
            	$scope.terms.listPositiveTerms = [];
            	$scope.terms.listNegativeTerms = [];
            	$scope.terms.matchingAny();
            	$scope.terms.strictMatching = 0;
            	$scope.terms.fuzzySearchOn();
            	$scope.terms.fuzzySearch = 1;
            	 $scope.analysis.generalQuery();
            };
            
            
            
           //Load semantic resources
            var loadSemanticResources = function(){
            	 let promise = GlobalService.loadSemanticResources();
            	 promise.then(function(data){
            		 $scope.terms.semanticResources  = data;
            	 },function(errResponse){
            		 console.log("Error while loading semantic resources");
					$scope.terms.errorMessage = "Error while loading semantic resources";
					$scope.$apply();
            	 })
            }
            $scope.terms.loadSemanticResources = loadSemanticResources;
            $scope.terms.loadSemanticResources(); //Init
            
            
            
            // Add new resource
            $scope.terms.addSemanticResource = function(){
			$scope.terms.errorMessage = "";
			$scope.terms.okMessage = "";
			//$scope.$apply();
            	//$("#newSemanticResourceFile")
				if(document.getElementById('newSemanticResourceFile').files.length > 0 && $scope.terms.newSemanticResourceName != null){
					
				
            	var fichier = document.getElementById('newSemanticResourceFile').files[0];
            	var lecture = new FileReader();
            	lecture.onloadend = function(evenement){
	            	try{
	            		temp = evenement.target.result;
	            		var data = JSON.parse(temp);
						console.log($scope.terms.newSemanticResourceType);
	            		if($scope.terms.newSemanticResourceType == 'dictionary'){
	            			terms = data;
	            			let promise1 = GlobalService.createDictionary($scope.terms.newSemanticResourceName, terms);
	            			promise1.then(function(){
	            				$scope.terms.newSemanticResourceName = null;
	            				$scope.terms.loadSemanticResources();//Re-init
								$scope.terms.okMessage = "A semantic resource has been added suscessfully!"
	            			},function(err){
	            				console.log("Error while adding a dictionary");
								$scope.terms.errorMessage = "Error while adding a dictionary";
	            			});
	            		}else{//Thesaurus
	            			let pairs = data;
	            			let promise2 = GlobalService.createThesaurus($scope.terms.newSemanticResourceName, pairs);
	            			promise2.then(function(){
	            				$scope.terms.newSemanticResourceName = null;
	            				$scope.terms.loadSemanticResources();//Re-init
								$scope.terms.okMessage = "A semantic resource has been added suscessfully!"
	            			},function(err){
	            				console.log("Error while adding a thesaurus");
								$scope.terms.errorMessage = "Error while adding a thesaurus";
								$scope.$apply();
	            			});
	            		}
	            	//Traitez ici vos données binaires. Vous pouvez par exemple les envoyer à un autre niveau du framework avec $http ou $ressource
	            	//console.log(data);
	            	//console.log(evenement.target);
	            	}
	            	catch(error){
						$scope.terms.errorMessage = "ERROR while loading file "+error;
	            		console.log("ERROR while loading file"+error);
						
						$scope.$apply();
	            	}
            	}
            	lecture.readAsBinaryString(fichier);
            	}
				else{
					$scope.terms.errorMessage = "Missing data";
					$scope.$apply();
				}
            };
            
            
            //Remove a semanticResource
            var removeSemanticResource = function(id, type){
            	let promise = GlobalService.removeSemanticResources(id, type);
            	promise.then(function(){
            		$scope.terms.loadSemanticResources();//Re-init
					$scope.terms.okMessage = "A semantic resource has been deleted successfully";
            	}, function(err){
            		console.log("Error while deleting a semantic resource");
					$scope.terms.errorMessage = "Error while deleting a semantic resource";
					//$scope.$apply();
            	})
            	
            }
            $scope.terms.removeSemanticResource = removeSemanticResource;
            
            
            
            //Load semantic resource and extend 
            var extendTerms = function(){
				///console.log("start extend");
            	//Re-init
        		$scope.terms.additionalPositiveTerms = [];
        		$scope.terms.additionalNegativeTerms = [];
            	//console.log($scope.terms.selectedSemanticResource);
        		if($scope.terms.selectedSemanticResource != "None" &&  $scope.terms.selectedSemanticResource != null){
            	
            		let id = $scope.terms.selectedSemanticResource;
            		let resource = _.filter($scope.terms.semanticResources, {'id': id});
					if(resource.length > 0){
						
					
            		let type = resource[0]['resourceType'];
            		
            		if(type == "dictionary"){
            			let promise1 = GlobalService.loadDictionary(id);
            			promise1.then(function(data){
            				if( $scope.terms.listNegativeTerms.length > $scope.terms.listPositiveTerms.length){
            					$scope.terms.additionalNegativeTerms.push(...data);
            				}
            				else{
            					$scope.terms.additionalPositiveTerms.push(...data);
            				}
            				
            				
            			},
            			function(errResponse){
            				console.log("Error while extending query terms with dictionary");
							$scope.terms.errorMessage = "Error while extending query terms with dictionary";
							$scope.$apply();
            			});
            		}else{//Thesaurus
						console.log("thesaurus");
            			let promise2 = GlobalService.loadThesaurus(id);
            			promise2.then(function(data){
							console.log(data);
            				if( $scope.terms.listPositiveTerms.length >= $scope.terms.listNegativeTerms.length){
            					for (term of $scope.terms.listPositiveTerms){
            						if(Object.keys(data).includes(term)){
            							$scope.terms.additionalPositiveTerms = $scope.terms.additionalPositiveTerms.concat(data[term]);
										
            						}
            					}	
            				}
            				else if ($scope.terms.listNegativeTerms.length > 0){//Add to negative terms
            					for (term of $scope.terms.listNegativeTerms){
            						if(Object.keys(data).includes(term)){
            							$scope.terms.additionalNegativeTerms = $scope.terms.additionalNegativeTerms.concat(data[term]);
            						}
            					}	
            				}
            				//console.log(data);
            			console.log($scope.terms.additionalPositiveTerms);
						console.log($scope.terms.additionalNegativeTerms);
            			},
            			function(errResponse){
            				console.log("Error while extending query terms with thesaurus");
							$scope.terms.errorMessage = "Error while extending query terms with thesaurus";
							$scope.$apply();
            			});
            		}
            		
            	}
			}
            };
            $scope.terms.extendTerms = extendTerms;
            
            
$scope.terms.initMessages = function(){
	$scope.terms.errorMessage = "";
	$scope.terms.okMessage = "";
}
            
            
}]);


