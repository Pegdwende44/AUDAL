
// MANAGING DOC PROPERTIES VISUALISATION
app.controller('tabPropertiesController', ['$scope', 'NgTableParams','$q','stat', 'TabService', function($scope, NgTableParams, $q, stat, TabService) {
	
	
	$scope.analysis.tabProperties.updateVisu = function(){
		let visus = {'Shape':['MultiBarChart'], 'Columns':['Table'], 
				'Grouping':['BarChart', 'Polar'],
				'INTEGER':['Table'], 'STRING':['Table']};
		let selectedPropertyType = $scope.analysis.tabProperties.selectedProperty.type;
		
		$scope.analysis.tabProperties.availableVisu = visus[selectedPropertyType];
		$scope.analysis.tabProperties.selectedVisu = $scope.analysis.tabProperties.availableVisu[0];
		$scope.analysis.generalQuery();
	};
	
	
	
	
	$scope.analysis.tabProperties.showContent = function(id, title){
		$scope.analysis.tabProperties.errorMessage = null;

		let promise = TabService.loadTabContent(id, title);
		//console.log(id);
		promise.then(function(data){
			
			
			var file = data;//new Blob([data], { type: 'application/pdf;charset=utf-8' });
   			saveAs(file, title);
		},
		function(errResponse){
			$scope.analysis.tabProperties.errorMessage = "Error while loding table data"+errResponse;
		});
		
		
		
		//$('#contentModal').modal('show');
	};	
	
	
	
	
	
	var init = function(){
		//$scope.analysis.tabProperties = {};	

		
		let promise = TabService.loadTabProperties();
		promise.then(function(data){
			$scope.analysis.tabProperties.availableProperties = data;
			$scope.analysis.tabProperties.availableProperties.push({"name":"Shape", "type":"Shape"});
			$scope.analysis.tabProperties.availableProperties.push({"name":"Columns", "type":"Columns"});
			$scope.analysis.tabProperties.selectedProperty = $scope.analysis.tabProperties.availableProperties[0];
			$scope.analysis.tabProperties.updateVisu();
		},
		function(errResponse){
			console.log("Error while loading Table properties");
			$scope.analysis.tabProperties.errorMessage = "Error while loading Table properties";
		});
	}
	init();
	
	
	var verif = function(){
		return (($scope.analysis.tabProperties.selectedProperty != undefined )
		&& ($scope.analysis.tabProperties.selectedProperty != null) 
		&& ($scope.analysis.tabProperties.selectedVisu != undefined)
		&& ($scope.analysis.tabProperties.selectedVisu != null)
		&& ($scope.tables.selectedTableIds != undefined)
		&& ($scope.tables.selectedTableIds != null));
	}
			
	
	
	
	
	//preElapsedTime to consider time for data loading
	$scope.analysis.tabProperties.query = function(preElapsedTime=0){
		$scope.analysis.tabProperties.errorMessage = null;
			$scope.analysis.tabProperties.queryResults = [];
			const start = new Date().getTime();
			$scope.analysis.tabProperties.isQuerying = true;
	    	
			
			
			
			if(verif()){
				
				let property =  $scope.analysis.tabProperties.selectedProperty.name ;
		    	let selectedVisu = $scope.analysis.tabProperties.selectedVisu ;
		    	
				switch(selectedVisu){
					case 'Table':
						if($scope.analysis.tabProperties.selectedProperty.name != 'Columns'){
							//Simple properties query
						
							let promise1 = TabService.getTabAssociatedProperties($scope.tables.selectedTableIds, property);
								promise1.then(function(data){
									
									$scope.analysis.tabProperties.tableData = [];
				        			for ([key, val] of Object.entries(data)){
				        				$scope.analysis.tabProperties.tableData.push({'identifier':key, 'value': val});
				        			}
				        			$scope.analysis.tabProperties.tableTitle = property;
				        			
				        			
									//Statistiques
									const diff = (new Date().getTime() - start);
									const elapsed = (preElapsedTime + diff)/1000;
									$scope.analysis.tabProperties.queryResults = [];
									$scope.analysis.tabProperties.queryResults.unshift({"item":"Result count", "value": $scope.tables.selectedTableIds.length});
									$scope.analysis.tabProperties.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
									$scope.analysis.tabProperties.isQuerying = false; //in all cases end querying
									
								},
								function(errResponse){
									console.log("Error while loading table properties");
									$scope.analysis.tabProperties.errorMessage = "Error while loading table properties";
									$scope.analysis.tabProperties.isQuerying = false; //in all cases end querying
								});
								
							}else{//Columns Query
								
								let promise6 = TabService.getTabColumns($scope.tables.selectedTableIds);
								promise6.then(function(data){
									
									let columnsData = data;
									
									$scope.analysis.tabProperties.tableData2 = [];
				        			for (item of $scope.tables.selectedTables){
				        				$scope.analysis.tabProperties.tableData2.push({'identifier':item.identifier, 'title': item.title, 'columns':columnsData[item.identifier]});
				        			}
				        			
				        			
									//Statistiques
									const diff = (new Date().getTime() - start);
									const elapsed = (preElapsedTime + diff)/1000;
									$scope.analysis.tabProperties.queryResults = [];
									$scope.analysis.tabProperties.queryResults.unshift({"item":"Result count", "value": $scope.tables.selectedTableIds.length});
									$scope.analysis.tabProperties.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
									$scope.analysis.tabProperties.isQuerying = false; //in all cases end querying
								},
								function(errResponse){
									console.log("Error while loading table columns");
									$scope.analysis.tabProperties.errorMessage = "Error while loading table properties";
									$scope.analysis.tabProperties.isQuerying = false; //in all cases end querying
								});
							}
						break;
							
							
					case 'BarChart':
					case 'Polar':
						let promise2 = TabService.getTabAssociatedProperties($scope.tables.selectedTableIds, property);
						//let promise3 = TabService.getTabAssociatedProperties($scope.tables.selectedTableIds, 'title');
						promise2.then(function(data){
							let distribution = _.countBy(_.mapValues(data));
							let barChartData = {};
		        			barChartData.keys = Object.keys(distribution);
		        			barChartData.values = Object.values(distribution);
		        			barChartData.label = property;
		        			$scope.analysis.tabProperties.barChartData  = barChartData;
		        			
							
							//Statistiques
							const diff = (new Date().getTime() - start);
							const elapsed = (preElapsedTime + diff)/1000;
							$scope.analysis.tabProperties.queryResults = [];
							$scope.analysis.tabProperties.queryResults.unshift({"item":"Result count", "value": $scope.tables.selectedTableIds.length});
							$scope.analysis.tabProperties.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
							$scope.analysis.tabProperties.isQuerying = false; //in all cases end querying
						},
						function(errResponse){
							console.log("Error while loading table properties barchart");
							$scope.analysis.tabProperties.errorMessage = "Error while loading table properties barchart";
							$scope.analysis.tabProperties.isQuerying = false; //in all cases end querying
						});
					break;
					
					
					case 'MultiBarChart':
						let promise3 = TabService.getTabAssociatedProperties($scope.tables.selectedTableIds, 'nbRow');
						let promise4 = TabService.getTabAssociatedProperties($scope.tables.selectedTableIds, 'nbCol');
						let promise5 = TabService.getTabAssociatedProperties($scope.tables.selectedTableIds, 'title');
						$q.all([promise3, promise4, promise5]).then(function(data){
							let nbRowData = data[0];
							let nbColData = data[1];
							let titleData = data[2];
							
							let multiBarChartData = {};
							multiBarChartData.keys = [];
							multiBarChartData.values1 = [];
							multiBarChartData.values2 = [];
							multiBarChartData.label1 = 'nbRow';
							multiBarChartData.label2 = 'nbCol';
		        			for(let item of $scope.tables.selectedTables){
		        				let identifier = item.identifier
		        				multiBarChartData.keys.push(titleData[identifier]);
		        				multiBarChartData.values1.push(nbRowData[identifier]);
		        				multiBarChartData.values2.push(nbColData[identifier]);
		        			}
		        			$scope.analysis.tabProperties.multiBarChartData  = multiBarChartData;
		        			$scope.analysis.tabProperties.multiBarChartTitle  = "Table shapes";
		        			
							
							//Statistiques
							const diff = (new Date().getTime() - start);
							const elapsed = (preElapsedTime + diff)/1000;
							$scope.analysis.tabProperties.queryResults = [];
							$scope.analysis.tabProperties.queryResults.unshift({"item":"Result count", "value": $scope.tables.selectedTableIds.length});
							$scope.analysis.tabProperties.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
							$scope.analysis.tabProperties.isQuerying = false; //in all cases end querying
						},
						function(errResponse){
							console.log("Error while loading table properties shape");
							$scope.analysis.tabProperties.errorMessage = "Error while loading table properties shape";
							$scope.analysis.tabProperties.isQuerying = false; //in all cases end querying
						});
					break;
						
					default:
							console.log("Option not managed");
							$scope.analysis.tabProperties.errorMessage = "Option not managed";
							const diff = (new Date().getTime() - start);
							const elapsed = (preElapsedTime + diff)/1000;
							$scope.analysis.tabProperties.queryResults = [];
							$scope.analysis.tabProperties.queryResults.unshift({"item":"Result count", "value":$scope.tables.selectedTableIds.length});
							$scope.analysis.tabProperties.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
							$scope.analysis.tabProperties.isQuerying = false; //in all cases end querying
				
						}
			}else{
				$scope.analysis.tabProperties.errorMessage = "Missing data";
				//Statistiques
				const diff = (new Date().getTime() - start);
				const elapsed = (preElapsedTime + diff)/1000;
				//$scope.analysis.tabProperties.queryResults.unshift({"item":"Result count", "value":$scope.tables.selectedTableIds.length});
				//$scope.analysis.tabProperties.queryResults.unshift({"item":"Query time (s)", "value":elapsed});
				$scope.analysis.tabProperties.isQuerying = false; //in all cases end querying
			}
						
			
    	 };
	

      
}]);














