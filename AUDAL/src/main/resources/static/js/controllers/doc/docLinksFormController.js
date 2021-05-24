

// MANAGING DOC HIGHLIGHTS VISUALISATION
app.controller('docLinksController', ['$scope','DocService', 'NgTableParams','$q','stat', function($scope, DocService, NgTableParams, $q, stat) {
	
	
	
	var init = function(){
		$scope.analysis.docLinks = {};
		//$scope.analysis.docLinks.vocabOptions = [{"name":"CLASSIC","value":"global_vocabulary"},{"name":"AURA-PMI","value":"aura_pmi"}];
		//$scope.analysis.docLinks.visuOptions = ['Groups-wheel', 'Groups-graph', 'Docs-graph'];
		$scope.analysis.docLinks.visuOptions = ['Groups-wheel'];//['Groups-wheel', 'Groups-graph'];
		
	};
	init();
	
	
	
	
	var verif = function(){
		if($scope.analysis.data.identifiers.length != undefined 
				&& $scope.analysis.data.identifiers.length > 0 
				//&& $scope.analysis.docLinks.threshold != null
				&& $scope.analysis.docLinks.selectedLabel != null
				&& $scope.analysis.docLinks.selectedVocab != null){
			return true;
		}else{
			return false;
		}
			
	}
	
	
			
	// Submit event handler
	//preElapsedTime to consider time for data loading
	var query = function(preElapsedTime=0){
		
		$scope.analysis.docLinks.errorMessage = null;
		$scope.analysis.data.centerSectionTitle = "Documents Links";		
		$scope.analysis.docLinks.queryResults = [];
		const start = new Date().getTime();
		$scope.analysis.docLinks.isQuerying = true;
		
		
		if(verif()){
			
			
			var clusteringLabels = null;
			var docsLinks = null;
			
			var groupData = null;
			var groupsNames = null;
			switch($scope.analysis.docLinks.selectedVisu){
				
				case 'Groups-wheel':
				case 'Groups-graph':
					let label = $scope.analysis.docLinks.selectedLabel.groupingName;
					const promise4 = DocService.loadGroupsLinks2(
							$scope.analysis.data.identifiers, 
							$scope.analysis.docLinks.selectedVocab.vocabulary, 
							//$scope.analysis.docLinks.threshold, 
							label, 
							true,
							$scope.groupings.listGroupings);
					//console.log($scope.analysis.docLinks.selectedVocab.value);
					promise4.then(function(groupsData){
						
						//groupsData = data;	
						//console.log(groupsData);
						
						//Groups-Wheel
						let groupWheelChartData = {};
						groupWheelChartData.links = groupsData.links;
						groupWheelChartData.nodes = groupsData.nodes;
						//console.log(groupWheelChartData.links);
						//console.log(groupWheelChartData.nodes);
						$scope.analysis.docLinks.groupWheelChartData = groupWheelChartData;
						
						
						//Groups-Graph
						/*let groupGraphChartData = {};
						groupGraphChartData.links = groupsData.links.obj;
						groupGraphChartData.nodes = groupsData.nodes.obj;
						$scope.analysis.docLinks.groupGraphChartData = groupGraphChartData;
						*/
						
						//Statistics
						const queryTime = (new Date().getTime() - start);
						const elapsed = (preElapsedTime + queryTime)/1000;	
						//Statistiques
						$scope.analysis.docLinks.queryResults.unshift({"item":"Result count", "value": $scope.analysis.data.identifiers.length});
						$scope.analysis.docLinks.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
						$scope.analysis.docLinks.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
						$scope.analysis.docLinks.isQuerying = false; //in all cases end querying
						
						
					}, function(err){
						$scope.analysis.docLinks.isQuerying = false;
						console.log("Error in loading groups links");
						$scope.analysis.docLinks.errorMessage = "Error while loading group links";
					});
					
						break;
				default:
					console.log("Error in links analysis choice");
				$scope.analysis.docLinks.errorMessage = "Bad analysis choice";
				$scope.analysis.docLinks.isQuerying = false;
			}
			
		}
		else{
			$scope.analysis.docLinks.errorMessage = "Missing data";
			const queryTime = (new Date().getTime() - start);
			const elapsed = (preElapsedTime + queryTime)/1000;	
			//Statistiques
			$scope.analysis.docLinks.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length});
			$scope.analysis.docLinks.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
			$scope.analysis.docLinks.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
			$scope.analysis.docLinks.isQuerying = false; //in all cases end querying
		}
		
    };
	
	$scope.analysis.docLinks.query = query;
      
}]);