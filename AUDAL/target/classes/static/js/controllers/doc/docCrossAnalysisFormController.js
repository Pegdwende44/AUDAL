

// MANAGING DOC HIGHLIGHTS VISUALISATION
app.controller('docCrossAnalysisController', ['$scope','DocService', 'NgTableParams','$q','stat', function($scope, DocService, NgTableParams, $q, stat) {
	
	
	
	var init = function(){
		$scope.analysis.docCrossAnalysis = {};
		let promise1 =  DocService.loadDocProperties();
	    
		promise1.then(function(data) { //After form data loading
	    	$scope.analysis.docCrossAnalysis.properties = data;
	    	$scope.analysis.docCrossAnalysis.selectedProp1 = $scope.analysis.docCrossAnalysis.properties[0];
	    	$scope.analysis.docCrossAnalysis.selectedProp2 = $scope.analysis.docCrossAnalysis.properties[1];
	    	updateVisu();
	    });
		//$scope.analysis.docLinks.analysisOptions = ['Groups-Links', 'Docs-Links'];
		
	};
	init();
	
	
	//Present possible visualization
	var updateVisu = function(){
		var listVisu = 
		{"Grouping-Grouping":["HeatMap", "Table"],"Grouping-STRING":["Table"],"Grouping-INTEGER":["BarChart","Polar","Boxplot","Table"],"Grouping-LocalDate":["Table"],
		"STRING-STRING":["Table"],	"STRING-Grouping":["Table"],"STRING-INTEGER":["Table"],	"STRING-LocalDate":["Table"],
		"INTEGER-INTEGER":["Scatter", "Table"],"INTEGER-Grouping":["Table"],	"INTEGER-STRING":["Table"],	"INTEGER-LocalDate":["Table"],
		"LocalDate-LocalDate":["Table"],"LocalDate-Grouping":["Table"],	"LocalDate-STRING":["Table"],	"LocalDate-INTEGER":["Table"]};
		if($scope.analysis.docCrossAnalysis.selectedProp2 != null && $scope.analysis.docCrossAnalysis.selectedProp2 != null){
			let choice = $scope.analysis.docCrossAnalysis.selectedProp1.type+"-"+$scope.analysis.docCrossAnalysis.selectedProp2.type;
			$scope.analysis.docCrossAnalysis.visuOptions = listVisu[choice];
			$scope.analysis.docCrossAnalysis.selectedVisu = $scope.analysis.docCrossAnalysis.visuOptions[0];
			$scope.analysis.generalQuery()
		}
		
	}
	$scope.analysis.docCrossAnalysis.updateVisu = updateVisu;
	
	var verif = function(){
		if($scope.analysis.data.identifiers.length != undefined 
				&& $scope.analysis.data.identifiers.length > 0 
				&& $scope.analysis.docCrossAnalysis.selectedVisu != null
				&& $scope.analysis.docCrossAnalysis.selectedProp1 != null
				&& $scope.analysis.docCrossAnalysis.selectedProp2 != null){
			return true;
		}else{
			return false;
		}
			
	}
	
	
			
	// Submit event handler
	//preElapsedTime to consider time for data loading
	var query = function(preElapsedTime=0){
		$scope.analysis.docCrossAnalysis.errorMessage = null;
		$scope.analysis.data.centerSectionTitle = "Properties Correlation";		
		$scope.analysis.docCrossAnalysis.queryResults = [];
		const start = new Date().getTime();
		$scope.analysis.docCrossAnalysis.isQuerying = true;
		
		
		if(verif()){
			
			var propValues1 = null;
			var propValues2 = null;
			let promise1 = DocService.getDocAssociatedProperties($scope.analysis.data.identifiers, $scope.analysis.docCrossAnalysis.selectedProp1.name);
			promise1.then(function(data){
				propValues1 = data;
			});
			let promise2 = DocService.getDocAssociatedProperties($scope.analysis.data.identifiers, $scope.analysis.docCrossAnalysis.selectedProp2.name);
			promise2.then(function(data){
				propValues2 = data;
			});
			
			$q.all([promise1,promise2]).then(function(){
				
				switch($scope.analysis.docCrossAnalysis.selectedVisu){
				case "Table":
					$scope.analysis.docCrossAnalysis.tableData = [];
					for ([key, val] of Object.entries(propValues1)){
        				$scope.analysis.docCrossAnalysis.tableData.push({'identifier':key, 'value1': val, 'value2': propValues2[key]});
        			}
					$scope.analysis.docCrossAnalysis.tableTitleX = $scope.analysis.docCrossAnalysis.selectedProp1.name;
					$scope.analysis.docCrossAnalysis.tableTitleY = $scope.analysis.docCrossAnalysis.selectedProp2.name;
					break;
					
				case "HeatMap":
					let heatMapValuesTemp = [];
					let heatMapValues = [];
					for ([key, val] of Object.entries(propValues1)){
						heatMapValuesTemp.push({'identifier':key, 'value1': val, 'value2': propValues2[key]});
        			}
					let heatMapGroupsX = _.sortBy(_.keys(_.countBy(_.mapValues(propValues1))));
					let heatMapGroupsY = _.sortBy(_.keys(_.countBy(_.mapValues(propValues2))));
					//console.log(heatMapValuesTemp);
		
					let heatMapData = {};
					heatMapData.xAxis = heatMapGroupsX;
					heatMapData.yAxis = heatMapGroupsY;
					$scope.analysis.docCrossAnalysis.isQuerying = true;
					let promise = stat.chiSquare(heatMapGroupsX,heatMapGroupsY, heatMapValuesTemp);
					promise.then(function(data){
						chiSquareResult = data;
						heatMapData.values = chiSquareResult.realValues;
						$scope.analysis.docCrossAnalysis.heatMapData = heatMapData;
						//Statistiques
						$scope.analysis.docCrossAnalysis.queryResults.push({"item":"Statistic", "value":chiSquareResult.statistic});
						$scope.analysis.docCrossAnalysis.queryResults.push({"item":"P-value", "value":chiSquareResult.pvalue});
						$scope.analysis.docCrossAnalysis.isQuerying = false;
					}, function(errResponse){
						console.log(errResponse);
						$scope.analysis.docCrossAnalysis.errorMessage = errResponse;
						$scope.analysis.docCrossAnalysis.isQuerying = false;
					})
					
					break;
				case "Boxplot":
					
					let boxPlotDataTemp = [];
					for ([key, val] of Object.entries(propValues1)){
						boxPlotDataTemp.push({'identifier':key, 'value1': val, 'value2': propValues2[key]});
        			}
					let boxPlotData = {};
	    			boxPlotData.keys = _.keys(_.countBy(_.mapValues(propValues1)));
	    			boxPlotData.values = [];
	    			for(let elt of boxPlotData.keys){
	    				let val = _.filter(boxPlotDataTemp, ['value1', elt]).map(item => item['value2']) ;
	    				let  min = _.min(val);
	        			let max = _.max(val);
	        			let q1 = stat.quartile(val.slice(), 25);
	        			let q2 = stat.quartile(val.slice(), 50);
	        			let q3 = stat.quartile(val.slice(), 75);
	    				boxPlotData.values.push([min,q1,q2,q3,max]);
	    			}
	    			boxPlotData.label = $scope.analysis.docCrossAnalysis.selectedProp2;
	    			boxPlotData.meanVal = _.mean(Object.values(propValues2));
	    			$scope.analysis.docCrossAnalysis.boxPlotData = boxPlotData;
	    			//Statistiques
	    			$scope.analysis.docCrossAnalysis.queryResults.push({"item":"Mean", "value":boxPlotData.meanVal});
					break;
				case "Polar":	
				case "BarChart":
					let barChartDataTemp = [];
					for ([key, val] of Object.entries(propValues1)){
						barChartDataTemp.push({'identifier':key, 'value1': val, 'value2': propValues2[key]});
        			}
					let barChartKeys = _.sortBy(_.keys(_.countBy(_.mapValues(propValues1))));
					let barChartValues = [];
					for(key of barChartKeys){
							let val = _.map(_.filter(barChartDataTemp, function(o) { if (o.value1 == key) return o }), function(elt){return elt.value2});
							barChartValues.push(_.mean(val));
						}
						
					
					let barChartData = {};
					barChartData.keys = barChartKeys;
					barChartData.values = barChartValues;
					barChartData.label = $scope.analysis.docCrossAnalysis.selectedProp1.name;
					$scope.analysis.docCrossAnalysis.barChartData = barChartData;
					//Statistiques
					let meanVal = _.mean(Object.values(propValues2));
					$scope.analysis.docCrossAnalysis.queryResults.push({"item":"Mean", "value":meanVal});
					break;
				case "Scatter":
					let scatterChartData = [];
					for ([key, val] of Object.entries(propValues1)){
						scatterChartData.push([val, propValues2[key]]);
        			}
					$scope.analysis.docCrossAnalysis.scatterChartData = scatterChartData;
					
					break;
				default:
					console.log("Error in DocCrossAnalysis Visu choice");
					$scope.analysis.docCrossAnalysis.errorMessage = "Bad analysis choice";
				
				}	
				//Statistiques
				const queryTime = (new Date().getTime() - start);
				const elapsed = (preElapsedTime + queryTime)/1000;	
				$scope.analysis.docCrossAnalysis.queryResults.unshift({"item":"Result count", "value": $scope.analysis.data.identifiers.length});
				$scope.analysis.docCrossAnalysis.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
				$scope.analysis.docCrossAnalysis.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
				$scope.analysis.docCrossAnalysis.isQuerying = false; //in all cases end querying*/
				
				
			}, 
			function(errResponse){
				console.log("Error in loading property1/property2 in cross analysis");
				$scope.analysis.docCrossAnalysis.errorMessage = "Error while loading property1/property2";
			});
			
				
		}
		else{
			$scope.analysis.docCrossAnalysis.errorMessage = "Missing data";
			const queryTime = (new Date().getTime() - start);
			const elapsed = (preElapsedTime + queryTime)/1000;	
			//Statistiques
			$scope.analysis.docCrossAnalysis.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length});
			$scope.analysis.docCrossAnalysis.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
			$scope.analysis.docCrossAnalysis.queryResults.unshift({"item":"Agg. time (s)", "value":queryTime/1000});
			$scope.analysis.docCrossAnalysis.isQuerying = false; //in all cases end querying
		}
		
		
		

    	
    	
		//}	
    };
	
	$scope.analysis.docCrossAnalysis.query = query;
      
}]);