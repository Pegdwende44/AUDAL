app.directive('myGraphChart2', function () {
                return {
                    restrict: 'E',
          
                    replace:true,
                    scope: {
                        title: '=',
                        data:'='
                    },
                    //template: '<div style="width:500px; height:500px"></div>',
                    link: function ($scope, element, attrs) {
                    	// create an array with nodes
                    	nodes = new vis.DataSet();
                    	/*nodes.add([
                    	    { id: 1, value: 2, label: "Algie" },
                    	    { id: 2, value: 31, label: "Alston" },
                    	    { id: 3, value: 12, label: "Barney" },
                    	    { id: 4, value: 16, label: "Coley" },
                    	    { id: 5, value: 17, label: "Grant" },
                    	    { id: 6, value: 15, label: "Langdon" },
                    	    { id: 7, value: 6, label: "Lee" },
                    	    { id: 8, value: 5, label: "Merlin" },
                    	    { id: 9, value: 30, label: "Mick" },
                    	    { id: 10, value: 18, label: "Tod" }
                    	  ]);*/

                    	  // create connections between people
                    	  // value corresponds with the amount of contact between two people
                    	  edges = new vis.DataSet();
                    	  /*edges.add([
                    	    { from: 2, to: 8, value: 3, title: "3 emails per week" },
                    	    { from: 2, to: 9, value: 5, title: "5 emails per week" },
                    	    { from: 2, to: 10, value: 1, title: "1 emails per week" },
                    	    { from: 4, to: 6, value: 8, title: "8 emails per week" },
                    	    { from: 5, to: 7, value: 2, title: "2 emails per week" },
                    	    { from: 4, to: 5, value: 1, title: "1 emails per week" },
                    	    { from: 9, to: 10, value: 2, title: "2 emails per week" },
                    	    { from: 2, to: 3, value: 6, title: "6 emails per week" },
                    	    { from: 3, to: 9, value: 4, title: "4 emails per week" },
                    	    { from: 5, to: 3, value: 1, title: "1 emails per week" },
                    	    { from: 2, to: 7, value: 4, title: "4 emails per week" }
                    	  ]);*/

                    	// create a network
                    	//var container = document.getElementById("mynetwork");
                    	var data = {
                    	  nodes: nodes,
                    	  edges: edges
                    	};
                    	const width = element.parent()[0].offsetWidth;
                    	const height =  Math.round($(window).height() * 0.95);
                    	element[0].style.height = height + 'px';
                    	element[0].style.width = width + 'px';
                    	var options = {
                    			/*interaction: {tooltipDelay: 200},
                    	    	layout: {randomSeed: 8},
                    	    	physics:{stabilization: true},
                    	    	//autoResize: true,
                    	      height: '100%',
                    	      width: '100%',
                    		    nodes: {
                    		      shape: "dot",
                    		      scaling: {
                    		        customScalingFunction: function(min, max, total, value) {
                    		          return value / total;
                    		        },
                    		        min: 5,
                    		        max: 150
                    		      }
                    		    }*/
                    		  };
                    	
                    		  var network = new vis.Network(element[0], data, options);
                    	//var graph = new vis.Network(element[0], data, options);
                    		  
                    	
              
                    	$scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			/*chart.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });*/
                    		}
                    		
                    		});
                    	
                    	$scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			console.log("######### UPDATING ...");
                    			data.nodes.clear(); 
                    			data.nodes.add(newValue.nodes);
                    			
                    			data.edges.clear(); 
                    			data.edges.add(newValue.links);
                    			
                    			
                    		}	
                    		
                    			
                    		});
                    	
                      
                    }
                };
            })