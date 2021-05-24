
// MANAGING DOC PROPERTIES VISUALISATION
app.controller('tabQueriesController', ['$scope', 'TabService','$q','stat', function($scope, TabService, $q, stat) {
	
	

	var init = function(){
		$scope.analysis.tabQueries = {};	
		$scope.analysis.tabQueries.simpleQuerying = true;
		$scope.analysis.tabQueries.activeAgg = false;
		$scope.analysis.tabQueries.joinTypes = [ {"key":"NONE", "value": "None"}, 
												{"key":"inner", "value":"INNER JOIN"}, 
												{"key":"left","value":"LEFT JOIN"}];
		$scope.analysis.tabQueries.availableVisu = ["Table"];
		$scope.analysis.tabQueries.selectedVisu = $scope.analysis.tabQueries.availableVisu[0];
		$scope.analysis.tabQueries.selectedAggOperation = "AVG";
	}
	init();

	
	$scope.analysis.tabQueries.activateSimpleQuerying = function(){
		$scope.analysis.tabQueries.simpleQuerying = true;
		
		$(".queries-queryType").removeClass("active");
		$("#queriesSimpleQuerying").addClass("active");
	}
	
	$scope.analysis.tabQueries.deactivateSimpleQuerying = function(){
		$scope.analysis.tabQueries.simpleQuerying = false;
		
		$(".queries-queryType").removeClass("active");
		$("#queriesAggregationQuerying").addClass("active");
	}
	
	var updateGrouping = function(){
		if($scope.analysis.tabQueries.selectedGroupField == null || $scope.analysis.tabQueries.selectedGroupField == undefined){
			$scope.analysis.tabQueries.availableVisu = ["Table"];
			$scope.analysis.tabQueries.selectedVisu = $scope.analysis.tabQueries.availableVisu[0];
		}else{
			$scope.analysis.tabQueries.availableVisu = ["Table", "BarChart"];
			$scope.analysis.tabQueries.selectedVisu = $scope.analysis.tabQueries.availableVisu[0];
		}
	}
	$scope.analysis.tabQueries.updateGrouping = updateGrouping;
	
	//Load joinable  tables related to choosed main table and join option
	var updateJoinTypes = function(){
		//console.log("update joinable tables");
		if($scope.analysis.tabQueries.selectedMainTable != null ){
			//Load main table columns
			let promise1 = TabService.getTabColumns([$scope.analysis.tabQueries.selectedMainTable.identifier]);
			promise1.then(function(data){
				
				$scope.analysis.tabQueries.mainTableColumns = Object.values(data)[0];
				//console.log($scope.analysis.tabClustering.mainTableColumns);
				//Create/Update selectedMainTableColumns and SelectedAggColumns
				$scope.analysis.tabQueries.selectedMainTableColumns = {};
				$scope.analysis.tabQueries.selectedAggColumns = {};
				//$scope.analysis.tabClustering.activeAgg = false;
				$scope.analysis.tabQueries.activeAgg = false;
				$scope.analysis.tabQueries.activeAnalysis = false;
				for(let column of $scope.analysis.tabQueries.mainTableColumns){
					
					$scope.analysis.tabQueries.selectedMainTableColumns[$scope.analysis.tabQueries.selectedMainTable.title+'.'+column.name] = true;
					if(column.type != 'STRING'){
						$scope.analysis.tabQueries.selectedAggColumns[$scope.analysis.tabQueries.selectedMainTable.title+'.'+column.name] = true;
						$scope.analysis.tabQueries.activeAgg = true;
						$scope.analysis.tabQueries.activeAnalysis = true;
					}
				}
				//console.log($scope.analysis.tabClustering.mainTableColumns);
			}, 
			function(errResponse){
				console.log("Error while loading main table columns");
				$scope.analysis.tabQueries.errorMessage = "Error while loading main table columns";
			});
			
			//if($scope.analysis.tabClustering.selectedJoinType.key != 'NONE'){			
				//Load joinable tables
				let promise2 = TabService.loadJoinableTables2($scope.analysis.tabQueries.selectedMainTable.identifier);
				promise2.then(function(data){
					//$scope.analysis.tabClustering.joinableTables = data;
					//Update available JOIN Types
					let selectedJoinType = $scope.analysis.tabClustering.selectedJoinType;
					$scope.analysis.tabQueries.joinTypes.length = 0;
					$scope.analysis.tabQueries.joinTypes.push({"key":"NONE", "value": "None"});
					if(data["inner"].length > 0){
						$scope.analysis.tabQueries.joinTypes.push({"key":"inner", "value":"INNER JOIN"});
					}
					if(data["left"].length > 0){
						$scope.analysis.tabQueries.joinTypes.push({"key":"left", "value":"LEFT JOIN"});
					}
					//if(data["right"].length > 0){
					//	$scope.analysis.tabQueries.joinTypes.push({"key":"right", "value":"RIGHT JOIN"});
					//}
					$scope.analysis.tabQueries.rawJoinableTables = data;
					$scope.analysis.tabQueries.rawJoinableTables["NONE"] = [];
				}, 
				function(errResponse){
					console.log("Error while loading joinable tables");
					$scope.analysis.tabQueries.errorMessage = "Error while loading joinable tables";
					$scope.analysis.tabQueries.joinableTables = [];
				});
			//}else{
			//	$scope.analysis.tabClustering.joinableTables = [];
			//}
		}else{//Main table null
			$scope.analysis.tabQueries.mainTableColumns = [];
			$scope.analysis.tabQueries.joinableTables = [];
		}
		
	}
	$scope.analysis.tabQueries.updateJoinTypes = updateJoinTypes;
	
	/*
	//Load joinable  tables related to choosed main table and join option
	var updateJoinableTables = function(){
		//console.log("update joinable tables");
		//console.log($scope.analysis.tabQueries.selectedMainTable);
		if($scope.analysis.tabQueries.selectedMainTable != null ){
			//Load main table columns
			let promise1 = TabService.getTabColumns([$scope.analysis.tabQueries.selectedMainTable.identifier]);
			promise1.then(function(data){
				
				$scope.analysis.tabQueries.mainTableColumns = Object.values(data)[0];
				
				//Create/Update selectedMainTableColumns and SelectedAggColumns
				$scope.analysis.tabQueries.selectedMainTableColumns = {};
				$scope.analysis.tabQueries.selectedAggColumns = {};
				$scope.analysis.tabQueries.activeAgg = false;
				for(let column of $scope.analysis.tabQueries.mainTableColumns){
					$scope.analysis.tabQueries.selectedMainTableColumns[$scope.analysis.tabQueries.selectedMainTable.title+'.'+column.name] = true;
					if(column.type != 'STRING'){
						$scope.analysis.tabQueries.selectedAggColumns[$scope.analysis.tabQueries.selectedMainTable.title+'.'+column.name] = true;
						$scope.analysis.tabQueries.activeAgg = true;
					}
				}
			}, 
			function(errResponse){
				console.log("Error while loading main table columns");
				$scope.analysis.tabQueries.errorMessage = "Error while loading main table columns";
			});
			
			if($scope.analysis.tabQueries.selectedJoinType.key != 'NONE'){			
				//Load joinable tables
				let promise2 = TabService.loadJoinableTables($scope.analysis.tabQueries.selectedMainTable.identifier, 
						$scope.analysis.tabQueries.selectedJoinType.key);
				promise2.then(function(data){
					
					$scope.analysis.tabQueries.joinableTables = data;
				}, 
				function(errResponse){
					console.log("Error while loading joinable tables");
					$scope.analysis.tabQueries.errorMessage = "Error while loading joinable tables";
				});
			}else{
				$scope.analysis.tabQueries.joinableTables = [];
			}
		}else{//Main table null
			$scope.analysis.tabQueries.mainTableColumns = [];
			$scope.analysis.tabQueries.joinableTables = [];
		}
		
	}
	$scope.analysis.tabQueries.updateJoinableTables = updateJoinableTables;
	*/
	
	//Load joinable  tables related to choosed main table and join option
	var updateJoinableTables = function(){	
			let selectedJoinType = $scope.analysis.tabQueries.selectedJoinType;
			if(selectedJoinType == null){
				$scope.analysis.tabQueries.selectedJoinType = $scope.analysis.tabQueries.joinTypes[0];	
			}
			$scope.analysis.tabQueries.joinableTables = $scope.analysis.tabQueries.rawJoinableTables[$scope.analysis.tabQueries.selectedJoinType.key];
				
			
	
	}
	$scope.analysis.tabQueries.updateJoinableTables = updateJoinableTables;
	
	
	//Load/reload join table columns when changed
	var updateJoinTableColumns = function(){
		
		if($scope.analysis.tabQueries.selectedJoinTable != null){
			let promise2 = TabService.getTabColumns([$scope.analysis.tabQueries.selectedJoinTable.tableId]);
			promise2.then(function(data){
				$scope.analysis.tabQueries.joinTableColumns = Object.values(data)[0];
				//Create/Update selectedMainTableColumns and SelectedAggColumns
				$scope.analysis.tabQueries.selectedJoinTableColumns = {};
				
				for(let column of $scope.analysis.tabQueries.joinTableColumns){
					$scope.analysis.tabQueries.selectedJoinTableColumns[$scope.analysis.tabQueries.selectedJoinTable.tableName+'.'+column.name] = true;
					if(column.type != 'STRING'){
						$scope.analysis.tabQueries.selectedAggColumns[$scope.analysis.tabQueries.selectedJoinTable.tableName+'.'+column.name] = true;
						$scope.analysis.tabQueries.activeAgg = true;
						$scope.analysis.tabQueries.activeAnalysis = true;
					}
				}
			}, 
			function(errResponse){
				console.log("Error while loading join table columns");
				$scope.analysis.tabQueries.errorMessage ="Error while loading join table columns";
			});
		}
		else{
			$scope.analysis.tabQueries.joinTableColumns = [];
		}
	}
	$scope.analysis.tabQueries.updateJoinTableColumns = updateJoinTableColumns;
	
	var verif = function(){
		
		return (($scope.analysis.tabQueries.simpleQuerying 
				&& $scope.analysis.tabQueries.selectedMainTable != null 
				&& $scope.analysis.tabQueries.selectedMainTable != undefined
				&& $scope.analysis.tabQueries.selectedMainTableColumns != null
				&& $scope.analysis.tabQueries.selectedMainTableColumns != undefined)
				|| (!$scope.analysis.tabQueries.simpleQuerying));
	};
	
	
	
	
	//preElapsedTime to consider time for data loading
	$scope.analysis.tabQueries.query = function(preElapsedTime=0){
			$scope.analysis.tabQueries.errorMessage = null;
			$scope.analysis.tabQueries.queryResults = [];
			const start = new Date().getTime();
			$scope.analysis.tabQueries.isQuerying = true;
	    	//let property = $scope.analysis.docProperties.selectedProperty;
	    	//let visu = $scope.analysis.docProperties.selectedVisualisation ;
	    		
			
			
			if(verif()){
				if($scope.analysis.tabQueries.simpleQuerying){//Simple querying
					let promise1 = TabService.tabAvancedQuery(
							$scope.analysis.tabQueries.selectedMainTable, 
							$scope.analysis.tabQueries.selectedJoinTable, 
							$scope.analysis.tabQueries.selectedJoinType, 
							$scope.analysis.tabQueries.selectedMainTableColumns, 
							$scope.analysis.tabQueries.selectedJoinTableColumns, 
							$scope.analysis.tabQueries.selectedGroupField, 
							$scope.analysis.tabQueries.selectedAggColumns, 
							$scope.analysis.tabQueries.selectedAggOperation);
					promise1.then(function(result){
						//console.log(result);
						$scope.analysis.tabQueries.customQuery = result.query;
						let data = result.data;
						
						//Get columns
						let columns = [];
						if(data.length > 0){
							 columns = _.keys(data[0]);
						}
						
						
						//Create visu
						switch ($scope.analysis.tabQueries.selectedVisu){
							case 'Table':
								$scope.analysis.tabQueries.tableData = {};
								$scope.analysis.tabQueries.tableData.rows = data;
								$scope.analysis.tabQueries.tableData.columns = columns;		
								//Statistiques
								$scope.analysis.tabQueries.queryResults.unshift({"item":"Result count", "value":$scope.analysis.tabQueries.tableData.rows.length + " * "+ $scope.analysis.tabQueries.tableData.columns.length});
								
								break;
							case 'BarChart':
								if($scope.analysis.tabQueries.selectedAggOperation != null
										&& $scope.analysis.tabQueries.selectedGroupField != null){
										//Check grouping activated
										let visuKeys = [];
										let visuSeries = [];
										for(let col of columns){
											
											
											if(col == $scope.analysis.tabQueries.selectedGroupField.split(".")[1]){//key
												
												for(let row of data){
													visuKeys.push(row[col]);
												}
											}else{
												
												let serie = {};
												serie.name = col;
												serie.data = []
												for(let row of data){
													serie.data.push(row[col]);
												}
												visuSeries.push(serie);
											}	
										}
									
									$scope.analysis.tabQueries.multiBarChartData = {};
									$scope.analysis.tabQueries.multiBarChartData.keys = visuKeys;
									$scope.analysis.tabQueries.multiBarChartData.series = visuSeries;
								}else{
									$scope.analysis.tabQueries.multiBarChartData = {};
								}
								break;
								
							default:
								console.log("Option not taken into charge");
								$scope.analysis.tabQueries.errorMessage = "Option not taken into charge";
						}
						
						
						
						const diff = (new Date().getTime() - start);
						const elapsed = (preElapsedTime + diff)/1000;
						$scope.analysis.tabQueries.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
						$scope.analysis.tabQueries.isQuerying = false; //in all cases end querying
						
						
					},
					function(errResponse){
						console.log("Error while generating or running query");
						$scope.analysis.tabQueries.errorMessage = "Error while generating or running query";
						$scope.analysis.tabQueries.isQuerying = false; //in all cases end querying
					});
				}
				else{//Custom querying
					let promise2 = TabService.tabCustomQuery(
							$scope.analysis.tabQueries.customQuery);
					promise2.then(function(data){
						//console.log(result);
						//Get columns
						let columns = [];
						if(data.length > 0){
							 columns = _.keys(data[0]);
						}
						
						
						//Create visu
						switch ($scope.analysis.tabQueries.selectedVisu){
							case 'Table':
								$scope.analysis.tabQueries.tableData = {};
								$scope.analysis.tabQueries.tableData.rows = data;
								$scope.analysis.tabQueries.tableData.columns = columns;					
								break;
							case 'BarChart':
								if($scope.analysis.tabQueries.selectedAggOperation != null
										&& $scope.analysis.tabQueries.selectedGroupField != null){
										//Check grouping activated
										let visuKeys = [];
										let visuSeries = [];
										for(let col of columns){
											
											
											if(col == $scope.analysis.tabQueries.selectedGroupField.split(".")[1]){//key
												
												for(let row of data){
													visuKeys.push(row[col]);
												}
											}else{
												
												let serie = {};
												serie.name = col;
												serie.data = []
												for(let row of data){
													serie.data.push(row[col]);
												}
												visuSeries.push(serie);
											}	
										}
									
									$scope.analysis.tabQueries.multiBarChartData = {};
									$scope.analysis.tabQueries.multiBarChartData.keys = visuKeys;
									$scope.analysis.tabQueries.multiBarChartData.series = visuSeries;
								}else{
									$scope.analysis.tabQueries.multiBarChartData = {};
								}
								break;
								
							default:
								console.log("Option not taken into charge");
								$scope.analysis.tabQueries.errorMessage = "Option not taken into charge";
						}
						
						const diff = (new Date().getTime() - start);
						const elapsed = (preElapsedTime + diff)/1000;
						
						//Statistiques
						$scope.analysis.tabQueries.queryResults.unshift({"item":"Result count", "value":$scope.analysis.tabQueries.tableData.rows.length + " * "+ $scope.analysis.tabQueries.tableData.columns.length});
						$scope.analysis.tabQueries.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
						$scope.analysis.tabQueries.isQuerying = false; //in all cases end querying
					},
					function(errResponse){
						console.log("Error while generating or running query");
						$scope.analysis.tabQueries.errorMessage = "Error while generating or running custom query";
						$scope.analysis.tabQueries.isQuerying = false; //in all cases end querying
					});
					
					
					
				}
				
				
			}else{
				$scope.analysis.tabQueries.errorMessage = "Missing data";
				$scope.analysis.tabQueries.isQuerying = false; //in all cases end querying
			}
	    	//QUERY RUN
	    	
	    	
	    	
			
			
    	 };
	

      
}]);














