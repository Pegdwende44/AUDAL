
// MANAGING DOC PROPERTIES VISUALISATION
app.controller('docPropertiesController', ['$scope','DocService', 'NgTableParams','$q','stat', function($scope, DocService, NgTableParams, $q, stat) {
	
	$scope.analysis.docProperties.showContent = function(id, title){
		$scope.analysis.docProperties.errorMessage = null;

		let promise = DocService.loadDocContent(id, title);
		//console.log(id);
		promise.then(function(data){
			
			
			var file = data;//new Blob([data], { type: 'application/pdf;charset=utf-8' });
   			saveAs(file, title);
		},
		function(errResponse){
			$scope.analysis.docProperties.errorMessage = "Error while loding document data"+errResponse;
		});
		
		
		
		//$('#contentModal').modal('show');
	};	
	
	$scope.analysis.docProperties.hideContent = function(id){
		$('#contentModal').modal('hide');
	};	
			
	// Submit event handler
	//preElapsedTime to consider time for data loading
	$scope.analysis.docProperties.query = function(preElapsedTime=0){
		$scope.analysis.docProperties.errorMessage = null;
		$scope.analysis.docProperties.queryResults = [];
		const start = new Date().getTime();
		$scope.analysis.docProperties.isQuerying = true;
    	let property = $scope.analysis.docProperties.selectedProperty;
    	let visu = $scope.analysis.docProperties.selectedVisualisation ;
    		
    	
		if(property == null || visu == null || $scope.analysis.data.identifiers.length == 0){// Check null values
    		$scope.errorMessage = "Empty property/visu" ;
    		$scope.analysis.docProperties.errorMessage = "Missing data";
    		$scope.analysis.docProperties.queryResults = [];
    		$scope.analysis.docProperties.isQuerying = false;
			$scope.analysis.docProperties.queryResults.unshift({"item":"Result count", "value":$scope.analysis.docProperties.tableData.length});
			$scope.analysis.docProperties.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
			$scope.analysis.docProperties.queryResults.unshift({"item":"Agg. time (s)", "value":diff/1000});
			$scope.analysis.docProperties.isQuerying = false;	
    	}
    	else{ //No null values
    		
    		if($scope.analysis.data.identifiers.length > 0 ){
	    		// Load data
				//console.log($scope.analysis.data.identifiers.length);
	    		let promise1 = DocService.getDocAssociatedProperties($scope.analysis.data.identifiers, property);
	    		promise1.then(function(data){
	    		// Create visualization
	    			let diff;
		    		let elapsed;
	    		switch(visu){
		    		
    	    		case "Table":
						$scope.analysis.docProperties.isQuerying = true;
						
							$scope.analysis.docProperties.tableData = [];
	        			for ([key, val] of Object.entries(data)){
	        				$scope.analysis.docProperties.tableData.push({'identifier':key, 'value': val});
	        			}
	        			$scope.analysis.docProperties.tableTitle = property;
	        			//$scope.analysis.docProperties.tableTitle = "title";
	        			//Statistiques
	        			diff = (new Date().getTime() - start);
		      			elapsed = (preElapsedTime + diff)/1000;
		      			$scope.analysis.docProperties.queryResults = [];
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Result count", "value":$scope.analysis.docProperties.tableData.length});
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Agg. time (s)", "value":diff/1000});
						$scope.analysis.docProperties.isQuerying = false;	
						
	        			
	    				break;
    	    				
    	    		case "Polar":	
    	    		case "Barchart":
    	    			let distribution1Temp = _.countBy(_.mapValues(data));
						//Sorting
						let distribution1 = {};
 						let myKeys = Object.keys(distribution1Temp).sort();	
						
						
						let myValues = [];
						myKeys.forEach(function(key) {
						myValues.push(distribution1Temp[key]);
						});
						
						
	        			let barChartData = {};
	        			barChartData.keys = myKeys;
	        			barChartData.values = myValues;
	        			barChartData.label = property;
	        			$scope.analysis.docProperties.barChartData  = barChartData;
	        			//Statistiques
		      			$scope.analysis.docProperties.queryResults = [];
		      			diff = (new Date().getTime() - start);
		      			elapsed = (preElapsedTime + diff)/1000;
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length});
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Agg. time (s)", "value":diff/1000});
    	    			break;
    	    		
    	    		case "Piechart":		
    	    			let distribution2 = _.countBy(_.mapValues(data));	
    	    			let pieChartData = [];
    	    			for (let [key, value] of Object.entries(distribution2)){
    	    				pieChartData.push({"name":key, "y":value});
    	    			}
    	    			pieChartData.label = property;
    	    			$scope.analysis.docProperties.pieChartData = pieChartData;
    	    			$scope.analysis.docProperties.pieChartTitle = "Pie Chart - "+property;
    	    			//Statistiques
		      			$scope.analysis.docProperties.queryResults = [];
		      			diff = (new Date().getTime() - start);
		      			elapsed = (preElapsedTime + diff)/1000;
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length});
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Agg. time (s)", "value":diff/1000});
    	    			break; 
    	    			
    	    		case "Timeline":	
    	    			let listTemp = [];
    	    			for(let val of Object.values(data)){
    	    				if(val != undefined && val != null){
    	    					let temp = val.split("-");
    	    					listTemp.push(temp[0]); // Get Year
    	    				}	
    	    			}
    	    			
    	    			let distribution3 = _.countBy(listTemp);
    	    			let keys = [];
    	    			Object.keys(distribution3).forEach( elt =>  keys.push(parseInt(elt)));
    	    			let minVal = 2000;
    	    			let maxVal = 2020;
    	    			let timelineChartData = {};
    	    			timelineChartData.start = minVal;
    	    			timelineChartData.data = [];
    	    			let i = minVal;
    	    			while(i <= maxVal){
								val = distribution3[i];
								if(val != null && val != undefined){
									timelineChartData.data.push(val);
								}else{
									timelineChartData.data.push(0);
								}
    	    					
    	    				i = i+1;		
    	    				}
    	    			$scope.analysis.docProperties.timelineChartData = timelineChartData;
    	    			$scope.analysis.docProperties.timelineChartTitle = "Timeline - "+property;
    	    			//Statistiques
		      			$scope.analysis.docProperties.queryResults = [];
		      			diff = (new Date().getTime() - start);
		      			elapsed = (preElapsedTime + diff)/1000;
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Result count", "value":$scope.analysis.data.identifiers.length});
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Agg. time (s)", "value":diff/1000});
    	    			break; 
    	    		
    	    		case "Boxplot":
	        			let histogramChartData = {};
	        			let values = Object.values(data);
	        			histogramChartData.meanVal = _.mean(values);
	        			const min = _.min(values);
	        			const max = _.max(values);
	        			const q1 = stat.quartile(values, 25);
	        			const q2 = stat.quartile(values, 50);
	        			const q3 = stat.quartile(values, 75);
	        			histogramChartData.data = [min, q1, q2, q3, max];
	        			
	        			//Graphique
	        			$scope.analysis.docProperties.histogramChartTitle = "Histogram - "+ property;
	        			$scope.analysis.docProperties.histogramChartData = histogramChartData;
	        			
	        			//Statistiques
		      			$scope.analysis.docProperties.queryResults = [];
		      			diff = (new Date().getTime() - start);
		      			elapsed = (preElapsedTime + diff)/1000;
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Result count", "value":values.length});
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
	        			$scope.analysis.docProperties.queryResults.unshift({"item":"Agg. time (s)", "value":diff/1000});
						$scope.analysis.docProperties.queryResults.push({"item":"Theoretical mean", "value":histogramChartData.meanVal.toFixed(3)});
	        			$scope.analysis.docProperties.queryResults.push({"item":"Median", "value":q2});
		      			$scope.analysis.docProperties.queryResults.push({"item":"Variance", "value":stat.getSD(values)});
		      			
    	    			break; 
    	    			
    	    			default:
    	    				$scope.errorMessage = "Selected visualisation not found"; 	
    	    				$scope.analysis.docProperties.errorMessage = "Bad analysis choice";
    	    		}//End Switch	
	    		$scope.analysis.docProperties.isQuerying = false;
    	    	}, function(errResponse){
    	    		$scope.analysis.docProperties.errorMessage = "Error while loading graphic data"; 
					$scope.analysis.docProperties.isQuerying = false;	
    	    	});
    		}
    		else{// Empty identifiers
    	    		
    			// Reinit all visu
	    		// Table
	    		$scope.analysis.docProperties.tableData  = [];
	    		// Polar - Barchar
				$scope.analysis.docProperties.barChartData  = null;
				// Piechart
				$scope.analysis.docProperties.pieChartData = [];
				$scope.analysis.docProperties.pieChartTitle = "";
				// Timeline
				$scope.analysis.docProperties.timelineChartData = null;
				$scope.analysis.docProperties.timelineChartTitle = "";
				// Boxplot
				$scope.analysis.docProperties.histogramChartTitle = "Histogram - "+ property;
				$scope.analysis.docProperties.histogramChartData = null;
    				
    	    	}
	    	}
    		
    		
    	
    	
    	
    };
	

      
}]);














