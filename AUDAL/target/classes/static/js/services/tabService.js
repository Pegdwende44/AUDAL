

//SERVICE FOR GLOBAL DATA ACCESS
app.service('TabService', function($http, $q, $timeout) {
	
	//Function to load Data from groupings and terms search
	var loadTables = function(checkedGroups, posMatchingTerms, negMatchingTerms, termsStrictness, termsFuzzy, show){
		
		deferAll = $q.defer();
		var promises = [];
		var resultGroupings = {};
		var resultPosTerms = {};
		var resultNegTerms = {};
		
		//Groupings
		let defer1 = $q.defer();
		let parameters1 = {'show':show};
		$.each(checkedGroups, function(grouping, groups){
		    let queryGroups = []
		    $.each(groups, function(group, isChecked){
		    if(isChecked){
		    	queryGroups.push(group);
		    }
		    
		    }); 
		    if(grouping=="mimeType"){
		    	parameters1[grouping] = queryGroups.toString();
		    }
		});
		
		
		//console.log(parameters1);
		
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/tables/tablesByGroups',
			params:parameters1,
			cache:true
		}).then(function(response) {
				resultGroupings = response.data;
				
				defer1.resolve(resultGroupings);
				
			},function(errResponse) {
				defer1.reject("Error while loading documents from groupings - Error Message: '"	+ errResponse.data.errorMessage);
		});
		promises.push(defer1.promise);
		
		
		//Positive terms matching
		if(posMatchingTerms.length != 0){
			let defer2 = $q.defer();
			//console.log("strictness - pos "+posMatchingTerms.toString());
			let parameters2 = {'matching':1, 
					'fuzzy':termsFuzzy, 
					'strict':termsStrictness, 
					'terms':posMatchingTerms.toString(), 
					'show':show,
					'pageSize':10000};
			$http({
				method : 'GET',
				url : 'http://159.84.108.104:8081/tables/tablesByTerms',
				params:parameters2,
				cache:true
			}).then(function(response) {
					resultPosTerms = response.data;
					//console.log(response.data);
					defer2.resolve(resultPosTerms);
				},function(errResponse) {
					defer2.reject("Error while loading tables from positive terms - Error Message: '"	+ errResponse);
				
			});
			promises.push(defer2.promise);
		}
		
		
		//Negative terms matching
		if(negMatchingTerms.length != 0){
			let defer3 = $q.defer();
			let parameters3 = {'matching':0, 
					'fuzzy':termsFuzzy, 
					'strict':termsStrictness, 
					'terms':negMatchingTerms.toString(), 
					'show':show,
					'pageSize':10000};
			
			$http({
				method : 'GET',
				url : 'http://159.84.108.104:8081/tables/tablesByTerms',
				params:parameters3,
				cache:true
			}).then(function(response) {
					resultNegTerms = response.data;
					
					defer3.resolve(resultNegTerms);
				},function(errResponse) {
					defer3.reject("Error while loading tables from negative terms - Error Message: '"	+ errResponse.data.errorMessage);
				
			});
			promises.push(defer3.promise);
		}
		
		//When all queries OK
		$q.all(promises).then(function(response){
			//Union
			let resultTemp = JSON.parse(JSON.stringify(resultGroupings));
			
			if(negMatchingTerms.length != 0){
				resultTemp = _.merge(resultTemp, resultNegTerms);
			}
			if(posMatchingTerms.length != 0){
				resultTemp = _.merge(resultTemp, resultPosTerms);	
			}
			let keysTemp = _.keys(resultGroupings); 
						
			if(negMatchingTerms.length != 0){
				keysTemp = _.intersection(keysTemp, _.keys(resultNegTerms));
			}
			
			if(posMatchingTerms.length != 0){
				keysTemp = _.intersection(keysTemp, _.keys(resultPosTerms));
			}
			
			let result = _.pick(resultTemp, keysTemp);
			
			deferAll.resolve(result);		
		},
		function(errResponse){
			console.log("Error while loading tables "+errResponse);
			deferAll.reject("Error while loading Tables "+errResponse);
		})
		
		return deferAll.promise;
	}
	
	this.loadTables = loadTables;
	
	
	
	//Function to load list of available doc properties
	this.loadTabProperties = function(){
		
		let defer = $q.defer();
		var docProperties = [];
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/global/tablesProperties'
		}).then(function(response) {
			tabProperties = response.data;
	
			
			//Add groupings
			$http({
				method : 'GET',
				url : 'http://159.84.108.104:8081/global/tabGroupings'
			}).then(function(response) {
				groupingNames = response.data;
				groupingNames.forEach((groupingName) => {
					tabProperties.push({"name":groupingName, "type":"Grouping"});
				});
				//remove identifier
				let filteredTabProperties = tabProperties.filter(function(value, index, arr){ return value.name != 'identifier' ;});
				defer.resolve(filteredTabProperties);
				
				},function(errResponse) {
					$scope.errorMessage = "Error while loading Groupings - Error Message: '"
						+ errResponse.status;
				console.log("Error while loading Groupings");
				 defer.reject();
				
			});
		
		},
		function(errResponse) {
			let errorMessage = "Error while loading tables properties - Error Message: '"
					+ errResponse.status;
			console.log(errorMessage);
			defer.reject(errorMessage);
		});	
		return defer.promise;
	}
	
	
	//Function to load list of available tab properties
	var getTabAssociatedProperties = function(identifiers, property){
		
		let defer = $q.defer();
		if(identifiers != null){
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/tables/tablesProperties',
			params:{'ids':identifiers, 'show':property}
		}).then(function(response) {
			result = response.data;
			defer.resolve(result);
			
			},function(errResponse) {
				
				defer.reject("Error while loading tables properties - Error Message: '"
						+ errResponse.status);
			
		});
		}else{
			return defer.reject("Empty data");
		}
		return defer.promise;
	}
	
	this.getTabAssociatedProperties = getTabAssociatedProperties;
	
	
	
	
	
	//Function to load list of available tab properties
	var getTabColumns = function(identifiers){
		
		let defer = $q.defer();
		if(identifiers != null){
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/tables/tablesColumns',
			params:{'ids':identifiers.toString()}
		}).then(function(response) {
			result = response.data;
			defer.resolve(result);
			
			},function(errResponse) {
				console.log("Error while loading tables columns - Error Message: '"
						+ errResponse.status);
				defer.reject("Error while loading tables columns - Error Message: '"
						+ errResponse.status);
			
		});
		}else{
			return defer.reject("Empty data");
		}
		return defer.promise;
	}
	
	this.getTabColumns = getTabColumns;
	
	
	
	
	//Function to load a table columns content
	var tabSimpleQuery = function(tableName, columnNames){
		
		let defer = $q.defer();
		if(columnNames != null && tableName != null){
			//Make the query
			let select = "SELECT "+columnNames.toString().replace("[", "").replace("]", "")+" ";
			let from = "FROM "+tableName+" ";
			let where = " ";
			let query = select + from + where;
			//console.log(query);
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/tables/simpleQuery',
			params:{'q':query}
		}).then(function(response) {
			result = response.data;
			defer.resolve(result);
			
			},function(errResponse) {
				console.log("Error while loading tables data - Error Message: '"
						+ errResponse.status);
				defer.reject("Error while loading tables data - Error Message: '"
						+ errResponse.status);
			
		});
		}else{
			return defer.reject("Empty data");
		}
		return defer.promise;
	}
	
	this.tabSimpleQuery = tabSimpleQuery;
	
	
	
	//Function to run tables query
	var tabCustomQuery = function(query){
		
		let defer = $q.defer();
		if(query != null && query != undefined){
			
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/tables/simpleQuery',
			params:{'q':query}
		}).then(function(response) {
			result = response.data;
			defer.resolve(result);
			
			},function(errResponse) {
				console.log("Error while running tables query - Error Message: '"
						+ errResponse.status);
				defer.reject("Error while running tables query - Error Message: '"
						+ errResponse.status);
			
		});
		}else{
			return defer.reject("Empty data");
		}
		return defer.promise;
	}
	
	this.tabCustomQuery = tabCustomQuery;	
	
	
var makeQuery = function(mainTable, joinTable, joinType, mainTableColumns, joinTableColumns, groupColumn, aggColumns, aggType){
	var query = '';
	if(mainTable != null && mainTableColumns != null){
		//Case of not aggregation
		if(groupColumn == null){
			//Check join
			if(joinType.value == 'NONE' || joinTable == null){
				//No Join
				let selectTemp = _.keys(_.pickBy(mainTableColumns, function(v, k) {
				    return v == true;
				}));
				//console.log(selectTemp);
				let SELECT = "SELECT "+ selectTemp.toString().replace("[", "").replace("]", "") + " ";
				let FROM = 	"FROM "+ mainTable.title + " ";
				query = SELECT + FROM;	
				
			}else{
				//Join
				let selectTemp = _.keys(_.pickBy(Object.assign({}, mainTableColumns, joinTableColumns), function(v, k) {
				    return v == true;
				}));
				
				let SELECT = "SELECT "+ selectTemp.toString().replace("[", "").replace("]", "") + " ";
				let FROM = 	"FROM " + mainTable.title + " " + joinType.value + " "+ joinTable.tableName + 
				" ON " + mainTable.title + "." + joinTable.thisCol + " = " + joinTable.tableName + "." + joinTable.otherCol + " " ;
				query = SELECT + FROM;	
			}
					
		}else{
			//Case of aggregation
			//Check join
			if(joinType.value == 'NONE' || joinTable == null){
				//No Join
				
				let colSelectTemp = _.keys(_.pickBy(aggColumns, function(v, k) {
				    return v == true;
				}));
				let selectTemp = '';
				for (column of colSelectTemp){
					selectTemp = selectTemp + " " + aggType + "(" + column + "), "; 
				}
				selectTemp = selectTemp.slice(0,-2) + " "; //remove last comma
				
				let SELECT = " SELECT "+ groupColumn + ", " + selectTemp + " ";
				let FROM = 	"FROM "+ mainTable.title + " ";
				let GROUPBY = "GROUP BY "+groupColumn;
					
				query = SELECT + FROM + GROUPBY;	
				
				
				
			}else{
				//Join
				let colSelectTemp = _.keys(_.pickBy(aggColumns, function(v, k) {
				    return v == true;
				}));
				let selectTemp = '';
				for (column of colSelectTemp){
					selectTemp = selectTemp + " " + aggType + "(" + column + "), "; 
				}
				selectTemp = selectTemp.slice(0,-2) + " "; //remove last comma
				
				let SELECT = " SELECT "+ groupColumn + ", " + selectTemp + " ";
				let FROM = 	"FROM " + mainTable.title + " " + joinType.value + " "+ joinTable.tableName + 
				" ON " + mainTable.title + "." + joinTable.thisCol + " = " + joinTable.tableName + "." + joinTable.otherCol + " " ;
				let GROUPBY = "GROUP BY "+groupColumn;
					
				query = SELECT + FROM + GROUPBY;	
			}
		}
	}
	return query;
};	
this.makeQuery = makeQuery;
	
	
var tabAvancedQuery = function(mainTable, joinTable, joinType, mainTableColumns, joinTableColumns, groupColumn, aggColumns, aggType){
		
		let defer = $q.defer();
		if(mainTable != null && mainTableColumns != null){
			//MAKE THE QUERY
			var query = makeQuery(mainTable, joinTable, joinType, mainTableColumns, joinTableColumns, groupColumn, aggColumns, aggType);
			//console.log(query);
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/tables/simpleQuery',
			params:{'q':query}
		}).then(function(response) {
			result = {};
			result['data'] = response.data;
			result['query'] = query;
			defer.resolve(result);
			
			},function(errResponse) {
				console.log("Error while loading tables data - Error Message: '"
						+ errResponse.status);
				defer.reject("Error while loading tables data - Error Message: '"
						+ errResponse.status);
			
		});
		}else{
			return defer.reject("Empty data");
		}
		return defer.promise;
	}
	
	this.tabAvancedQuery = tabAvancedQuery;
	
	
	
	
	
var loadJoinableTables = function(tableId, how){
		
		let defer = $q.defer();
		if(tableId != null && (how == "left" || how == "right" || how=="inner")){
			$http({
				method : 'GET',
				url : 'http://159.84.108.104:8081/tables/joinableTables/'+tableId,
				params:{'how':how}
			}).then(function(response) {
				result = response.data;
				defer.resolve(result);
				
				},function(errResponse) {
					console.log("Error while loading joinable tables  - Error Message: '"
							+ errResponse.status);
					defer.reject("Error while loading joinable tables - Error Message: '"
							+ errResponse.status);
				
			});
		}else{
			console.log("Bad parameters");
			return defer.reject("Bad parameters");
		}
		return defer.promise;
	}
	
	this.loadJoinableTables = loadJoinableTables;
	
	
	
	
	
	

	var loadJoinableTables2 = function(tableId){
		var deferAll = $q.defer();
		if(tableId != null){
			var defer1 = $q.defer();
			var defer2 = $q.defer();
			var defer3 = $q.defer();
			var result = {"inner":[], "left":[], "right":[]};
				//INNER JOIN
				$http({
					method : 'GET',
					url : 'http://159.84.108.104:8081/tables/joinableTables/'+tableId,
					params:{'how':"inner"}
				}).then(function(response) {
					let resultTemp = response.data;
					//result["inner"] = resultTemp;
					defer1.resolve(resultTemp);
					
					},function(errResponse) {
						defer1.reject("Error"+ errResponse.status);
				});
			
				//LEFT JOIN
				$http({
					method : 'GET',
					url : 'http://159.84.108.104:8081/tables/joinableTables/'+tableId,
					params:{'how':"left"}
				}).then(function(response) {
					let resultTemp = response.data;
					//result["left"] = resultTemp;
					defer2.resolve(resultTemp);
					
					},function(errResponse) {
						defer2.reject("Error"+ errResponse.status);
				});
				
				//RIGHT JOIN
				$http({
					method : 'GET',
					url : 'http://159.84.108.104:8081/tables/joinableTables/'+tableId,
					params:{'how':"right"}
				}).then(function(response) {
					let resultTemp = response.data;
					//result["right"] = resultTemp;
					defer3.resolve(resultTemp);
					
					},function(errResponse) {
						defer3.reject("Error"+ errResponse.status);
				});
				
				
				$q.all([defer1.promise,defer2.promise,defer3.promise]).then(function(data){
					
					let result = {};
					result["inner"] = data[0];
					result["left"] = data[1];
					result["right"] = data[2];
					
					deferAll.resolve(result);
				}, function(errResponse){
					console.log("Erreur while loading joinable tables");
					deferAll.reject("Erreur while loading joinable tables");
				});
				
			}else{
				console.log("Bad parameters");
				return deferAll.reject("Bad parameters");
			}
		
			
		
			return deferAll.promise;
		}
		
		this.loadJoinableTables2 = loadJoinableTables2;
		
		
		
		
		
	//var kMeansQuery = function(mainTable, joinTable, joinType, mainTableColumns, joinTableColumns, groupColumn, aggColumns, aggType, nbClass){
	var kMeansQuery = function(query, nbClass){
		defer = $q.defer();
		
			//MAKE THE QUERY
			//var query = makeQuery(mainTable, joinTable, joinType, mainTableColumns, joinTableColumns, groupColumn, aggColumns, aggType);
			//console.log(query);
			//defer.resolve(query);
			$http({
				method : 'GET',
				url : 'http://159.84.108.104:8081/tables/kmeans/',
				params:{'q':query, 'k':nbClass},
				cache:true,
			}).then(function(response) {
				result = response.data;
				defer.resolve(result);
				
				},function(errResponse) {
					console.log("Error while loading kmeans result  - Error Message: '"
							+ errResponse.status);
					defer.reject("Error while loading kmeans result - Error Message: '"
							+ errResponse.status);
				
			});
		
		return defer.promise;
	};
	this.kMeansQuery = kMeansQuery;
		
	
	
	
	var pcaQuery = function(query){
		defer = $q.defer();
		
			//MAKE THE QUERY
			//var query = makeQuery(mainTable, joinTable, joinType, mainTableColumns, joinTableColumns, groupColumn, aggColumns, aggType);
			//console.log(query);
			//defer.resolve(query);
			$http({
				method : 'GET',
				url : 'http://159.84.108.104:8081/tables/pca/',
				params:{'q':query, 'n':2},
				cache:true,
			}).then(function(response) {
				result = response.data;
				defer.resolve(result);
				
				},function(errResponse) {
					console.log("Error while loading kmeans result  - Error Message: '"
							+ errResponse.status);
					defer.reject("Error while loading kmeans result - Error Message: '"
							+ errResponse.status);
				
			});
		
		return defer.promise;
	};
	this.pcaQuery = pcaQuery;
		
	
	
	
		var loadTabContent = function(identifier) {
		let defer = $q.defer();
		if (identifier == null || identifier == undefined) {
			defer.reject("Error while loading table file - bad identifier");
		}
		else {

			var result;

			var parameters = { 'id': identifier, 'responseType':'arraybuffer' };

			$http({
				method: 'GET',
				url: 'http://159.84.108.104:8081/tables/tableContent',
				params: parameters,
				cache: true,
				responseType: 'blob'
			}).then(function(response) {
				result = response.data;
				//result = response;
				defer.resolve(result);

			}, function(errResponse) {

				defer.reject("Error while loading  table file - Error Message: '"
					+ errResponse.status);

			});
		}
		return defer.promise;
	};


	this.loadTabContent = loadTabContent;
	
	
		
	
});
