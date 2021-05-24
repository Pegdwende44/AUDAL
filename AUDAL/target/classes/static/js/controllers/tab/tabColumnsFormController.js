
// MANAGING DOC PROPERTIES VISUALISATION
app.controller('tabColumnsController', ['$scope', 'TabService','$q','stat', function($scope, TabService, $q, stat) {
	
	var init = function(){
		$scope.analysis.tabColumns = {};	
		$scope.analysis.tabColumns.simpleAnalysis = true;
		$scope.analysis.tabColumns.joinTypes = [ {"key":"NONE", "value": "None"}, 
												{"key":"inner", "value":"INNER JOIN"}, 
												{"key":"left","value":"LEFT JOIN"}];
		$scope.analysis.tabColumns.mainTableColumns = [];
		$scope.analysis.tabColumns.joinTableColumns = [];
		//$scope.analysis.tabColumns.rawJoinableTables["NONE"] = [];
	}
	init();
	
	$scope.analysis.tabColumns.activateSimpleAnalysis = function(){
		$scope.analysis.tabColumns.simpleAnalysis = true;
		$scope.analysis.tabColumns.selectedVisu = null;
		$(".columns-analysisType").removeClass("active");
		$("#columnsSimpleAnalysis").addClass("active");
	}
	
	$scope.analysis.tabColumns.deactivateSimpleAnalysis = function(){
		$scope.analysis.tabColumns.simpleAnalysis = false;
		$scope.analysis.tabColumns.selectedVisu = null;
		$(".columns-analysisType").removeClass("active");
		$("#columnsCorrelationAnalysis").addClass("active");
	};
	
	
	
	var updateJoinTypes = function(){
		//console.log("update joinable tables");
		if($scope.analysis.tabColumns.selectedMainTable != null ){
			//Load main table columns
			let promise1 = TabService.getTabColumns([$scope.analysis.tabColumns.selectedMainTable.identifier]);
			promise1.then(function(data){
				
				$scope.analysis.tabColumns.mainTableColumns = Object.values(data)[0];
				
				//console.log($scope.analysis.tabColumns.mainTableColumns);
				//console.log($scope.analysis.tabColumns.selectedMainTable);
			}, 
			function(errResponse){
				console.log("Error while loading main table columns");
				$scope.analysis.tabColumns.errorMessage = "Error while loading main table columns";
			});
			
				let promise2 = TabService.loadJoinableTables2($scope.analysis.tabColumns.selectedMainTable.identifier);
				promise2.then(function(data){
					//$scope.analysis.tabClustering.joinableTables = data;
					//Update available JOIN Types
					//let selectedJoinType = $scope.analysis.tabColumns.selectedJoinType;
					$scope.analysis.tabColumns.joinTypes.length = 0;
					$scope.analysis.tabColumns.joinTypes.push({"key":"NONE", "value": "None"});
					if(data["inner"].length > 0){
						$scope.analysis.tabColumns.joinTypes.push({"key":"inner", "value":"INNER JOIN"});
					}
					if(data["left"].length > 0){
						$scope.analysis.tabColumns.joinTypes.push({"key":"left", "value":"LEFT JOIN"});
					}
					$scope.analysis.tabColumns.selectedJoinType = $scope.analysis.tabColumns.joinTypes[0];
					$scope.analysis.tabColumns.rawJoinableTables = data;
					$scope.analysis.tabColumns.rawJoinableTables["NONE"] = [];
				}, 
				function(errResponse){
					console.log("Error while loading joinable tables");
					$scope.analysis.tabColumns.errorMessage = "Error while loading joinable tables";
					$scope.analysis.tabColumns.joinableTables = [];
				});
			
		}else{//Main table null
			$scope.analysis.tabColumns.availableColumns = [];
			$scope.analysis.tabColumns.joinableTables = [];
		}
		
	}
	$scope.analysis.tabColumns.updateJoinTypes = updateJoinTypes;
	
	
	//Load joinable  tables related to choosed main table and join option
	var updateJoinableTables = function(){	
			let selectedJoinType = $scope.analysis.tabColumns.selectedJoinType;
			if(selectedJoinType == null){
				$scope.analysis.tabColumns.selectedJoinType = $scope.analysis.tabColumns.joinTypes[0];	
			}
			$scope.analysis.tabColumns.joinableTables = $scope.analysis.tabColumns.rawJoinableTables[$scope.analysis.tabColumns.selectedJoinType.key];
	}
	$scope.analysis.tabColumns.updateJoinableTables = updateJoinableTables;
	
	
	//Load/reload join table columns when changed
	var updateJoinTableColumns = function(){
		if($scope.analysis.tabColumns.selectedJoinTable != null){
			let promise2 = TabService.getTabColumns([$scope.analysis.tabColumns.selectedJoinTable.tableId]);
			promise2.then(function(data){
				$scope.analysis.tabColumns.joinTableColumns = Object.values(data)[0];
				//Create/Update selectedMainTableColumns and SelectedAggColumns
				//$scope.analysis.tabQueries.selectedJoinTableColumns = {};
				//console.log($scope.analysis.tabColumns.selectedJoinTable);
			}, 
			function(errResponse){
				console.log("Error while loading join table columns");
				$scope.analysis.tabColumns.errorMessage ="Error while loading join table columns";
			});
		}
		else{
			
			$scope.analysis.tabColumns.joinTableColumns = [];
		}
	}
	$scope.analysis.tabColumns.updateJoinTableColumns = updateJoinTableColumns;
	
	
	
	
	$scope.analysis.tabColumns.updateVisu = function(){
		if($scope.analysis.tabColumns.simpleAnalysis){//Case of simple analyses
			let visus={'STRING':['Table','BarChart'], 
					'INTEGER':['Scatter', 'BoxPlot', 'Histogram'], 
					'DECIMAL':['Scatter', 'BoxPlot','Histogram']};
			//console.log($scope.analysis.tabColumns.selectedProperty);
			if($scope.analysis.tabColumns.selectedProperty != null && $scope.analysis.tabColumns.selectedProperty != undefined){
				//console.log(JSON.parse($scope.analysis.tabColumns.selectedProperty));
				//console.log($scope.analysis.tabColumns.selectedProperty.type);
				$scope.analysis.tabColumns.availableVisu = visus[JSON.parse($scope.analysis.tabColumns.selectedProperty).type];
				if($scope.analysis.tabColumns.selectedVisu == null){
					$scope.analysis.tabColumns.selectedVisu = $scope.analysis.tabColumns.availableVisu[0];
				}
				
			}else{
				$scope.analysis.tabColumns.availableVisu = [];
				$scope.analysis.tabColumns.selectedVisu = null;
			}
			
		}else{//Case of correlation analyses
			let visus={'STRING-STRING':['Table','HeatMap'], 
					'STRING-INTEGER':['Table', 'BarChart'], 
					'STRING-DECIMAL':['Table', 'BarChart'], 
					'INTEGER-INTEGER':['Table', 'BarChart'], 
					'INTEGER-STRING':['Table'], 
					'DECIMAL-STRING':['Table'],
					'DECIMAL-DECIMAL':['Scatter'],
					'DECIMAL-INTEGER':['Scatter'],
					'INTEGER-DECIMAL':['Scatter'],
					'INTEGER-INTEGER':['Scatter'],};
			if($scope.analysis.tabColumns.selectedProperty1 != null 
					&& $scope.analysis.tabColumns.selectedProperty1 != undefined
					&& $scope.analysis.tabColumns.selectedProperty2 != null 
					&& $scope.analysis.tabColumns.selectedProperty2 != undefined){
				//console.log($scope.analysis.tabColumns.selectedProperty1.type+'-'+$scope.analysis.tabColumns.selectedProperty2.type);
				$scope.analysis.tabColumns.availableVisu = visus[JSON.parse($scope.analysis.tabColumns.selectedProperty1).type+'-'+JSON.parse($scope.analysis.tabColumns.selectedProperty2).type];
				if($scope.analysis.tabColumns.selectedVisu == null){
					$scope.analysis.tabColumns.selectedVisu = $scope.analysis.tabColumns.availableVisu[0];
				}
			}else{
				$scope.analysis.tabColumns.availableVisu = [];
				$scope.analysis.tabColumns.selectedVisu = null;
			}
		}
		//$scope.analysis.generalQuery();
		$scope.analysis.tabColumns.query();
	}
	
	
	
	
	var verif = function(){
		return ((!$scope.analysis.tabColumns.simpleAnalysis
				&& $scope.analysis.tabColumns.selectedMainTable != null
				&& $scope.analysis.tabColumns.selectedMainTable != undefined
				&& $scope.analysis.tabColumns.selectedProperty1 != null
				&& $scope.analysis.tabColumns.selectedProperty1 != undefined
				&& $scope.analysis.tabColumns.selectedProperty2 != null
				&& $scope.analysis.tabColumns.selectedProperty2 != undefined
				&& $scope.analysis.tabColumns.selectedVisu != null
				&& $scope.analysis.tabColumns.selectedVisu != undefined)
			|| ($scope.analysis.tabColumns.simpleAnalysis
					&& $scope.analysis.tabColumns.selectedMainTable != null
					&& $scope.analysis.tabColumns.selectedMainTable != undefined
					&& $scope.analysis.tabColumns.selectedProperty != null
					&& $scope.analysis.tabColumns.selectedProperty != undefined
					&& $scope.analysis.tabColumns.selectedVisu != null
					&& $scope.analysis.tabColumns.selectedVisu != undefined));
	}
	
	
	
	//preElapsedTime to consider time for data loading
	$scope.analysis.tabColumns.query = function(preElapsedTime=0){
			$scope.analysis.tabColumns.errorMessage = null;
			$scope.analysis.tabColumns.queryResults = [];
			const start = new Date().getTime();
			let diff ;
			let elapsed ;
			$scope.analysis.tabColumns.isQuerying = true;
			
	    	if(verif()){
	    		
	    		if($scope.analysis.tabColumns.simpleAnalysis){
	    			//Case of simple analysis
	    			let property = JSON.parse($scope.analysis.tabColumns.selectedProperty);
					let mainTableColumns = {}, joinTableColumns = {};
					for(let item of $scope.analysis.tabColumns.mainTableColumns){
						if(angular.equals(item, property)){
							
							mainTableColumns[$scope.analysis.tabColumns.selectedMainTable.title+'.'+property.name]= true;	
						}
					}
					for(let item of $scope.analysis.tabColumns.joinTableColumns){
						if(angular.equals(item, property)){
							joinTableColumns[$scope.analysis.tabColumns.selectedJoinTable.tableName+'.'+property.name]= true;
						}
					}
					
					//console.log(mainTableColumns);
	    			//let promise = TabService.tabSimpleQuery($scope.analysis.tabColumns.selectedMainTable.title, [property]);
					let promise1 = TabService.tabAvancedQuery(
									$scope.analysis.tabColumns.selectedMainTable, 
									$scope.analysis.tabColumns.selectedJoinTable, 
									$scope.analysis.tabColumns.selectedJoinType, 
									mainTableColumns, 
									joinTableColumns, null, null, null);
	    			promise1.then(function(result){
						//console.log(result);
						data = result.data;
	    				switch($scope.analysis.tabColumns.selectedVisu){
	    					case 'Table':
	    						$scope.analysis.tabColumns.tableData1 = [];
	    						let i = 1;
	    	        			for (item of data){
	    	        				$scope.analysis.tabColumns.tableData1.push({'key':i, 'value':item[property.name]});
	    	        				i++;
	    	        			}
	    	        			$scope.analysis.tabColumns.tableTitle1 = property.name;
	    	        			
	    	        			//Statistiques
	    	        			
	    						break;
	    						
	    					case 'BarChart':
	    						let dataArray = []
	    						for (item of data){
	    							dataArray.push(item[property.name]);
	    	        			}
	    						let distribution = _.countBy(_.map(dataArray));	
	    	        			let barChartData1 = {};
	    	        			barChartData1.keys = Object.keys(distribution);
	    	        			barChartData1.values = Object.values(distribution);
	    	        			barChartData1.label = property;
	    	        			$scope.analysis.tabColumns.barChartData1  = barChartData1;
	    	        			$scope.analysis.tabColumns.barChartTitle1  = "Bar chart "+property.name;
	    	        			//Statistiques
	    	        			
	    						break; 
	    						
	    					case 'Scatter':
	    						let scatterChartData1 = [];
	    						let temp = [];
	    						for (item of data){
	    							scatterChartData1.push([item[property.name], item[property.name]]);
	    							temp.push(item[property.name]);
	    	        			}
	    						$scope.analysis.tabColumns.scatterChartData1 = scatterChartData1;
	    						$scope.analysis.tabColumns.scatterChartTitle1 = "Scatter chart "+property.name;
	    						$scope.analysis.tabColumns.queryResults.push({"item":"mean", "value":_.mean(temp)});
	    						$scope.analysis.tabColumns.queryResults.push({"item":"variance", "value":stat.getSD(temp)});
	    						break;	
	    					
	    					case 'BoxPlot': 
	    						let boxPlotData1 = {};
	    						let values = []
	    						for (item of data){
	    							values.push(item[property.name]);
	    	        			}
	    	        			//let values = Object.values(data);
	    	        			boxPlotData1.meanVal = _.mean(values);
	    	        			const min = _.min(values);
	    	        			const max = _.max(values);
	    	        			const q1 = stat.quartile(values.slice(), 25);
	    	        			const q2 = stat.quartile(values.slice(), 50);
	    	        			const q3 = stat.quartile(values.slice(), 75);
	    	        			boxPlotData1.data = [min, q1, q2, q3, max];
	    	        			//Graphique
	    	        			$scope.analysis.tabColumns.boxPlotTitle1 = "BoxPlot - "+ property;
	    	        			$scope.analysis.tabColumns.boxPlotData1 = boxPlotData1;
	    	        			
	    	        			//Statistiques
	    	        			$scope.analysis.tabColumns.queryResults.push({"item":"variance", "value":stat.getSD(values)});
	    	        			$scope.analysis.tabColumns.queryResults.push({"item":"Theoretical mean", "value":boxPlotData1.meanVal.toFixed(3)});
	    	        			$scope.analysis.tabColumns.queryResults.push({"item":"Median", "value":q2});
	    	        			
	    						break;
	    					case 'Histogram':
	    						let histogramChartData = [];
	    						for (item of data){
	    							histogramChartData.push(item[property.name]);
	    	        			}
	    						$scope.analysis.tabColumns.histogramChartData = histogramChartData;
	    						$scope.analysis.tabColumns.queryResults.unshift({"item":"Result count", "value":data.length});
	    						break;
	    					default:
	    						console.log("Option not taken into charge");
								$scope.analysis.tabColumns.errorMessage = "Option not taken into charge";
								
	    				}
	    				
	    				//Statistiques
	        			diff = (new Date().getTime() - start);
	    				elapsed = (preElapsedTime + diff)/1000;
	    				$scope.analysis.tabColumns.queryResults.unshift({"item":"Result count", "value":data.length});
	    				$scope.analysis.tabColumns.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
	    				$scope.analysis.tabColumns.isQuerying = false; //in all cases end querying
	    				
	     			},
	    			function(errResponse){
	    				console.log("Error while loading tab column data");
	    				$scope.analysis.tabColumns.errorMessage = "Error while loading table columns data";
						$scope.analysis.tabColumns.isQuerying = false;
						
	    			});
	    			
	    		}else{
	    			//Case of correlation analysis
	    			let property1 = JSON.parse($scope.analysis.tabColumns.selectedProperty1);
	    			let property2 = JSON.parse($scope.analysis.tabColumns.selectedProperty2);


					let mainTableColumns = {}, joinTableColumns = {};
					for(let item of $scope.analysis.tabColumns.mainTableColumns){
						if(angular.equals(item, property1)){
							mainTableColumns[$scope.analysis.tabColumns.selectedMainTable.title+'.'+property1.name]= true;
						}
						if(angular.equals(item, property2)){
							mainTableColumns[$scope.analysis.tabColumns.selectedMainTable.title+'.'+property2.name]= true;
						}
					}
					for(let item of $scope.analysis.tabColumns.joinTableColumns){
						if(angular.equals(item, property1)){
							mainTableColumns[$scope.analysis.tabColumns.selectedJoinTable.tableName+'.'+property1.name]= true;
						}
						if(angular.equals(item, property2)){
							mainTableColumns[$scope.analysis.tabColumns.selectedJoinTable.tableName+'.'+property2.name]= true;
						}
					}
					

	    			//let promise1 = TabService.tabSimpleQuery($scope.analysis.tabColumns.selectedTable.title, []);
	    			let promise2 = TabService.tabAvancedQuery(
									$scope.analysis.tabColumns.selectedMainTable, 
									$scope.analysis.tabColumns.selectedJoinTable, 
									$scope.analysis.tabColumns.selectedJoinType, 
									mainTableColumns, 
									joinTableColumns, null, null, null);
	    			promise2.then(function(result){
	    				let data = result.data;
						//console.log(data);
	    				switch($scope.analysis.tabColumns.selectedVisu){
		    				case 'Table':
		    					$scope.analysis.tabColumns.tableData2 = [];
	    						let i = 1;
	    	        			for (item of data){
	    	        				$scope.analysis.tabColumns.tableData2.push({'key':i, 'valueX':item[property1.name], 'valueY':item[property2.name]});
	    	        				i++;
	    	        			}
	    	        			$scope.analysis.tabColumns.tableTitle2X = property1.name;
	    	        			$scope.analysis.tabColumns.tableTitle2Y = property2.name;

								diff = (new Date().getTime() - start);
			    				elapsed = (preElapsedTime + diff)/1000;
			    				//Statistiques
			    				$scope.analysis.tabColumns.queryResults.unshift({"item":"Result count", "value":data.length});
			    				$scope.analysis.tabColumns.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
			    				$scope.analysis.tabColumns.isQuerying = false; //in all cases end querying
	    				//console.log(data);
		    					break;
		    					 
		    				case 'HeatMap':
		    					let heatMapValuesTemp = [];
		    					let heatMapValues = [];
		    					let j = 1;
		    					for (item of data){
		    						heatMapValuesTemp.push({'identifier':j, 'value1': item[property1.name], 'value2': item[property2.name]});
		    						j++;
		            			}
		    					let heatMapGroupsX = _.sortBy(_.keys(_.keyBy(data, property1.name)));
		    					let heatMapGroupsY = _.sortBy(_.keys(_.keyBy(data, property2.name)));
			
			
		    					/*console.log(heatMapValuesTemp);
								console.log(heatMapGroupsX);
		    					console.log(heatMapGroupsY);	*/			
				
			
		    					let heatMapData2 = {};
		    					heatMapData2.xAxis = heatMapGroupsX;
		    					heatMapData2.yAxis = heatMapGroupsY;
								
		    					let promise = stat.chiSquare(heatMapGroupsX,heatMapGroupsY, heatMapValuesTemp);
								promise.then(function(data2){
									chiSquareResult = data2;
									heatMapData2.values = chiSquareResult.realValues;
		    					$scope.analysis.tabColumns.heatMapData2 = heatMapData2;
								//Statistiques
		    					$scope.analysis.tabColumns.queryResults.push({"item":"Statistic", "value":chiSquareResult.statistic});
		    					$scope.analysis.tabColumns.queryResults.push({"item":"P-Value", "value":chiSquareResult.pvalue});
			
								diff = (new Date().getTime() - start);
			    				elapsed = (preElapsedTime + diff)/1000;
			    				//Statistiques
			    				$scope.analysis.tabColumns.queryResults.unshift({"item":"Result count", "value":data.length});
			    				$scope.analysis.tabColumns.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
			    				$scope.analysis.tabColumns.isQuerying = false; //in all cases end querying
	    				//console.log(data);
								}, function(errResponse){
									console.log(errResponse);
									$scope.analysis.tabColumns.errorMessage = errResponse;
									$scope.analysis.tabColumns.isQuerying = false;
								});
		    					
		    					
		    					
		    					
		    					
		    					break;
		    				case 'BarChart':
		    					
		    					let dataArray = []
	    						for (item of data){
	    							dataArray.push(item[property1.name]);
	    	        			}
	    						
	    	        			let barChartData2 = {};
	    	        			barChartData2.keys = _.keys(_.countBy(_.mapValues(dataArray)))	;
	    	        			barChartData2.values = [];
	    	        			for(item of barChartData2.keys){
	    	        				barChartData2.values.push(_.meanBy(_.filter(data, [property1.name, item]), property2.name));
	    	        			}
	    	        			barChartData2.label = property1.name+" * "+property2.name;
	    	        			$scope.analysis.tabColumns.barChartData2  = barChartData2;
	    	        			$scope.analysis.tabColumns.barChartTitle2  = "Bar chart "+property1.name+" * "+property2.name;
		    					
			
								diff = (new Date().getTime() - start);
			    				elapsed = (preElapsedTime + diff)/1000;
			    				//Statistiques
			    				$scope.analysis.tabColumns.queryResults.unshift({"item":"Result count", "value":data.length});
			    				$scope.analysis.tabColumns.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
		    					$scope.analysis.tabColumns.isQuerying = false;
		    					break;
		    					
		    				case 'Scatter':
		    					let scatterChartData2 = [];
								let xValues = [];
								let yValues = [];
	    						for(let item of data){
									if((item[property1.name] != null) && (item[property2.name] != null) ){
										scatterChartData2.push([item[property1.name], item[property2.name]]);
									xValues.push(item[property1.name]);
									yValues.push(item[property2.name]);
									
									}
	    							
	    	        			}
								$scope.analysis.tabColumns.isQuerying = true;
								let promise2 = stat.corr(xValues,yValues);
								promise2.then(function(data2){
									$scope.analysis.tabColumns.scatterChartData2 = scatterChartData2;
	    						$scope.analysis.tabColumns.chartTitle2 = "Scatter chart "+property1+" * "+property2;
								
								diff = (new Date().getTime() - start);
			    				elapsed = (preElapsedTime + diff)/1000;
			    				//Statistiques
			    				$scope.analysis.tabColumns.queryResults.unshift({"item":"Result count", "value":data.length});
			    				$scope.analysis.tabColumns.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
								$scope.analysis.tabColumns.queryResults.unshift({"item":"Correlation", "value":data2.correlation});
								$scope.analysis.tabColumns.isQuerying = false;
								},
								function(errResponse){
									$scope.analysis.tabColumns.errorMessage = errResponse;
									console.log(errResponse);
									$scope.analysis.tabColumns.isQuerying = false;
								});
	    						
		    					break;
		    				
							default:
		    					console.log("Option not taken into charge");
								$scope.analysis.tabColumns.isQuerying = false;
			    				$scope.analysis.tabColumns.errorMessage = "Option not taken into charge";
								 diff = (new Date().getTime() - start);
			    				 elapsed = (preElapsedTime + diff)/1000;
								//console.log($scope.analysis.tabColumns.selectedProperty1);
								//console.log($scope.analysis.tabColumns.selectedProperty2);
			    				//Statistiques
			    				//$scope.analysis.tabColumns.queryResults.unshift({"item":"Result count", "value":data.length});
		    					$scope.analysis.tabColumns.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
	    				}
	    			
	    				
	    			},
	    			function(errResponse){
	    				console.log("Error while loading tab column data");
	    				$scope.analysis.tabColumns.errorMessage = "Error while loading table columns data";
						$scope.analysis.tabColumns.isQuerying = false;
	    			});
	    		} 		
	    		
	    		
	    	}else{
	    		diff = (new Date().getTime() - start);
				elapsed = (preElapsedTime + diff)/1000;
				$scope.analysis.tabColumns.errorMessage = "Missing data";
				//Statistiques
				//$scope.analysis.tabColumns.queryResults.unshift({"item":"Result count", "value":$scope.tables.selectedTableIds.length});
				$scope.analysis.tabColumns.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
				$scope.analysis.tabColumns.isQuerying = false; //in all cases end querying
	    	}
	    		
	    	
			
			
    	 };
	

      
}]);














