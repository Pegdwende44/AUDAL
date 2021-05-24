

//SERVICES FOR DOCUMENTS DATA LOADING
app.service('DocService', function($http, $q, $timeout) {


	//Function to load Data from groupings and terms search
	var loadDocuments = function(checkedGroups, posMatchingTerms, negMatchingTerms, termsStrictness, termsFuzzy, show) {

		deferAll = $q.defer();
		var promises = [];
		var resultGroupings = {};
		var resultPosTerms = {};
		var resultNegTerms = {};

		//Groupings
		let i=0;
		let defer1 = $q.defer();
		let parameters1 = { 'show': show };
		var uncheck=false;
		if(checkedGroups != null){
		for(let [grouping, groups] of Object.entries(checkedGroups)) {
			i=i+1;
			uncheck=false;
			uncheckAll=true;
			let queryGroups = []
			for (let [group, isChecked] of Object.entries(groups)) {
				if (isChecked) {
					queryGroups.push(group);
					uncheckAll = false;
				}else{
					uncheck=true;
				}
			}
			
			if(uncheck || i==1){//Omit complete groups
				if (uncheckAll){
					i = i-1 //If first group is empty, try next
				}else{
					parameters1[grouping] = queryGroups.toString();
				}
				
			//
			}
			//console.log(parameters1);
		}
		}

		
		//console.log(parameters1);
		//console.log(parameters1);
		$http({
			method: 'GET',
			url: 'http://159.84.108.104:8081/documents/documentsByGroups',
			params: parameters1,
			cache: true
		}).then(function(response) {
			resultGroupings = response.data;

			defer1.resolve(resultGroupings);

		}, function(errResponse) {
			defer1.reject("Error while loading documents from groupings - Error Message: '" + errResponse.status);
		});
		promises.push(defer1.promise);


		//Positive terms matching
		if (posMatchingTerms.length != 0) {
			let defer2 = $q.defer();
			//console.log("strictness - pos "+posMatchingTerms.toString());
			let parameters2 = {
				'matching': 1,
				'fuzzy': termsFuzzy,
				'strict': termsStrictness,
				'terms': posMatchingTerms.toString(),
				'show': show,
				'pageSize': 10000
			};
			$http({
				method: 'GET',
				url: 'http://159.84.108.104:8081/documents/documentsByTerms',
				params: parameters2,
				cache: true
			}).then(function(response) {
				resultPosTerms = response.data;
				//console.log(response.data);
				defer2.resolve(resultPosTerms);
			}, function(errResponse) {
				defer2.reject("Error while loading documents from positive terms - Error Message: '" + errResponse.status);

			});
			promises.push(defer2.promise);
		}


		//Negative terms matching
		if (negMatchingTerms.length != 0) {
			let defer3 = $q.defer();
			let parameters3 = {
				'matching': 0,
				'fuzzy': termsFuzzy,
				'strict': termsStrictness,
				'terms': negMatchingTerms.toString(),
				'show': show,
				'pageSize': 10000
			};

			$http({
				method: 'GET',
				url: 'http://159.84.108.104:8081/documents/documentsByTerms',
				params: parameters3,
				cache: true
			}).then(function(response) {
				resultNegTerms = response.data;

				defer3.resolve(resultNegTerms);
			}, function(errResponse) {
				defer3.reject("Error while loading documents from negative terms - Error Message: '" + errResponse.status);

			});
			promises.push(defer3.promise);
		}

		//When all queries OK
		$q.all(promises).then(function(response) {
			//Union
			let resultTemp = JSON.parse(JSON.stringify(resultGroupings));

			if (negMatchingTerms.length != 0) {
				resultTemp = _.merge(resultTemp, resultNegTerms);

			}
			if (posMatchingTerms.length != 0) {
				resultTemp = _.merge(resultTemp, resultPosTerms);

			}


			let keysTemp = _.keys(resultGroupings);




			if (negMatchingTerms.length != 0) {
				keysTemp = _.intersection(keysTemp, _.keys(resultNegTerms));
			}

			if (posMatchingTerms.length != 0) {
				keysTemp = _.intersection(keysTemp, _.keys(resultPosTerms));
			}

			let result = _.pick(resultTemp, keysTemp);

			deferAll.resolve(result);
		},
			function(errResponse) {
				console.log("Error while loading Documents in desc manner" + errResponse);
				deferAll.reject("Error while loading Documents in desc manner" + errResponse);
			})

		return deferAll.promise;
	}

	this.loadDocuments = loadDocuments;






	//Function to load list of available doc properties
	this.loadDocProperties = function() {

		let defer = $q.defer();
		var docProperties = [];
		$http({
			method: 'GET',
			url: 'http://159.84.108.104:8081/global/documentsProperties'
		}).then(function(response) {
			docProperties = response.data;


			//Add groupings
			$http({
				method: 'GET',
				url: 'http://159.84.108.104:8081/global/docGroupings'
			}).then(function(response) {
				groupingNames = response.data;
				groupingNames.forEach((groupingName) => {
					docProperties.push({ "name": groupingName, "type": "Grouping" });
				});
				//remove identifier
				let filteredDocProperties = docProperties.filter(function(value, index, arr) { return value.name != 'identifier'; });
				defer.resolve(filteredDocProperties);

			}, function(errResponse) {
				
				console.log("Error while loading Groupings - Error Message: '"
					+ errResponse.status);
				defer.reject("Error while loading Groupings - Error Message: '"
					+ errResponse.status);

			});

		},
			function(errResponse) {
				let errorMessage = "Error while loading Documents properties - Error Message: '"
					+ errResponse.code;
				console.log(errorMessage);
				defer.reject(errorMessage);
			});
		return defer.promise;
	}




	//Function to load list of available doc representations
	this.loadDocRepresentations = function() {

		let defer = $q.defer();
		
		$http({
			method: 'GET',
			url: 'http://159.84.108.104:8081/documents/documentsRepresentations',
			params: { 'withSim': 0 }
		}).then(function(response) {
			result = response.data;
			defer.resolve(result);
		},
			function(errResponse) {
				let errorMessage = "Error while loading Documents representations - Error Message: '"
					+ errResponse.status;
				console.log(errorMessage);
				defer.reject(errorMessage);
			});
		return defer.promise;
	}


	this.loadDocRepresentationsWithSim = function() {

		let defer = $q.defer();
		
		$http({
			method: 'GET',
			url: 'http://159.84.108.104:8081/documents/documentsRepresentations',
			params: { 'withSim': 1 }
		}).then(function(response) {
			result = response.data;
			defer.resolve(result);
		},
			function(errResponse) {
				let errorMessage = "Error while loading Documents representations - Error Message: '"
					+ errResponse.status;
				console.log(errorMessage);
				defer.reject(errorMessage);
			});
		return defer.promise;
	}



	//Function to load list of available doc properties
	this.getDocAssociatedProperties = function(identifiers, property) {

		let defer = $q.defer();
		if (identifiers != null) {
			$http({
				method: 'POST',
				url: 'http://159.84.108.104:8081/documents/documentsProperties',
				params: { 'show': property },
				data:{'identifiers': identifiers}
			}).then(function(response) {
				result = response.data;
				defer.resolve(result);

			}, function(errResponse) {

				defer.reject("Error while loading documents properties - Error Message: '"
					+ errResponse.status);

			});
		} else {
			return defer.reject("Empty data");
		}
		return defer.promise;
	}











	var loadHighlights = function(identifiers, terms, strictness, fuzzyness, fragmentSize) {
		//Add groupings
		let defer = $q.defer();
		//Init parameters
		var result;
		var parameters = {//'ids':identifiers.toString(), 
			'terms': terms,
			'matching': strictness,
			'fuzzy': fuzzyness,
			'fragSize': fragmentSize,
			'pageSize': 10000
		};

		$http({
			method: 'POST',
			url: 'http://159.84.108.104:8081/documents/documentsHighlights',
			params: parameters,
			cache: true,
			data:{'identifiers':identifiers}
		}).then(function(response) {
			result = response.data;
			defer.resolve(result);

		}, function(errResponse) {

			defer.reject("Error while loading documents Highlights - Error Message: '"
				+ errResponse.status);

		});
		return defer.promise;
	}

	this.loadHighlights = loadHighlights;






	var loadDocScores = function(terms, fuzzyness) {

		let defer = $q.defer();
		if (terms.length == 0) {
			defer.reject("Error while loading documents Scores - Empty terms");
		}
		else {
			//Init parameters
			var result;
			var parameters = {//'ids':identifiers.toString(), 
				'terms': terms,
				'fuzzy': fuzzyness,
				'pageSize': 10000
			};

			$http({
				method: 'GET',
				url: 'http://159.84.108.104:8081/documents/documentsScores',
				params: parameters,
				cache: true
			}).then(function(response) {
				result = response.data;
				defer.resolve(result);

			}, function(errResponse) {

				defer.reject("Error while loading documents Scores - Error Message: '"
					+ errResponse.status);

			});
		}
		return defer.promise;
	}

	this.loadDocScores = loadDocScores;


	var loadTopKw = function(identifiers, vocabulary, limit) {
		let defer = $q.defer();
		if (identifiers.length == 0 || vocabulary == null || limit == null) {
			defer.reject("Error while loading documents Top KW - Empty params");
		}
		else {
			//Init parameters
			var result;

			var parameters = {//'ids':identifiers.toString(), 
				'vocabulary': vocabulary,
				'limit': limit
			};

			$http({
				method: 'POST',
				url: 'http://159.84.108.104:8081/documents/documentsTopKw',
				params: parameters,
				cache: true,
				data: {'identifiers': identifiers,}
			}).then(function(response) {
				result = response.data;
				defer.resolve(result);

			}, function(errResponse) {

				defer.reject("Error while loading documents Scores - Error Message: '"
					+ errResponse.status);

			});
		}
		return defer.promise;
	}


	this.loadTopKw = loadTopKw;




	var loadClustering = function(identifiers, vocabulary, threshold) {
		let defer = $q.defer();
		if (identifiers.length == 0 || vocabulary == null || threshold == null) {
			defer.reject("Error while loading documents clustering - Empty params");
		}
		else {
			//Init parameters
			var result;

			var parameters = {//'ids':identifiers.toString(), 
				'ids': identifiers,
				'vocabulary': vocabulary,
				'threshold': threshold
			};

			$http({
				method: 'GET',
				url: 'http://159.84.108.104:8081/documents/documentsPartition',
				params: parameters,
				cache: true
			}).then(function(response) {
				result = response.data;
				defer.resolve(result);

			}, function(errResponse) {

				defer.reject("Error while loading documents clustering - Error Message: '"
					+ errResponse.status);

			});
		}
		return defer.promise;
	};


	this.loadClustering = loadClustering;


	var loadDocsLinks = function(identifiers, vocabulary, threshold) {
		let defer = $q.defer();
		if (identifiers.length == 0 || vocabulary == null || threshold == null) {
			defer.reject("Error while loading documents graph - Empty params");
		}
		else {
			//Init parameters
			var result;

			var parameters = {//'ids':identifiers.toString(), 
				'vocabulary': vocabulary,
				'threshold': threshold
			};

			$http({
				method: 'POST',
				url: 'http://159.84.108.104:8081/documents/documentsLinks',
				params: parameters,
				cache: true,
				data: {'identifiers': identifiers,}
			}).then(function(response) {
				let resultTemp = response.data;
				result = resultTemp;//resultTemp.map(elt => [elt.from, elt.to]);
				defer.resolve(result);

			}, function(errResponse) {

				defer.reject("Error while loading documents graph - Error Message: '"
					+ errResponse.status);

			});
		}
		return defer.promise;
	};


	this.loadDocsLinks = loadDocsLinks;



	var loadGroupsLinks = function(identifiers, vocabulary, threshold, grouping, dropDuplicatedLinks = false, groupCounts) {
		let defer = $q.defer();
		if (identifiers.length == 0 || vocabulary == null || threshold == null || grouping == null) {
			defer.reject("Error while loading groups links - Empty params");
		}
		else {
			//Init parameters
			var result;

			var parameters = {//'ids':identifiers.toString(), 
				
				'vocabulary': vocabulary,
				'threshold': threshold,
				'grouping': grouping
			};

			$http({
				method: 'POST',
				url: 'http://159.84.108.104:8081/documents/groupsLinks',
				params: parameters,
				cache: true,
				data: {'identifiers': identifiers}
			}).then(function(response) {
				let resultTemp = response.data;
				result = {};
				result.links = {};
				result.nodes = {}
				result.nodes.list = [];
				result.nodes.obj = [];

				if (dropDuplicatedLinks) {//remove duplicates if applicable
					resultTemp.forEach(function(elt1) {
						_.remove(resultTemp, function(elt2) {
							return elt1.from === elt2.to && elt2.from === elt1.to
						});
					});
				}

				//Hashcode function
				String.prototype.hashCode = function() {
					if (Array.prototype.reduce) {
						return this.split("").reduce(function(a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
					}
					var hash = 0;
					if (this.length === 0) return hash;
					for (var i = 0; i < this.length; i++) {
						var character = this.charCodeAt(i);
						hash = ((hash << 5) - hash) + character;
						hash = hash & hash; // Convert to 32bit integer
					}
					return hash;
				}

				resultTemp.forEach(function(elt) {
					if (!result.nodes.list.includes(elt.from)) {
						result.nodes.list.push(elt.from);
						//result.nodes.obj.push({'id':elt.from.hashCode(), 'label':elt.from});
					}
					if (!result.nodes.list.includes(elt.to)) {
						result.nodes.list.push(elt.to);
						//result.nodes.obj.push({'id':elt.to.hashCode(), 'label':elt.to});
					}
				});

				//Transform to link ratio

				let groupingData = _.filter(groupCounts, { 'groupingName': grouping })
				if (groupingData.length == 0) {
					defer.reject("Missing group count");
				}
				let groups = groupingData[0]['groups'];
				let nbByGroup = {};
				for (let item of groups) {
					nbByGroup[item.groupName] = item.count;
				}


				result.links.list = resultTemp.map(elt => [elt.from, elt.to, elt.value / (nbByGroup[elt.from] * nbByGroup[elt.to])]);
				//result.links.obj = resultTemp.map(function(elt){ return {'from': elt.from.hashCode(), 'to': elt.to.hashCode(), 'value': elt.value/(nbByGroup[ elt.from.hashCode()] + nbByGroup[ elt.to.hashCode()])}});
				console.log(result);
				defer.resolve(result);


			}, function(errResponse) {

				defer.reject("Error while loading documents graph - Error Message: '"
					+ errResponse.status);

			});
		}
		return defer.promise;
	};

	this.loadGroupsLinks = loadGroupsLinks;







	var loadGroupsLinks2 = function(identifiers, vocabulary, grouping, dropDuplicatedLinks = true) {
		let defer = $q.defer();
		
		if (identifiers.length == 0 || vocabulary == null || grouping == null) {
			defer.reject("Error while loading groups links - Empty params");
		}
		else {
			var result = {};	
				
			result.links = [];
			result.nodes = [];
			let promise1 = this.getEmbeddings(identifiers, grouping, vocabulary);
			promise1.then(function(result1){
				//Query for pca
					$http({
						method : 'GET',
						url : 'http://159.84.108.104:8081/documents/cos/',
						params:{'values':result1.values, 'labels':result1.labels, 'keys':result1.keys},
						cache:true,
					}).then(function(response) {
						result2 = response.data;
						console.log(result2);
						
						//let doneGroups = [];
						let doneLinks = [];
						for (let elt of _.keys(result2)){//Make groups list
							let splited = elt.split('*');
							if(!result.nodes.includes(splited[0])){
								result.nodes.push(splited[0]);
							}
							if(!result.nodes.includes(splited[1])){
								result.nodes.push(splited[1]);
							}
						}
						for (let [key, value] of Object.entries(result2)){//Make links list
								let key1 = key.split("*")[0];
								let key2 = key.split("*")[1];
									result.links.push([key1, key2, value]);								
							}
						
						
						defer.resolve(result);
						console.log(result);
						
						},function(errResponse1) {
							console.log("Error while loading doc similarities  - Error Message: '"
									+ errResponse1.status);
							defer.reject("Error while loading doc similarities - Error Message: '"
									+ errResponse1.status);
						
						});
					},
					function(errResponse2){
						console.log("Error while loading doc embeddings  - Error Message: '"
									+ errResponse2.status);
							defer.reject("Error while loading doc embeddings - Error Message: '"
									+ errResponse2.status);
					});
				}
				
				
	
		
		return defer.promise;
	};

	this.loadGroupsLinks2 = loadGroupsLinks2;

	







	var loadGroupsLinks3 = function(identifiers, vocabulary, threshold, grouping, dropDuplicatedLinks = true) {
		let defer = $q.defer();
		
		if (identifiers.length == 0 || vocabulary == null || threshold == null || grouping == null) {
			defer.reject("Error while loading groups links - Empty params");
		}
		else {
			let promise1 = this.getDocAssociatedProperties(identifiers, grouping);
			promise1.then(function(result1){
				//Init parameters
				let listPromises = [];
				var result = {};	
				let doneGroups = [];
				result.links = [];
				result.nodes = [];
				let nbByGroup = _.countBy(_.map(_.values(result1)));
				result.nodes = __.keys(nbByGroup);
				
				result.nodes.sort()
				//let groupLinks = [];
				
				for(let groupName1 of result.nodes){
					for(let groupName2 of result.nodes){
						if(groupName1 != groupName2 && !doneGroups.includes(groupName2+groupName1)){
						doneGroups.push(groupName1+groupName2);
						var ids1 = _.keys(_.pickBy(result1, function(value, key) {
						  return value == groupName1;
						}));
						var ids2 = _.keys(_.pickBy(result1, function(value, key) {
						  return value == groupName2;
						}));
												
						let deferTemp = $q.defer();
						var parameters = { 
				
							'vocabulary': vocabulary,
							'threshold': threshold
						};

						$http({
							method: 'POST',
							url: 'http://159.84.108.104:8081/documents/groupsLinks',
							params: parameters,
							cache: true,
							data: {'ids1':ids1, 'ids2':ids2},
						}).then(function(response) {
							let resultTemp = response.data;
							deferTemp.resolve(resultTemp);
							//console.log(resultTemp);
							let nb=resultTemp['value'];
							let coef = (nbByGroup[groupName1] * nbByGroup[groupName2]);
							if (nb > 0) {
								result.links.push([groupName1, groupName2, nb / coef]);	
								
							}
			
						
							
							
						}, function(errResponse) {
							deferTemp.reject("Error while loading groups links - Error Message: '"
								+ errResponse.status);
						});
						
						listPromises.push(deferTemp.promise);
						
						}
					}
				}
				
				
				$q.all(listPromises).then(function(result2){
					defer.resolve(result);
					console.log("FINISHED");
				}, function(errResponse){
					defer.reject("Error while loading group links"+errResponse.status);
					console.log("Error1");
				})
				
				
				
			}, function(errResponse){
				defer.reject("Error while loading group links"+errResponse.status);
				console.log("Error2");
			});
		}
	
		
		return defer.promise;
	};

	this.loadGroupsLinks3 = loadGroupsLinks3;











	var loadFreqKw = function(identifiers, vocabulary, grouping, terms) {
		let defer = $q.defer();
		
		if (identifiers.length == 0 || vocabulary == null || grouping == null || terms == null) {
			defer.reject("Error while loading FreqKw - Empty params");
		}
		else {
			let promise1 = this.getDocAssociatedProperties(identifiers, grouping);
			promise1.then(function(result1){
				//Init parameters
				let listPromises = [];
				var result = {};	
				
				let groupNames = [...new Set(_.values(result1))];
				groupNames.sort();
				 result['groups']=groupNames;
				result['terms']=[];
				//var temp = {};
				
				for(let groupName of groupNames){
						let deferTemp = $q.defer();
						var ids = _.keys(_.pickBy(result1, function(value, key) {
						  return value == groupName;
						}));
						
						var parameters = { 
							'vocabulary': vocabulary,
							'terms': terms
						};

						$http({
							method: 'POST',
							url: 'http://159.84.108.104:8081/documents/documentsFreqKw',
							params: parameters,
							cache: true,
							data: {'identifiers':ids},
						}).then(function(response) {
							let resultTemp = response.data;
							deferTemp.resolve(resultTemp);
							//console.log(resultTemp);
			
						}, function(errResponse) {
							deferTemp.reject("Error while loading Document term frequency '"
								+ errResponse.status);
						});
						
						listPromises.push(deferTemp.promise);
						
						}
					
				
				
				
				$q.all(listPromises).then(function(result2){
					
					result['data'] = result2;
					for (let elt of result2){//Effective terms
						result['terms'] = [...new Set([...result['terms'], ...Object.keys(elt)])];
					}
					result['terms'].sort();
					console.log("FINISHED");
					defer.resolve(result);
				}, function(errResponse){
					defer.reject("Error while loading doc kw freq "+errResponse.status);
					console.log("Error while loading doc kw freq "+errResponse.status);
				})
				
				
				
			}, function(errResponse){
				defer.reject("Error while loading group links"+errResponse.status);
				console.log("Error2");
			});
		}
	
		
		return defer.promise;
	};

	this.loadFreqKw = loadFreqKw;















	var loadDocContent = function(identifier) {
		let defer = $q.defer();
		if (identifier == null || identifier == undefined) {
			defer.reject("Error while loading document content - bad identifier");
		}
		else {

			var result;

			var parameters = { 'id': identifier, 'responseType':'arraybuffer' };

			$http({
				method: 'GET',
				url: 'http://159.84.108.104:8081/documents/documentContent',
				params: parameters,
				cache: true,
				responseType: 'blob'
			}).then(function(response) {
				result = response.data;
				//result = response;
				defer.resolve(result);

			}, function(errResponse) {

				defer.reject("Error while loading document content - Error Message: '"
					+ errResponse.status);

			});
		}
		return defer.promise;
	};


	this.loadDocContent = loadDocContent;


var getEmbeddings = function(identifiers, label, vocabulary){
			deferGeneral = $q.defer();
			//console.log(label);
			let promise1 = this.getDocAssociatedProperties(identifiers, label) ;
			promise1.then(function(data1){
				//Get aggregated embedding data
				//var embeddings = [];
				//var labels = [];
				let groups = _.uniq(_.values(data1));
				//let defers = []
				let promises = []
				let i = 0;
				for (let group of groups){
					let members = _.keys(_.pickBy(data1, e => e == group));
					let defer = $q.defer();
					promises.push(defer.promise);
					
					//Query for embedding
					$http({
						method : 'POST',
						url : 'http://159.84.108.104:8081/documents/documentsEmbedding/',
						params:{'vocabulary':vocabulary,},
						data:{ 'identifiers':members},
						cache:true,
					}).then(function(response) {
						let result = response.data;
						let label = group;
						let embedding = Object.values(result);
						let keys = Object.keys(result);
						defer.resolve({'label':label, 'embedding':embedding, 'keys':keys});
						
						},function(errResponse) {
							console.log("Error while loading embeddings  - Error Message: '"
									+ errResponse.status);
							defer.reject("Error while loading embeddings - Error Message: '"
									+ errResponse.status);
						
					});
					  
					i++;
				}
				
				$q.all(promises).then(
					function(data2){
						let values = [];
						let labels = [];
						for(item of data2){
							values = values.concat(item.embedding);
							labels.push(item.label);
						}
						deferGeneral.resolve({"values":values, "labels":groups, 'keys':data2[0].keys});
					},
					function(errResponse){
						console.log("Error while loading embeddings  - Error Message: '"
									+ errResponse);
							deferGeneral.reject("Error while loading embeddings - Error Message: '"
									+ errResponse);
					}
				);
				
			}, function(errResponse){
				console.log(errResponse);
				deferGeneral.reject(errResponse);
			})
			
			return deferGeneral.promise;
	};
	this.getEmbeddings = getEmbeddings;
	
	
	var kMeansQuery = function(identifiers, label, vocabulary, nbClass){
		let defer = $q.defer();
		let promise1 = this.getEmbeddings(identifiers, label, vocabulary);
		promise1.then(function(data){
			
			//Query for kmeans
					$http({
						method : 'GET',
						url : 'http://159.84.108.104:8081/documents/kmeans/',
						params:{'values':data.values, 'k':nbClass, 'labels':data.labels, 'keys':data.keys},
						cache:true,
					}).then(function(response) {
						result = response.data;
						//console.log(result);
						
						defer.resolve(result);
						
						},function(errResponse) {
							console.log("Error while loading doc kmeans  - Error Message: '"
									+ errResponse.status);
							defer.reject("Error while loading doc kmeans - Error Message: '"
									+ errResponse.status);
						
					});
			
		}, 
		function(errResponse){
			console.log("Error while loading embedding "+errResponse);
			defer.reject("Error while loading embedding "+errResponse);
		});
		
		return defer.promise;
	}
	//var kMeansQuery
	this.kMeansQuery = kMeansQuery;
	
	
	
	
	var pcaQuery = function(identifiers, label, vocabulary, nbClass){
		let defer = $q.defer();
		let promise1 = this.getEmbeddings(identifiers, label, vocabulary);
		promise1.then(function(data){
			
			//Query for pca
					$http({
						method : 'GET',
						url : 'http://159.84.108.104:8081/documents/pca/',
						params:{'values':data.values, 'k':nbClass, 'labels':data.labels, 'keys':data.keys},
						cache:true,
					}).then(function(response) {
						result = response.data;
						//console.log(result);
						
						defer.resolve(result);
						
						},function(errResponse) {
							console.log("Error while loading doc kmeans  - Error Message: '"
									+ errResponse.status);
							defer.reject("Error while loading doc kmeans - Error Message: '"
									+ errResponse.status);
						
					});
			
		}, 
		function(errResponse){
			console.log("Error while loading embedding "+errResponse);
			defer.reject("Error while loading embedding "+errResponse);
		});
		
		return defer.promise;
	}
	//var kMeansQuery
	this.pcaQuery = pcaQuery;
	
	
	

});

































//SERVICES FOR DOCS VISUALISATIONS
app.service('stat', function($q, $http) {
	this.quartile = function(data, percentile = 50) {
		data.sort(function(a, b) { return a - b });
		var index = (percentile / 100) * data.length;
		var result;
		if (Math.floor(index) == index) {
			result = (data[(index - 1)] + data[index]) / 2;
		}
		else {
			result = data[Math.floor(index)];
		}
		return result;
	};



	this.meanByCategory = function(array, numericVar, categVar) {

		var categories = _.chain(array)
			.map(categVar)
			.uniq().value();

		var result = [];
		categories.forEach(element => {
			let resultItem = {};
			resultItem[categVar] = element;
			resultItem[numericVar] = _.meanBy(_.filter(array, [categVar, element]), (doc) => doc.score);
			result.push(resultItem);
		});
		//categories.forEach(element => console.log(_(array).filter({ categVar: element }).value()));
		//categories.forEach(element => console.log(Object({categVar : element}).toString()));
		return result;
	};






	this.chiSquare = function(xLabels, yLabels, inputValues) {

		//Builds real values table
		var formattedValues = [];
		var values = [];
		var rowSum = _.countBy(_.map(inputValues, function(o) { return o.value1 }));
		var colSum = _.countBy(_.map(inputValues, function(o) { return o.value2 }));

		var chiStat = 0;
		var result = {};
		let i = 0;
		//let theorOK = true;
		for (elt1 of xLabels) {
			let j = 0;
			for (elt2 of yLabels) {
				let nb = _.filter(inputValues, function(o) { if (o.value1 == elt1 && o.value2 == elt2) return o }).length;
				formattedValues.push([i, j, nb]);
				values.push(nb);
				j++;
			}
			i++;
		}
		//console.log(values);
		//console.log(formattedValues);
		//Chi square test
		let defer = $q.defer();

		//INVERSE ROWS WITH COLS, PROBABLY PROBLEM WITH SPARK
		var parameters = {
			'nbRow': yLabels.length,
			'nbCol': xLabels.length,
			'values': values
		};
		if (values.length == xLabels.length * yLabels.length
			&& !Object.values(colSum).includes(0)
			&& !Object.values(rowSum).includes(0)) { //Check data OK
			$http({
				method: 'GET',
				url: 'http://159.84.108.104:8081/global/chisq',
				params: parameters,
				cache: true
			}).then(function(response) {
				result = response.data;
				result.realValues = formattedValues;
				//console.log(result);
				defer.resolve(result);

			}, function(errResponse) {

				defer.reject("Error while computing Chi2 - Error code: '"
					+ errResponse.status);

			});
		} else {
			result.realValues = formattedValues;
			defer.resolve(result);
		}




		return defer.promise;
	}



this.corr = function(xValues, yValues) {
		console.log(xValues);
		console.log(yValues);
		let defer = $q.defer();

		//INVERSE ROWS WITH COLS, PROBABLY PROBLEM WITH SPARK
		var parameters = {
			'x': xValues,
			'y': yValues,
			
		};
		if (xValues.length == yValues.length) { //Check data OK
			$http({
				method: 'GET',
				url: 'http://159.84.108.104:8081/global/corr',
				params: parameters,
				cache: true
			}).then(function(response) {
				result = response.data;
				
				//console.log(result);
				defer.resolve(result);

			}, function(errResponse) {

				defer.reject("Error while computing corr - Error code: '"
					+ errResponse.status);

			});
		} else {
			result.realValues = formattedValues;
			defer.resolve(result);
		}




		return defer.promise;
	}




	// Arithmetic mean
	var getMean = function(data) {
		return data.reduce(function(a, b) {
			return Number(a) + Number(b);
		}) / data.length;
	};
	this.getMean = getMean;


	// Standard deviation
	var getSD = function(data) {
		let m = getMean(data);
		return Math.sqrt(data.reduce(function(sq, n) {
			return sq + Math.pow(n - m, 2);
		}, 0) / (data.length - 1));
	};
	this.getSD = getSD;




});
