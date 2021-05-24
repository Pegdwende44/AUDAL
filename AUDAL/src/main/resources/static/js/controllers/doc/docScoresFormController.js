

// MANAGING DOC HIGHLIGHTS VISUALISATION
app.controller('docScoresController', ['$scope','DocService', 'NgTableParams','$q','stat', function($scope, DocService, NgTableParams, $q, stat) {
	
	
	var init = function(){
		$scope.analysis.docScores = {};
		$scope.analysis.docScores.visu = ['Barchart', 'Polar', 'Boxplot'];
		$scope.analysis.docScores.filterOptions = [{"name":"Activate","value":true},{"name":"Deactivate","value":false}];
		$scope.analysis.docScores.orderOptions = [{"name":"Score","value":'score'},{"name":"Group name","value":'group'}];
	};
	init();
	
	
	
	var unfilter = function(){
		let positiveTerms = $scope.terms.listPositiveTerms.concat($scope.terms.additionalPositiveTerms);
    	let negativeTerms = $scope.terms.listNegativeTerms.concat($scope.terms.additionalNegativeTerms);
		let mainPromise = $q.defer();
		if(!$scope.analysis.docScores.filter.value){
			 let promise2 =  DocService.loadDocuments(
					$scope.groupings.checkedGroups, 
					[],
					negativeTerms,
					$scope.terms.strictMatching,
					$scope.terms.fuzzySearch,
					'title'	);
			 promise2.then(function(data){
				// Updatation
				 
				$scope.analysis.data.identifiers = Object.keys(data);	
				$scope.analysis.data.objects = data ;
				mainPromise.resolve();
				}, function(){
					mainPromise.reject("Error in unfilter query");
				});
		}else{
			mainPromise.resolve();
		}
		return mainPromise.promise;
	}
	
	var verif = function(){
		let positiveTerms = $scope.terms.listPositiveTerms.concat($scope.terms.additionalPositiveTerms);
    	let negativeTerms = $scope.terms.listNegativeTerms.concat($scope.terms.additionalNegativeTerms);
		if($scope.analysis.docScores.selectedVisu != null 
				&& $scope.analysis.docScores.selectedGrouping != null
				&& $scope.analysis.data.identifiers.length != undefined 
				&& $scope.analysis.data.identifiers.length > 0
				&& positiveTerms.length > 0){
			return true;
		}else{
			return false;
		}
			
	}
			
	// Submit event handler
	//preElapsedTime to consider time for data loading
	var query = function(preElapsedTime=0){
		let positiveTerms = $scope.terms.listPositiveTerms.concat($scope.terms.additionalPositiveTerms);
    	let negativeTerms = $scope.terms.listNegativeTerms.concat($scope.terms.additionalNegativeTerms);
		$scope.analysis.docScores.errorMessage = null;
		$scope.analysis.data.centerSectionTitle = "Document scores";			
		$scope.analysis.docScores.queryResults = [];
		const start = new Date().getTime();
		$scope.analysis.docScores.isQuerying = true;
    	
		
		
		if(verif()){
			var scores = null;
			var docGroups = null;
			var promise0 = unfilter();
			
			
			promise0.then(function(){
			
			let promise1 = DocService.loadDocScores(
					positiveTerms, 
					$scope.terms.fuzzySearch);
			
				promise1.then(function(data){
					scores = [];
					for([key, val] of Object.entries(data)){
						scores.unshift({"identifier":key, "score":val});
					}
	
			}, function(err){
				console.log("error while loading scores "+err);
				$scope.analysis.docScores.errorMessage = "error while loading scores ";
			});
			
			
			//console.log($scope.analysis.docScores.selectedGrouping);
			let promise2 = DocService.getDocAssociatedProperties($scope.analysis.data.identifiers, 
					$scope.analysis.docScores.selectedGrouping.groupingName);
			promise2.then(function(data){
				docGroups = [];
				for([key, val] of Object.entries(data)){
					docGroups.unshift({"identifier":key, "group":val});
				}
				
			}, function(err){
				console.log("error while loading doc groups "+err);
				$scope.analysis.docScores.errorMessage = "error while loading doc groups ";
			});
			
			
			
			$q.all([promise1,promise2]).then(function(okValue){
				
				docGroups = _.map(docGroups, doc => _.extend({'score': 0}, doc));//Set a default 0 score
				const temp = _.merge(docGroups,scores);
				let groupAverages = stat.meanByCategory(temp, 'score', 'group');
				if($scope.analysis.docScores.order.value == 'score'){
					groupAverages = _(groupAverages).sortBy('score').value().reverse();
				}else{
					groupAverages = _(groupAverages).sortBy('group').value();
				}
				
				//Polar and Barchart
				let chartData = {};
				chartData.keys = _.chain(groupAverages).map('group').value();
				chartData.values = _.chain(groupAverages).map('score').value();
				chartData.label = "Mean score";
    			$scope.analysis.docScores.chartData  = chartData;
				
    			//Boxplots
    			let boxPlotData = {};
    			boxPlotData.keys = chartData.keys;
    			boxPlotData.values = [];
    			for(let elt of boxPlotData.keys){
    				let val = _.filter(temp, ['group', elt]).map(item => item['score']) ;
    				let  min = _.min(val);
        			let max = _.max(val);
        			let q1 = stat.quartile(val.slice(), 25);
        			let q2 = stat.quartile(val.slice(), 50);
        			let q3 = stat.quartile(val.slice(), 75);
    				boxPlotData.values.push([min,q1,q2,q3,max]);
    				
    			}
    			
    			
    			boxPlotData.meanVal = _.meanBy(temp, (d) => d.score);
    			$scope.analysis.docScores.boxPlotData = boxPlotData;
    			//console.log(boxPlotData);
    			
				//Query time		
				const queryTime = (new Date().getTime() - start);
				const elapsed = (preElapsedTime + queryTime)/1000;
				
				//Statistiques
				$scope.analysis.docScores.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length});
				$scope.analysis.docScores.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
				$scope.analysis.docScores.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
				$scope.analysis.docScores.queryResults.push({"item":"General mean", "value":boxPlotData.meanVal});
				$scope.analysis.docScores.isQuerying = false; //in all cases end querying
			},
			function(errValue){
				console.log("Error while loading doc groups or Error while loading scores");
				$scope.analysis.docScores.errorMessage = "Error while loading doc groups or Error while loading scores";
			});
			
			
			
			
			
			});
			
			
			
		
		
			
			
		}
		else{
			//$scope.analysis.docHighlights.highlights = [];
			
			
			$scope.analysis.docScores.errorMessage = "Missing data";
			const queryTime = (new Date().getTime() - start);
			const elapsed = (preElapsedTime + queryTime)/1000;
			//Statistiques
			$scope.analysis.docScores.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length});
			$scope.analysis.docScores.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
			$scope.analysis.docScores.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
		
			$scope.analysis.docScores.isQuerying = false; //in all cases end querying
		}
		
		
		

    	
    	
		
    };
	
	$scope.analysis.docScores.query = query;
      
}]);