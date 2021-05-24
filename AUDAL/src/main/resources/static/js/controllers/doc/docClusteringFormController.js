
// MANAGING DOC PROPERTIES VISUALISATION
app.controller('docClusteringController', ['$scope', 'DocService','$q','stat', function($scope, DocService, $q, stat) {
	
	var updateVisu = function(){
		let visus = {"KMeans":["Table","Groups"], "PCA":["Table","Bullets"]};
		if($scope.analysis.docClustering.selectedAnalysis != null){
			$scope.analysis.docClustering.availableVisu = visus[$scope.analysis.docClustering.selectedAnalysis];
			$scope.analysis.docClustering.selectedVisu = $scope.analysis.docClustering.availableVisu[0];
		}else{
			$scope.analysis.docClustering.availableVisu = [];
		}	
	}
	
	
	
	var init = function(){
		$scope.analysis.docClustering = {};
		$scope.analysis.docClustering.availableAnalysis = ['KMeans', 'PCA'];
		$scope.analysis.docClustering.selectedAnalysis = $scope.analysis.docClustering.availableAnalysis[0];
		$scope.analysis.docClustering.availableVisu = ["Table","Groups", "Radar"];
		updateVisu();
		$scope.analysis.docClustering.updateVisu = updateVisu;
		//$scope.analysis.docClustering.availableRepresentations = [{'vocabulary':'global_vocabulary', 'format':'embedding'}];
		//$scope.analysis.docClustering.selectedRepresentation = $scope.analysis.docClustering.availableRepresentations[0];
	}
	init();
	

	
	
	var verif = function(){
		return ($scope.analysis.docClustering.selectedVisu != null && $scope.analysis.docClustering.selectedVisu != undefined
		&& $scope.analysis.docClustering.selectedRepresentation != null && $scope.analysis.docClustering.selectedRepresentation != undefined
		&& $scope.analysis.docClustering.selectedAnalysis != null && $scope.analysis.docClustering.selectedAnalysis != undefined
		&& $scope.analysis.docClustering.selectedLabel != null && $scope.analysis.docClustering.selectedLabel != undefined
		&& $scope.analysis.data.identifiers.length > 0);
	};
	
	
	
	
	//preElapsedTime to consider time for data loading
	$scope.analysis.docClustering.query = function(preElapsedTime=0){
		$scope.analysis.docClustering.errorMessage = null;
			$scope.analysis.docClustering.queryResults = [];
			const start = new Date().getTime();
			$scope.analysis.docClustering.isQuerying = true;
	    	
			if(verif()){
				if($scope.analysis.docClustering.selectedAnalysis == "KMeans"){
					
					//console.log($scope.analysis.docClustering.selectedLabel);
					//console.log($scope.analysis.docClustering.selectedRepresentation);
					let promise1 = DocService.kMeansQuery(
							$scope.analysis.data.identifiers,
							$scope.analysis.docClustering.selectedLabel.groupingName,
							$scope.analysis.docClustering.selectedRepresentation.vocabulary,
							$scope.analysis.docClustering.kMeansNbClass);
					promise1.then(function(result){
						
						switch($scope.analysis.docClustering.selectedVisu){
						case 'Table':
							$scope.analysis.docClustering.tableData1 = {};
							$scope.analysis.docClustering.tableData1.rows = [];
							$scope.analysis.docClustering.tableData1.columns = ['cluster'];
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
										if(!$scope.analysis.docClustering.tableData1.columns.includes('mean_'+key)){
											$scope.analysis.docClustering.tableData1.columns.push('mean_'+key);
										}
									}
								
								
								
									//Add descriptive features
									for(let [key, val] of Object.entries(item.descriptiveFeatures)){
										newItem[key] = val;
										if(!$scope.analysis.docClustering.tableData1.columns.includes(key)){
											$scope.analysis.docClustering.tableData1.columns.push(key);
										}
									}
									
									//Add active features:
									for(let [key, val] of Object.entries(item.activeFeatures)){
										newItem[key] = val;
										if(!$scope.analysis.docClustering.tableData1.columns.includes(key)){
											$scope.analysis.docClustering.tableData1.columns.push(key);
										}
									}
									
									$scope.analysis.docClustering.tableData1.rows.push(newItem);
								}
							}
							
							//console.log($scope.analysis.docClustering.tableData1);
							$scope.analysis.docClustering.isQuerying = false; //in all cases end querying
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
								
									newItem['name'] = item.descriptiveFeatures['label'];
									
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
									}).value();
									
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
							$scope.analysis.docClustering.groupsChartData = values;
							//console.log($scope.analysis.Clustering.groupsChartData);
							
							break;
							
						
							
						default:
							console.log('Option not managed');
							$scope.analysis.docClustering.errorMessage = 'Option not managed';
						
						}
						//Statistiques
						const diff = (new Date().getTime() - start);
						const elapsed = (preElapsedTime + diff)/1000;
						var count = 0;
						for (let [clusterInfoTemp,clusterMembers] of Object.entries(result)){	
								count = count + clusterMembers.length ; 
						}
								
						$scope.analysis.docClustering.queryResults.unshift({"item":"Result count", "value":count});
						$scope.analysis.docClustering.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
						$scope.analysis.docClustering.queryResults.unshift({"item":"Agg. time (s)", "value":diff/1000});
						$scope.analysis.docClustering.isQuerying = false; 
						},
						function(errResponse){
							console.log("Error while making Clustering query "+errResponse);
							$scope.analysis.docClustering.errorMessage = "Error while making Clustering query "+errResponse;
							$scope.analysis.docClustering.isQuerying = false; 
						}
					);
				
				}
				else{//PCA
				
					
					let promise2 = DocService.pcaQuery(
							$scope.analysis.data.identifiers,
							$scope.analysis.docClustering.selectedLabel.groupingName,
							$scope.analysis.docClustering.selectedRepresentation.vocabulary);
							
					promise2.then(function(result){
						
						switch($scope.analysis.docClustering.selectedVisu){
						case 'Table':
							$scope.analysis.docClustering.tableData2 = {};
							$scope.analysis.docClustering.tableData2.rows = [];
							$scope.analysis.docClustering.tableData2.columns = [];
							for (let item of result){
								let newItem = {}
								
								//Add descriptive features
								for(let [key, val] of Object.entries(item.descriptiveFeatures)){
									newItem[key] = val;
									if(!$scope.analysis.docClustering.tableData2.columns.includes(key)){
										$scope.analysis.docClustering.tableData2.columns.push(key);
									}
								}
								
								//Add active features:
								for(let [key, val] of Object.entries(item.activeFeatures)){
									newItem[key] = val;
									if(!$scope.analysis.docClustering.tableData2.columns.includes(key)){
										$scope.analysis.docClustering.tableData2.columns.push(key);
									}
								}
								
								$scope.analysis.docClustering.tableData2.rows.push(newItem);
							}
							break;
						case 'Bullets':
							
							$scope.analysis.docClustering.bubbleChartData = [];
							for (let item of result){
								let newItem = {}
								
								
								//Add label
								if($scope.analysis.docClustering.selectedGroupField == null){//No grouping
									if($scope.analysis.docClustering.selectedVisuLabel != null){
										newItem['name'] = item.descriptiveFeatures[$scope.analysis.docClustering.selectedVisuLabel];
										
									}else{//No label defined
										if (Object.values(item.descriptiveFeatures).length > 0){//Choose first
											newItem['name'] = Object.values(item.descriptiveFeatures)[0];	
										}
										else{//Choose nothing
											newItem['name'] = '';	
										}
									}
								}else{//Grouping
									let label = $scope.analysis.docClustering.selectedGroupField.split('.')[1];
									newItem['name'] = item.descriptiveFeatures[label];
								}
							
								//Add active features:
								newItem['x'] = item.activeFeatures['comp1'];
								newItem['y'] = item.activeFeatures['comp2'];
								
								
								$scope.analysis.docClustering.bubbleChartData.push(newItem);
							}
							
							
							break;
						default:
							console.log("Choice not managed");
							$scope.analysis.docClustering.errorMessage = "Choice not managed";
						}
						
						
						//Statistiques
						const diff = (new Date().getTime() - start);
						const elapsed = (preElapsedTime + diff)/1000;
						
						$scope.analysis.docClustering.queryResults.unshift({"item":"Result count", "value":result.length});
						$scope.analysis.docClustering.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
						$scope.analysis.docClustering.queryResults.unshift({"item":"Agg. time (s)", "value":diff/1000});
						$scope.analysis.docClustering.isQuerying = false; 
						},
						function(errResponse){
							console.log("Error while querying PCA");
							$scope.analysis.docClustering.errorMessage = "Error while querying PCA";
							$scope.analysis.docClustering.isQuerying = false; 
						}
					);
				}
				
			
				
			}else{
				$scope.analysis.docClustering.errorMessage = "Missing data";
				const diff = (new Date().getTime() - start);
				const elapsed = (preElapsedTime + diff)/1000;
				
				//Statistiques
				//$scope.analysis.tabClustering.queryResults.unshift({"item":"Result count", "value":$scope.tables.selectedTables.length});
				$scope.analysis.docClustering.queryResults.unshift({"item":"Exp. time (s)", "value":preElapsedTime/1000});
				$scope.analysis.docClustering.queryResults.unshift({"item":"Agg. time (s)", "value":diff/1000});
				$scope.analysis.docClustering.isQuerying = false; //in all cases end querying
			}
    	 };
	

      
}]);














