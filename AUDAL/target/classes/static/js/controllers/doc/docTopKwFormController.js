

// MANAGING DOC HIGHLIGHTS VISUALISATION
app.controller('docTopKwController', ['$scope','DocService', 'GlobalService','$q','stat', function($scope, DocService, GlobalService, $q, stat) {
	
	
	var init = function(){
		$scope.analysis.docTopKw = {};
		$scope.analysis.docTopKw.visuOptions = ['Barchart', 'Wordcloud'];
		//$scope.analysis.docTopKw.vocabOptions = [{"name":"AURA-PMI","value":"aura_pmi"},{"name":"CLASSIC","value":"global_vocabulary"}, {"name":"ALTERNATIVE", "value":"alternative_vocabulary"}];
		//$scope.analysis.docTopKw.filterOptions = [{"name":"None","value":""},{"name":"DICO 1","value":"dico1"}];
		//$scope.analysis.docScores.orderOptions = [{"name":"Score","value":'score'},{"name":"Group name","value":'group'}];
		$scope.analysis.docTopKw.simpleAnalysis = true;
	};
	init();
	
	
	$scope.analysis.docTopKw.activateSimpleAnalysis = function(){
		$scope.analysis.docTopKw.simpleAnalysis = true;
		//$scope.analysis.docTopKw.selectedVisu = null;
		$(".kw-analysisType").removeClass("active");
		$("#kwSimpleAnalysis").addClass("active");
		$scope.analysis.docTopKw.visuOptions = ['Barchart', 'Wordcloud'];
		$scope.analysis.docTopKw.selectedVisu = $scope.analysis.docTopKw.visuOptions[0];
	}
	
	$scope.analysis.docTopKw.deactivateSimpleAnalysis = function(){
		$scope.analysis.docTopKw.simpleAnalysis = false;
		//$scope.analysis.docTopKw.selectedVisu = null;
		$(".kw-analysisType").removeClass("active");
		$("#kwAdvancedAnalysis").addClass("active");
		$scope.analysis.docTopKw.visuOptions = ['HeatMap'];
		$scope.analysis.docTopKw.selectedVisu = $scope.analysis.docTopKw.visuOptions[0];
	};
	
	
	var verif = function(){
		if( ($scope.analysis.docTopKw.simpleAnalysis
				&& $scope.analysis.data.identifiers.length != undefined 
				&& $scope.analysis.data.identifiers.length > 0 
				&& $scope.analysis.docTopKw.keywordsLimit != null
				&& $scope.analysis.docTopKw.keywordsOffset != null
				&& $scope.analysis.docTopKw.selectedVocab != undefined
				&& $scope.analysis.docTopKw.selectedVocab != null
				&& $scope.analysis.docTopKw.selectedVisu != null) || 
				(!$scope.analysis.docTopKw.simpleAnalysis
				&& $scope.analysis.docTopKw.selectedVisu != null
				&& $scope.analysis.docTopKw.selectedGrouping != undefined
				&& $scope.analysis.docTopKw.selectedGrouping != null
				&& $scope.analysis.docTopKw.selectedVocab != undefined
				&& $scope.analysis.docTopKw.selectedVocab != null
				&& $scope.analysis.docTopKw.keywordsFilter != null
				&& $scope.analysis.docTopKw.keywordsFilter != undefined)){
			return true;
		}else{
			return false;
		}
			
	}
	
	
	
	
	
			
	// Submit event handler
	//preElapsedTime to consider time for data loading
	var query = function(preElapsedTime=0){
		$scope.analysis.docTopKw.errorMessage = null;
		$scope.analysis.data.centerSectionTitle = "Top Keywords";		
		$scope.analysis.docTopKw.queryResults = [];
		const start = new Date().getTime();
		$scope.analysis.docTopKw.isQuerying = true;
		
		
		if(verif()){
			//Query if existing identifiers
			const offset = $scope.analysis.docTopKw.keywordsOffset;
			const newLimit = $scope.analysis.docTopKw.keywordsLimit + offset;//extend limit to manage offset
			const nbDocs = $scope.analysis.data.identifiers.length;
			
			if($scope.analysis.docTopKw.simpleAnalysis){
				
			
			
			const promise1 = DocService.loadTopKw(
					$scope.analysis.data.identifiers, 
					$scope.analysis.docTopKw.selectedVocab.vocabulary, 
					newLimit);
			promise1.then(function(data){
				//console.log($scope.terms.semanticResources);
				//BarchartData
				
					let barChartData = {};
					barChartData.keys = Object.keys(data).slice(offset);
					barChartData.values = Object.values(data).slice(offset);//.map(x => x.toFixed(1));
					barChartData.label = "Top KW"
	    			$scope.analysis.docTopKw.barChartData  = barChartData;
	    			
	    			//WordcloudData
	    			let wordCloudData = {};
	    			wordCloudData.terms = [];
					for([key,val] of Object.entries(data).slice(offset)){
						wordCloudData.terms.push({'text':key, 'size':val});
					}
					$scope.analysis.docTopKw.wordCloudData  = wordCloudData;
					
					//Statistics
					const queryTime = (new Date().getTime() - start);
					const elapsed = (preElapsedTime + queryTime)/1000;	
					$scope.analysis.docTopKw.queryResults.unshift({"item":"Result count", "value":nbDocs});
					$scope.analysis.docTopKw.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
					$scope.analysis.docTopKw.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
					$scope.analysis.docTopKw.isQuerying = false; //in all cases end querying
				
					
				
				}, function(err){
					console.log("Error in loading keywords");
					$scope.errorMessage = "Error in loading keywords  "+err;
				});
			}
			else{//Advanced analyses
				
				//console.log($scope.analysis.docTopKw.keywordsFilter.id);
					
					const promise2 = GlobalService.loadDictionary($scope.analysis.docTopKw.keywordsFilter);
					promise2.then(function(terms){
						
						const promise3 = DocService.loadFreqKw(
					$scope.analysis.data.identifiers, 
					$scope.analysis.docTopKw.selectedVocab.vocabulary, 
					$scope.analysis.docTopKw.selectedGrouping.groupingName,
					terms);
					
					promise3.then(function(data){
						//console.log(data);
						let heatMapData = {};
						heatMapData['xAxis'] = data['groups'];
						heatMapData['yAxis'] =  data['terms'];
						heatMapData['values'] = [];
						let i = 0;
						for (let group of data['groups']) {//Iterate groups
							let groupValues = data['data'][i];
							let j = 0;
  							for (let term of data['terms']) {//Iterate terms
								
								if(groupValues[term] != undefined){
									let val = Math.round((groupValues[term] + Number.EPSILON) * 100) / 100

									heatMapData['values'].push([i,j, val]);
								}else{
									heatMapData['values'].push([i,j,0]);
								}
  								j++;
							}
							i++;
						}
						
						
						$scope.analysis.docTopKw.heatMapData = heatMapData;
						
						
					const queryTime = (new Date().getTime() - start);
					const elapsed = (preElapsedTime + queryTime)/1000;	
					$scope.analysis.docTopKw.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length});
					$scope.analysis.docTopKw.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
					$scope.analysis.docTopKw.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
					$scope.analysis.docTopKw.isQuerying = false; //in all cases end querying
				
						
					}, function(errResponse3){
						console.log("Error while loading Freq KW");
						$scope.analysis.docTopKw.errorMessage = "Error while loading Freq KW";
						$scope.analysis.docTopKw.isQuerying = false;
					});
						
					
					},
					function(errResponse2){
						console.log("Error while loading terms");
						$scope.analysis.docTopKw.errorMessage = "Error while loading terms";
						$scope.analysis.docTopKw.isQuerying = false;
					});
				
			}
			
		}
		else{//Error while verifying
			$scope.analysis.docTopKw.errorMessage = "Missing data!";
			const queryTime = (new Date().getTime() - start);
			const elapsed = (preElapsedTime + queryTime)/1000;	
			//Statistiques
			$scope.analysis.docTopKw.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length});
			$scope.analysis.docTopKw.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
			$scope.analysis.docTopKw.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
			$scope.analysis.docTopKw.isQuerying = false; //in all cases end querying
		}

    };
	
	$scope.analysis.docTopKw.query = query;
      
}]);