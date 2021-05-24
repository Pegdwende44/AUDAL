

// MANAGING DOC HIGHLIGHTS VISUALISATION
app.controller('docHighlightsController', ['$scope','DocService', 'NgTableParams','$q','stat', function($scope, DocService, NgTableParams, $q, stat) {
	
	
	var init = function(){
		$scope.analysis.docHighlights = {};
		$scope.analysis.docHighlights.fragmentSizes = [{"name":"50 char", "value":50},{"name":"100 char", "value":100},	{"name":"250 char", "value":250},{"name":"auto", "value":0}];
		/*$scope.terms.listPositiveTerms.push("client");
		$scope.terms.listPositiveTerms.push("relation");
		$scope.terms.listPositiveTerms.push("marketing");
		$scope.terms.listPositiveTerms.push("publicité");*/
	
	};
	init();
	
	
	
	var hideShowHighlights = function(identifier){
		$('#list-highlights-'+identifier).toggle('slow');
	}
	
	$scope.analysis.docHighlights.hideShowHighlights = hideShowHighlights;
	
			
	// Submit event handler
	//preElapsedTime to consider time for data loading
	var query = function(preElapsedTime=0){
		$scope.analysis.docHighlights.errorMessage = null;
		$scope.analysis.docHighlights.queryResults = [];
		const start = new Date().getTime();
		$scope.analysis.docHighlights.isQuerying = true;
    	let positiveTerms = $scope.terms.listPositiveTerms.concat($scope.terms.additionalPositiveTerms);
    	let negativeTerms = $scope.terms.listNegativeTerms.concat($scope.terms.additionalNegativeTerms);
		
		//$scope.analysis.docHighlights.selectedFragmentLimit = 10;
		if(($scope.analysis.data.identifiers.length == undefined || 
				$scope.analysis.data.identifiers.length > 0) && 
				positiveTerms.length > 0){
			
			//$scope.terms.strictMatching
			let promise = DocService.loadHighlights(
					$scope.analysis.data.identifiers, 
					positiveTerms, 
					$scope.terms.strictMatching, 
					$scope.terms.fuzzySearch, 
					$scope.analysis.docHighlights.selectedFragmentSize['value']);
			promise.then(function(data){
				//Post processing
				
				if(data.length > 0){
					let titles = [];
					for([key, val] of Object.entries($scope.analysis.data.objects)){
						titles.unshift({"identifier":key, "title":val});
					}
					//let temp = _.intersectionBy(data, titles, 'identifier');
					//let empty = _.differenceWith(data, temp, _.isEqual);
					
					let temp2 = _.merge(data, titles)
			
					$scope.analysis.docHighlights.highlights = temp2;
					
					
				}else{
					$scope.analysis.docHighlights.highlights = [];
				}
				const queryTime = (new Date().getTime() - start);
				const elapsed = (preElapsedTime + queryTime)/1000;
				//Statistiques
				$scope.analysis.docHighlights.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length });
				$scope.analysis.docHighlights.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
				$scope.analysis.docHighlights.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
				$scope.analysis.docHighlights.isQuerying = false; //in all cases end querying
				
			}, function(err){
				console.log("error"+err);
				$scope.analysis.docHighlights.errorMessage = "Error while loading highlights";
			});
		}
		else{
			$scope.analysis.docHighlights.errorMessage = "Missing data";
			$scope.analysis.docHighlights.highlights = [];
			const queryTime = (new Date().getTime() - start);
			const elapsed = (preElapsedTime + queryTime)/1000;
			//Statistiques
			///$scope.analysis.docHighlights.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length});
			//$scope.analysis.docHighlights.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
			//$scope.analysis.docHighlights.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
			$scope.analysis.docHighlights.isQuerying = false; //in all cases end querying
			//console.log($scope.analysis.docHighlights.errorMessage);
		}
	
    };
	
	$scope.analysis.docHighlights.query = query;
      
}]);