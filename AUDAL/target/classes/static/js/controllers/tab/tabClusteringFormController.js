
// MANAGING DOC PROPERTIES VISUALISATION
app.controller('tabClusteringController', ['$scope', 'TabService','$q','stat', function($scope, TabService, $q, stat) {
	
	var init = function(){
		$scope.analysis.tabClustering = {};	
		$scope.analysis.tabClustering.simpleQuerying = true;
		$scope.analysis.tabClustering.activeAgg = false;
		$scope.analysis.tabClustering.activeAnalysis = false;
		$scope.analysis.tabClustering.joinTypes = [ {"key":"NONE", "value": "None"}];
		$scope.analysis.tabClustering.availableAnalysis = ["KMeans", "PCA"];
		$scope.analysis.tabClustering.selectedAnalysis = $scope.analysis.tabClustering.availableAnalysis[0];
		$scope.analysis.tabClustering.availableVisu = ["Table","Groups", "Radar"];
		$scope.analysis.tabClustering.selectedVisu = "Table";
		$scope.analysis.tabClustering.selectedAggOperation = "AVG";
	}
	init();
	
	$scope.analysis.tabClustering.activateSimpleQuerying = function(){
		$scope.analysis.tabClustering.simpleQuerying = true;
		
		$(".clustering-queryType").removeClass("active");
		$("#clusteringSimpleQuerying").addClass("active");
	}
	
	$scope.analysis.tabClustering.deactivateSimpleQuerying = function(){
		$scope.analysis.tabClustering.simpleQuerying = false;
		
		$(".clustering-queryType").removeClass("active");
		$("#clusteringCustomQuerying").addClass("active");
	}
	
	
	
	//Load joinable  tables related to choosed main table and join option
	var updateJoinTypes = function(){
		//console.log("update joinable tables");
		if($scope.analysis.tabClustering.selectedMainTable != null ){
			//Load main table columns
			let promise1 = TabService.getTabColumns([$scope.analysis.tabClustering.selectedMainTable.identifier]);
			promise1.then(function(data){
				
				$scope.analysis.tabClustering.mainTableColumns = Object.values(data)[0];
				//console.log($scope.analysis.tabClustering.mainTableColumns);
				//Create/Update selectedMainTableColumns and SelectedAggColumns
				$scope.analysis.tabClustering.selectedMainTableColumns = {};
				$scope.analysis.tabClustering.selectedAggColumns = {};
				//$scope.analysis.tabClustering.activeAgg = false;
				$scope.analysis.tabClustering.activeAgg = false;
				$scope.analysis.tabClustering.activeAnalysis = false;
				for(let column of $scope.analysis.tabClustering.mainTableColumns){
					
					$scope.analysis.tabClustering.selectedMainTableColumns[$scope.analysis.tabClustering.selectedMainTable.title+'.'+column.name] = true;
					if(column.type != 'STRING'){
						$scope.analysis.tabClustering.selectedAggColumns[$scope.analysis.tabClustering.selectedMainTable.title+'.'+column.name] = true;
						$scope.analysis.tabClustering.activeAgg = true;
						$scope.analysis.tabClustering.activeAnalysis = true;
					}
				}
				//console.log($scope.analysis.tabClustering.mainTableColumns);
			}, 
			function(errResponse){
				console.log("Error while loading main table columns");
				$scope.analysis.tabClustering.errorMessage = "Error while loading main table columns";
			});
			
			//if($scope.analysis.tabClustering.selectedJoinType.key != 'NONE'){			
				//Load joinable tables
				let promise2 = TabService.loadJoinableTables2($scope.analysis.tabClustering.selectedMainTable.identifier);
				promise2.then(function(data){
					//$scope.analysis.tabClustering.joinableTables = data;
					//Update available JOIN Types
					let selectedJoinType = $scope.analysis.tabClustering.selectedJoinType;
					$scope.analysis.tabClustering.joinTypes.length = 0;
					$scope.analysis.tabClustering.joinTypes.push({"key":"NONE", "value": "None"});
					if(data["inner"].length > 0){
						$scope.analysis.tabClustering.joinTypes.push({"key":"inner", "value":"INNER JOIN"});
					}
					if(data["left"].length > 0){
						$scope.analysis.tabClustering.joinTypes.push({"key":"left", "value":"LEFT JOIN"});
					}
					//if(data["right"].length > 0){
					//	$scope.analysis.tabClustering.joinTypes.push({"key":"right", "value":"RIGHT JOIN"});
					//}
					$scope.analysis.tabClustering.rawJoinableTables = data;
					$scope.analysis.tabClustering.rawJoinableTables["NONE"] = [];
				}, 
				function(errResponse){
					console.log("Error while loading joinable tables");
					$scope.analysis.tabClustering.errorMessage = "Error while loading joinable tables";
					$scope.analysis.tabClustering.joinableTables = [];
				});
			//}else{
			//	$scope.analysis.tabClustering.joinableTables = [];
			//}
		}else{//Main table null
			$scope.analysis.tabClustering.mainTableColumns = [];
			$scope.analysis.tabClustering.joinableTables = [];
		}
		
	}
	$scope.analysis.tabClustering.updateJoinTypes = updateJoinTypes;
	
	
	
	
	//Load joinable  tables related to choosed main table and join option
	var updateJoinableTables = function(){	
			let selectedJoinType = $scope.analysis.tabClustering.selectedJoinType;
			if(selectedJoinType == null){
				$scope.analysis.tabClustering.selectedJoinType = $scope.analysis.tabClustering.joinTypes[0];	
			}
			$scope.analysis.tabClustering.joinableTables = $scope.analysis.tabClustering.rawJoinableTables[$scope.analysis.tabClustering.selectedJoinType.key];
				
			
	
	}
	$scope.analysis.tabClustering.updateJoinableTables = updateJoinableTables;
	
	
	
	
	
	//Load/reload join table columns when changed
	var updateJoinTableColumns = function(){
		if($scope.analysis.tabClustering.selectedJoinTable != null){
			let promise2 = TabService.getTabColumns([$scope.analysis.tabClustering.selectedJoinTable.tableId]);
			promise2.then(function(data){
				$scope.analysis.tabClustering.joinTableColumns = Object.values(data)[0];
				//Create/Update selectedMainTableColumns and SelectedAggColumns
				$scope.analysis.tabClustering.selectedJoinTableColumns = {};
				
				for(let column of $scope.analysis.tabClustering.joinTableColumns){
					$scope.analysis.tabClustering.selectedJoinTableColumns[$scope.analysis.tabClustering.selectedJoinTable.tableName+'.'+column.name] = true;
					if(column.type != 'STRING'){
						$scope.analysis.tabClustering.selectedAggColumns[$scope.analysis.tabClustering.selectedJoinTable.tableName+'.'+column.name] = true;
						$scope.analysis.tabClustering.activeAgg = true;
						$scope.analysis.tabClustering.activeAnalysis = true;
					}
				}
			}, 
			function(errResponse){
				console.log("Error while loading join table columns");
				$scope.analysis.tabClustering.errorMessage ="Error while loading join table columns";
			});
		}
		else{
			$scope.analysis.tabClustering.joinTableColumns = [];
		}
	}
	$scope.analysis.tabClustering.updateJoinTableColumns = updateJoinTableColumns;
	
	
	
	
	var updateVisu = function(){
		let visus = {"KMeans":["Table","Groups", "Radar"], "PCA":["Table","Bullets"]};
		if($scope.analysis.tabClustering.selectedAnalysis != null){
			$scope.analysis.tabClustering.availableVisu = visus[$scope.analysis.tabClustering.selectedAnalysis];
			$scope.analysis.tabClustering.selectedVisu = $scope.analysis.tabClustering.availableVisu[0];
		}else{
			$scope.analysis.tabClustering.availableVisu = [];
		}
		
		
	}
	$scope.analysis.tabClustering.updateVisu = updateVisu;
	
	
	var verif = function(){
		return (($scope.analysis.tabClustering.selectedMainTable != null 
				&& $scope.analysis.tabClustering.selectedMainTable != undefined
				&& $scope.analysis.tabClustering.selectedMainTableColumns != null
				&& $scope.analysis.tabClustering.selectedMainTableColumns != undefined));
	};
	
	
	
	
	//preElapsedTime to consider time for data loading
	$scope.analysis.tabClustering.query = function(preElapsedTime=0){
		$scope.analysis.tabClustering.errorMessage = null;
			$scope.analysis.tabClustering.queryResults = [];
			const start = new Date().getTime();
			$scope.analysis.tabClustering.isQuerying = true;
	    	
			if(verif()){
				if($scope.analysis.tabClustering.selectedAnalysis == "KMeans"){
					if($scope.analysis.tabClustering.simpleQuerying){
						$scope.analysis.tabClustering.customQuery = TabService.makeQuery(
							$scope.analysis.tabClustering.selectedMainTable, 
							$scope.analysis.tabClustering.selectedJoinTable, 
							$scope.analysis.tabClustering.selectedJoinType, 
							$scope.analysis.tabClustering.selectedMainTableColumns, 
							$scope.analysis.tabClustering.selectedJoinTableColumns, 
							$scope.analysis.tabClustering.selectedGroupField, 
							$scope.analysis.tabClustering.selectedAggColumns, 
							$scope.analysis.tabClustering.selectedAggOperation);
					}
					//console.log($scope.analysis.tabClustering.selectedMainTableColumns);
					//console.log($scope.analysis.tabClustering.selectedJoinTableColumns);
					//console.log($scope.analysis.tabClustering.selectedAggColumns);
					
					let promise1 = TabService.kMeansQuery(
							$scope.analysis.tabClustering.customQuery,
							$scope.analysis.tabClustering.kMeansNbClass);
					promise1.then(function(result){
						
						switch($scope.analysis.tabClustering.selectedVisu){
						case 'Table':
							$scope.analysis.tabClustering.tableData1 = {};
							$scope.analysis.tabClustering.tableData1.rows = [];
							$scope.analysis.tabClustering.tableData1.columns = ['cluster'];
							var i = 0;
							for (let [clusterInfoTemp,clusterMembers] of Object.entries(result)){
								i++;
								
								let clusterInfoTemp2 = clusterInfoTemp.replace(/=/gi, ":");
								let clusterInfoTemp3 = clusterInfoTemp2.replace(/:/gi, '":');
								let clusterInfoTemp4 = clusterInfoTemp3.replace(/{/gi, '{"');
								let clusterInfoTemp5 = clusterInfoTemp4.replace(/, /gi, ', "');
								
								let clusterInfo = JSON.parse(clusterInfoTemp5);
								
								for(let item of clusterMembers){
									
									let newItem = {}
									
									//ClusterData
									newItem['cluster'] = i;
									
									for(let [key,val] of Object.entries(clusterInfo)){
										newItem['mean_'+key] = val;
										if(!$scope.analysis.tabClustering.tableData1.columns.includes('mean_'+key)){
											$scope.analysis.tabClustering.tableData1.columns.push('mean_'+key);
										}
									}
								
								
								
									//Add descriptive features
									for(let [key, val] of Object.entries(item.descriptiveFeatures)){
										newItem[key] = val;
										if(!$scope.analysis.tabClustering.tableData1.columns.includes(key)){
											$scope.analysis.tabClustering.tableData1.columns.push(key);
										}
									}
									
									//Add active features:
									for(let [key, val] of Object.entries(item.activeFeatures)){
										newItem[key] = val;
										if(!$scope.analysis.tabClustering.tableData1.columns.includes(key)){
											$scope.analysis.tabClustering.tableData1.columns.push(key);
										}
									}
									
									$scope.analysis.tabClustering.tableData1.rows.push(newItem);
								}
							}
							
							//console.log(result);
							break;
						case 'Groups':
							var values = [];
							var i = 0;
							for (let [clusterInfoTemp,clusterMembers] of Object.entries(result)){
								i++;
								
								let clusterInfoTemp2 = clusterInfoTemp.replace(/=/gi, ":");
								let clusterInfoTemp3 = clusterInfoTemp2.replace(/:/gi, '":');
								let clusterInfoTemp4 = clusterInfoTemp3.replace(/{/gi, '{"');
								let clusterInfoTemp5 = clusterInfoTemp4.replace(/, /gi, ', "');
								let clusterInfo = JSON.parse(clusterInfoTemp5);
								
								let clusterValues = {};
								clusterValues.data = [];
								clusterValues['name'] = 'cluster' + i;
								for(let item of clusterMembers){
									//Add label
									let newItem = {};
									if($scope.analysis.tabClustering.selectedGroupField == null){//No grouping
										if($scope.analysis.tabClustering.selectedVisuLabel != null){
											newItem['name'] = item.descriptiveFeatures[$scope.analysis.tabClustering.selectedVisuLabel];
											
										}else{//No label defined
											if (Object.values(item.descriptiveFeatures).length > 0){//Choose first
												newItem['name'] = Object.values(item.descriptiveFeatures)[0];	
											}
											else{//Choose nothing
												newItem['name'] = '';	
											}
										}
									}else{//Grouping
										let label = $scope.analysis.tabClustering.selectedGroupField.split('.')[1];
										newItem['name'] = item.descriptiveFeatures[label];
									}
									newItem['count'] = 1;
									clusterValues.data.push(newItem);
									
									//GROUPING
									let groupedTemp = _(clusterValues.data)
									.groupBy('name')
									.map((objs, key) => {
			
									    return {
									        'name': key,
									        'count': _.sumBy(objs, 'count'),	
									    }
									})
									.value();
									
									let grouped = groupedTemp.map((elt) => {
										if(elt['count'] > 0){
											return{
												'name': elt['name'],
												'value': 100 + 25 * elt['count'],
												'count': elt['count']
											}
										}
									})
									//console.log(groupedTemp);
									//console.log(grouped);
									clusterValues.data = grouped;
									//$scope.analysis.tabClustering.tableData1.rows.push(newItem);
								}
								values.push(clusterValues);
							}
							$scope.analysis.tabClustering.groupsChartData = values;
							//console.log($scope.analysis.tabClustering.groupsChartData);
							
							break;
							
						case 'Radar':
							var keys = null;
							var series = [];
							let k=0;
							for (let [clusterInfoTemp,clusterMembers] of Object.entries(result)){
								k++;
								
								let clusterInfoTemp2 = clusterInfoTemp.replace(/=/gi, ":");
								let clusterInfoTemp3 = clusterInfoTemp2.replace(/:/gi, '":');
								let clusterInfoTemp4 = clusterInfoTemp3.replace(/{/gi, '{"');
								let clusterInfoTemp5 = clusterInfoTemp4.replace(/, /gi, ', "');
								let clusterInfo = JSON.parse(clusterInfoTemp5);
								
								if(keys == null){//First iteration, init keys
									 keys = Object.keys(clusterInfo);
								}
								let values = [];
								for(let key of keys){
									values.push(clusterInfo[key]);
								}
									
								series.push({
                			        name: 'Cluster '+k,
                			        data: values,
                			        pointPlacement: 'on'
                			    });
							}
							
							$scope.analysis.tabClustering.radarChartData = {};
							$scope.analysis.tabClustering.radarChartData.keys = keys;
							$scope.analysis.tabClustering.radarChartData.series = series;
							break;
							
							
						default:
							console.log('Option not managed');
							$scope.analysis.tabClustering.errorMessage = 'Option not managed';
						
						}
						//Statistiques
						const diff = (new Date().getTime() - start);
						const elapsed = (preElapsedTime + diff)/1000;
						var count = 0;
						for (let [clusterInfoTemp,clusterMembers] of Object.entries(result)){	
								count = count + clusterMembers.length ; 
						}
								
						$scope.analysis.tabClustering.queryResults.unshift({"item":"Result count", "value":count});
						$scope.analysis.tabClustering.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
						$scope.analysis.tabClustering.isQuerying = false; 
						},
						function(errResponse){
							console.log("Error while querying KMeans");
							$scope.analysis.tabClustering.errorMessage = "Error while querying KMeans";
							$scope.analysis.tabClustering.isQuerying = false; 
						}
					);
				
				}
				else{//PCA
				
					if($scope.analysis.tabClustering.simpleQuerying){
						$scope.analysis.tabClustering.customQuery = TabService.makeQuery(
							$scope.analysis.tabClustering.selectedMainTable, 
							$scope.analysis.tabClustering.selectedJoinTable, 
							$scope.analysis.tabClustering.selectedJoinType, 
							$scope.analysis.tabClustering.selectedMainTableColumns, 
							$scope.analysis.tabClustering.selectedJoinTableColumns, 
							$scope.analysis.tabClustering.selectedGroupField, 
							$scope.analysis.tabClustering.selectedAggColumns, 
							$scope.analysis.tabClustering.selectedAggOperation);
					}
					let promise2 = TabService.pcaQuery(
							$scope.analysis.tabClustering.customQuery);
					promise2.then(function(result){
						
						switch($scope.analysis.tabClustering.selectedVisu){
						case 'Table':
							$scope.analysis.tabClustering.tableData2 = {};
							$scope.analysis.tabClustering.tableData2.rows = [];
							$scope.analysis.tabClustering.tableData2.columns = [];
							for (let item of result){
								let newItem = {}
								
								//Add descriptive features
								for(let [key, val] of Object.entries(item.descriptiveFeatures)){
									newItem[key] = val;
									if(!$scope.analysis.tabClustering.tableData2.columns.includes(key)){
										$scope.analysis.tabClustering.tableData2.columns.push(key);
									}
								}
								
								//Add active features:
								for(let [key, val] of Object.entries(item.activeFeatures)){
									newItem[key] = val;
									if(!$scope.analysis.tabClustering.tableData2.columns.includes(key)){
										$scope.analysis.tabClustering.tableData2.columns.push(key);
									}
								}
								
								$scope.analysis.tabClustering.tableData2.rows.push(newItem);
							}
							break;
						case 'Bullets':
							
							$scope.analysis.tabClustering.bubbleChartData = [];
							for (let item of result){
								let newItem = {}
								
								
								//Add label
								if($scope.analysis.tabClustering.selectedGroupField == null){//No grouping
									if($scope.analysis.tabClustering.selectedVisuLabel != null){
										newItem['name'] = item.descriptiveFeatures[$scope.analysis.tabClustering.selectedVisuLabel];
										
									}else{//No label defined
										if (Object.values(item.descriptiveFeatures).length > 0){//Choose first
											newItem['name'] = Object.values(item.descriptiveFeatures)[0];	
										}
										else{//Choose nothing
											newItem['name'] = '';	
										}
									}
								}else{//Grouping
									let label = $scope.analysis.tabClustering.selectedGroupField.split('.')[1];
									newItem['name'] = item.descriptiveFeatures[label];
								}
							
								//Add active features:
								newItem['x'] = item.activeFeatures['comp1'];
								newItem['y'] = item.activeFeatures['comp2'];
								
								
								$scope.analysis.tabClustering.bubbleChartData.push(newItem);
							}
							
							
							break;
						default:
							console.log("Choice not managed");
							$scope.analysis.tabClustering.errorMessage = "Choice not managed";
						}
						
						
						//Statistiques
						const diff = (new Date().getTime() - start);
						const elapsed = (preElapsedTime + diff)/1000;
						/*var count = 0;
						for (let [clusterInfoTemp,clusterMembers] of Object.entries(result)){	
								count = count + clusterMembers.length ; 
						}*/
						$scope.analysis.tabClustering.queryResults.unshift({"item":"Result count", "value":result.length});
						$scope.analysis.tabClustering.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
						$scope.analysis.tabClustering.isQuerying = false; 
						},
						function(errResponse){
							console.log("Error while querying PCA");
							$scope.analysis.tabClustering.errorMessage = "Error while querying PCA";
							$scope.analysis.tabClustering.isQuerying = false; 
						}
					);
				}
				
				
				
			}else{
				$scope.analysis.tabClustering.errorMessage = "Missing data";
				const diff = (new Date().getTime() - start);
				const elapsed = (preElapsedTime + diff)/1000;
				
				//Statistiques
				//$scope.analysis.tabClustering.queryResults.unshift({"item":"Result count", "value":$scope.tables.selectedTables.length});
				$scope.analysis.tabClustering.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
				$scope.analysis.tabClustering.isQuerying = false; //in all cases end querying
			}
    	 };
	

      
}]);














