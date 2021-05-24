

//SERVICE FOR GLOBAL DATA ACCESS
app.service('GlobalService', function($http, $q, $timeout) {
	
	/*SEMANTIC RESOURCES*/
	
	//Function to load All semantic resources
	var loadSemanticResources = function(){
		var defer = $q.defer();
		
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/semantic/resources'
		}).then(function(response) {
			var result = response.data;
			defer.resolve(result);
		},
		function(errResponse) {
			let errorMessage = "Error while loading Semantic resources: '"
					+ errResponse.code;
			console.log(errorMessage);
			 defer.reject(errorMessage);
			
		});
		return defer.promise;
	}
	
	
	this.loadSemanticResources = loadSemanticResources;
	
	
	//Function to delete a semantic resources
	var removeSemanticResources = function(id, type){
		var defer = $q.defer();
		//console.log(id);
		//console.log(type);
		$http({
			method : 'DELETE',
			url : 'http://159.84.108.104:8081/semantic/'+type+'/'+id
		}).then(function(response) {
		
			defer.resolve();
		},
		function(errResponse) {
			let errorMessage = "Error while deleting Semantic resources: '"
					+ errResponse.code;
			console.log(errorMessage);
			 defer.reject(errorMessage);
			
		});
		return defer.promise;
	}
	this.removeSemanticResources = removeSemanticResources;
	
	
	//Function to create a semantic resources (dictionary)
	var createDictionary = function(name, terms){
		var defer = $q.defer();
		
		$http({
			method : 'POST',
			url : 'http://159.84.108.104:8081/semantic/dictionary',
			data:{'name':name, 'terms':terms}
		}).then(function(response) {
		
			defer.resolve(result);
		},
		function(errResponse) {
			let errorMessage = "Error while creation dictionary: '"
					+ errResponse.code;
			console.log(errorMessage);
			 defer.reject(errorMessage);
			
		});
		return defer.promise;
	}
	this.createDictionary = createDictionary;
	
	
	//Function to create a semantic resources (thesaurus)
	var createThesaurus = function(name, pairs){
		var defer = $q.defer();	
		$http({
			method : 'POST',
			url : 'http://159.84.108.104:8081/semantic/thesaurus',
			data:{'name':name, 'pairs':pairs}
		}).then(function(response) {
		
			defer.resolve(response);
		},
		function(errResponse) {
			let errorMessage = "Error while creation of a thesaurus: '"
					+ errResponse.code;
			console.log(errorMessage);
			 defer.reject(errorMessage);
			
		});
		return defer.promise;
	}
	this.createThesaurus = createThesaurus;
	
	
	
	
	//Function to load a semantic resources (thesaurus)
	var loadThesaurus = function(id){
		var defer = $q.defer();	
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/semantic/thesaurus/'+id,
			cache:true
		}).then(function(response) {
			let result = response.data;
			defer.resolve(result);
		},
		function(errResponse) {
			let errorMessage = "Error while loading thesaurus: '"
					+ errResponse.code;
			console.log(errorMessage);
			 defer.reject(errorMessage);
			
		});
		return defer.promise;
	}
	this.loadThesaurus = loadThesaurus;
	
	
	
	
	//Function to load a semantic resources (dictionary)
	var loadDictionary = function(id){
		var defer = $q.defer();	
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/semantic/dictionary/'+id,
			cache:true
		}).then(function(response) {
			let result = response.data;
			defer.resolve(result);
		},
		function(errResponse) {
			let errorMessage = "Error while loading dictionary: '"
					+ errResponse.code;
			console.log(errorMessage);
			 defer.reject(errorMessage);
			
		});
		return defer.promise;
	}
	this.loadDictionary = loadDictionary;
	
	
	
	
	
	

	
	var loadListGroupings = function(){
		var defer = $q.defer();
		//console.log("############");
		var listGroupings = [];
		var checkedGroups = {};
		var checkedGroupings = {};
		$http({
			method : 'GET',
			url : 'http://159.84.108.104:8081/global/groupings'
		}).then(function(response) {
			groupingNames = response.data;
			var groupingsToLoad = groupingNames.length;
			//FOR EACH GROUPING, LOAD GROUPS
			if(groupingNames.length != 0){//Groupings found
				
				//Create a promise for each grouping query
				var promises = [];
				 /*groupingNames.forEach((groupingName) => {
					
				});*/
				
				 for (let i=0; i<groupingNames.length;i++){//Processing for each grouping
					 let deferTemp = $q.defer();
					 let groupingName = groupingNames[i];
					 checkedGroupings[groupingName] = true;
					
					 
					 $http({
							method : 'GET',
							url : 'http://159.84.108.104:8081/global/grouping/'+groupingName
						}).then(function(response) {
							let currentGroups = [];
							checkedGroups[groupingName] = {};
							for (elt of response.data){
								currentGroups.push({'groupName':elt['name'],'count':elt['count']});
								checkedGroups[groupingName][elt['name']] = true;
							}
							let groupingTemp = {}
							groupingTemp['groupingName'] = groupingName;
							groupingTemp['groups'] = currentGroups;
							listGroupings.push({"groupingName":groupingName, "groups":currentGroups});
							deferTemp.resolve();
						},
						function(errResponse) {
							
							console.log("Error while loading Groupings");
							deferTemp.reject("Error while loading Groupings - Error Message: '"
								+ errResponse.code);
						});
					 promises.push(deferTemp.promise);
				 }
				 
				 
				 
				 //When all groupings loaded
				$q.all(promises).then(function(okValue){
					defer.resolve({"listGroupings":listGroupings, "checkedGroups":checkedGroups, 'checkedGroupings':checkedGroupings});
				},
				function(errValue){
					console.log("Error while loading Groupings");
					defer.reject("Error while loading Groupings");
				});
				
			 
			}
			
		},
		function(errResponse) {
			let errorMessage = "Error while loading Groupings - Error Message: '"
					+ errResponse.code;
			console.log(errorMessage);
			 defer.reject(errorMessage);
			
		});
		return defer.promise;
	}
	
	
	this.loadListGroupings = loadListGroupings;
	
	
	
	
	
});
