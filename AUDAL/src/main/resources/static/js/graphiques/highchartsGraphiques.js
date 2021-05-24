app.directive('myBarChart', function () {
                return {
                    restrict: 'E',
          
                    replace:true,
                    scope: {
                        title: '=',
                        data:'='
                    },
                    template: '<div></div>',
                    link: function ($scope, element, attrs) {
                    	
                    	let visu = {
                    			"chart":{
                    				"height":"80%",
                    			},
                	        "title": {
                	            "text": ''
                	        },
                	        "xAxis": {
                	            "categories": []
                	        },
                	        "series": [{
                	        	"type": 'column',
                	            "colorByPoint": true,
                	            "data": []
                	        }],
                	         
                	        "exporting": {
                	            "enabled": true
                	        }
                	    };
                    	var chart = Highcharts.chart(element[0], visu);
                    	$scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                    	
                    	$scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                        	        "series": [{
                        	        	"name":newValue.label,
                        	        	"type": 'column',
                        	           // "colorByPoint": true,
                        	            "data": newValue.values
                        	        }],
                        	        "xAxis": {
                        	            "categories": newValue.keys
                        	        },
                        	    });
                    		}	
                    		
                    			
                    		});
                    	
                      
                    }
                };
            })
            
            
           
            
            
            
            
            
            .directive('myMultiBarChart', function () {
                return {
                    restrict: 'E',
          
                    replace:true,
                    scope: {
                        title: '=',
                        data:'='
                    },
                    template: '<div></div>',
                    link: function ($scope, element, attrs) {
                    	
                    	let visu = {

                    		    chart: {
                    		    	height:"80%",
                    		        type: 'column',
                    		        //styledMode: true
                    		    },

                    		    title: {
                    		        text: 'Styling axes and columns'
                    		    },

                    		    yAxis: [{
                    		        className: 'highcharts-color-0',
                    		        title: {
                    		            text: ''
                    		        }
                    		    }, {
                    		        className: 'highcharts-color-1',
                    		        opposite: true,
                    		        title: {
                    		            text: ''
                    		        }
                    		    }],

                    		    plotOptions: {
                    		        column: {
                    		            borderRadius: 5
                    		        }
                    		    },

                    		    series: [{
                    		        data: []
                    		    }, {
                    		        data: [],
                    		        yAxis: 1
                    		    }]

                    		};
                    	var chart = Highcharts.chart(element[0], visu);
                    	
                    	$scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                    	
                    	$scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                    				 yAxis: [{
                         		        className: 'highcharts-color-0',
                         		        title: {
                         		            text: newValue.label1,
                         		        }
                         		    }, {
                         		        className: 'highcharts-color-1',
                         		        opposite: true,
                         		        title: {
                         		            text: newValue.label2,
                         		        }
                         		    }],
                        	        "series": [{
                        	        	"name":newValue.label1,
                        	            "data": newValue.values1
                        	        },	{
                        	        	"name":newValue.label2,
                        	            "data": newValue.values2
                        	        }],
                        	        "xAxis": {
                        	            "categories": newValue.keys
                        	        },
                        	    });
                    		}	
                    		
                    			
                    		});
                    	
                      
                    }
                };
            })
            
            
            
          .directive('myMultiBarChart2', function () {
                return {
                    restrict: 'E',
          
                    replace:true,
                    scope: {
                        title: '=',
                        data:'='
                    },
                    template: '<div></div>',
                    link: function ($scope, element, attrs) {
                    	
                    	let visu = {

                    		    chart: {
                    		    	height:"80%",
                    		        type: 'column',
                    		        //styledMode: true
                    		    },

                    		    title: {
                    		        text: 'Styling axes and columns'
                    		    },
                    		    xAxis: {
                    		        categories: [
                    		            'Jan',
                    		            'Feb',
                    		            'Mar',
                    		            'Apr',
                    		            'May',
                    		            'Jun',
                    		            'Jul',
                    		            'Aug',
                    		            'Sep',
                    		            'Oct',
                    		            'Nov',
                    		            'Dec'
                    		        ],
                    		        crosshair: true
                    		    },
                    		    
                    		    yAxis: {
                    		        min: 0,
                    		        title: {
                    		            text: 'Rainfall (mm)'
                    		        }
                    		    },

                    		    plotOptions: {
                    		        column: {
                    		            pointPadding: 0.2,
                    		            borderWidth: 0
                    		        }
                    		    },
                    		    series: [{
                    		        name: 'Tokyo',
                    		        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

                    		    }, {
                    		        name: 'New York',
                    		        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

                    		    }, {
                    		        name: 'London',
                    		        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

                    		    }, {
                    		        name: 'Berlin',
                    		        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

                    		    }]

                    		};
                    	var chart = Highcharts.chart(element[0], visu);
                    	
                    	$scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                    	
                    	$scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			
                    			let visu = {

                            		    chart: {
                            		    	height:"80%",
                            		        type: 'column',
                            		        //styledMode: true
                            		    },

                            		    title: {
                            		        text: 'Styling axes and columns'
                            		    },
                            		    
                            		    
                            		    yAxis: {
                            		        min: 0,
                            		        title: {
                            		            text: 'Rainfall (mm)'
                            		        }
                            		    },

                            		    plotOptions: {
                            		        column: {
                            		            pointPadding: 0.2,
                            		            borderWidth: 0
                            		        }
                            		    },
                            		    "series": newValue.series,
                            	        "xAxis": {
                            	            "categories": newValue.keys
                            	        },

                            		};
                            	var chart = Highcharts.chart(element[0], visu);
                    			
                    			
                    			
                    			
                    			
                            	/*chart.update({
                    				 yAxis: [{
                         		        className: 'highcharts-color-0',
                         		        title: {
                         		            text: newValue.label1,
                         		        }
                         		    }, {
                         		        className: 'highcharts-color-1',
                         		        opposite: true,
                         		        title: {
                         		            text: newValue.label2,
                         		        }
                         		    }],
                    				
                    				
                        	        "series": newValue.series,
                        	        "xAxis": {
                        	            "categories": newValue.keys
                        	        },
                        	    });*/
                    		}	
                    		
                    			
                    		});
                    	
                      
                    }
                };
            })  
            
            
            
            
            
            .directive('myPolarChart', function () {
                return {
                    restrict: 'E',
                    replace:true,
                    scope: {
                        title: '=',
                        data:'='
                    },
                    template: '<div></div>',
                    link: function ($scope, element, attrs) {
                    	
                    	let visu = {
                    			
                    			"chart":{
                				"polar":true,
                				"height":"80%",
                				
                			},	
                	        "title": {
                	            "text": ''
                	        },
                	        "xAxis": {
                	            "categories": []
                	        },
                	        "series": [{
                	        	"type": 'column',
                	            "colorByPoint": true,
                	            "data": []
                	        }],
                	         
                	        "exporting": {
                	            "enabled": true
                	        }
                	    };
                    	var chart2 = Highcharts.chart(element[0], visu);
                    	//chart2.setSize(null);
                    	//console.log("");
                    	$scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart2.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                    	
                    	$scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart2.update({
                    				
                        	        "series": [{
                        	        	"type": 'column',
                        	            "colorByPoint": true,
                        	            "data": newValue.values
                        	        }],
                        	        "xAxis": {
                        	            "categories": newValue.keys
                        	        },
                        	    });
                    			
                    		
                    		}	
                    		
                    			
                    		});
                 
                    }
                };
            })
            
            
            
            
            
            
            
            
            
            
            
            
            // Directive for pie charts, pass in title and data only    
            .directive('myPieChart', function () {
                return {
                    restrict: 'E',
                   
                    scope: {
                        title: '=',
                        data: '='
                    },
                    template: '<div></div>',
                    link: function ($scope, element, attrs) {
                    	//console.log("########## pei");
                    	let visu = {
                    		    "chart": {
                    		        "plotBackgroundColor": null,
                    		        "plotBorderWidth": null,
                    		        "plotShadow": false,
                    		        "height":"80%",
                    		        "type": 'pie'
                    		    },
                    		    "title": {
                    		        text: ''
                    		    },
                    		    "tooltip": {
                    		        "pointFormat": '{series.name}:{point.y} ({point.percentage:.1f} %)'
                    		    },
                    		    "accessibility": {
                    		        "point": {
                    		            "valueSuffix": '%'
                    		        }
                    		    },
                    		    "plotOptions": {
                    		        "pie": {
                    		            "allowPointSelect": false,
                    		            "cursor": 'pointer',
                    		            "dataLabels": {
                    		                "enabled": true,
                    		                "format": '<b>{point.name}</b> <br> {point.y} ({point.percentage:.1f} %)',
                    		                "connectorColor": 'silver'
                    		            }
                    		        }
                    		    },
                    		    "series": [{
                    		        "name": 'Values',
                    		        "data": []
                    		    }]
                    		};
                        var chart3 = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart3.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart3.update({
                    				
                        	        "series": [{
                        	        	"data": newValue
                        	        }],
                        	        
                        	    });
                    			
                    			
                    		}	
                    		
                    			
                    		});
                        
                    }
                };
            })
            
            
            

            
            
            
            // Directive for Timeline charts, pass in title and data only    
            .directive('myTimelineChart', function () {
                return {
                    restrict: 'E',
                   
                    scope: {
                        title: '=',
                        data: '='
                    },
                    template: '<div></div>',
                    link: function ($scope, element, attrs) {
                    	
                    	let visu = {
                    			chart:{
                    				height:"80%",
                    			},
                    		    title: {
                    		        text: ''
                    		    },

                    		   

                    		    yAxis: {
                    		        title: {
                    		            text: 'Number of documents'
                    		        }
                    		    },

                    		   

                    		    legend: {
                    		        layout: 'vertical',
                    		        align: 'right',
                    		        verticalAlign: 'middle'
                    		    },

                    		    plotOptions: {
                    		        series: {
                    		            label: {
                    		                connectorAllowed: false
                    		            },
                    		            pointStart: 2010
                    		        }
                    		    },

                    		    series: [{
                    		        name: 'Nb docs',
                    		        data: []
                    		    }],

                    		    responsive: {
                    		        rules: [{
                    		            condition: {
                    		                maxWidth: 500
                    		            },
                    		            chartOptions: {
                    		                legend: {
                    		                    layout: 'horizontal',
                    		                    align: 'center',
                    		                    verticalAlign: 'bottom'
                    		                }
                    		            }
                    		        }]
                    		    }

                    		};
                    	
                        var chart4 = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart4.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		//console.log(oldValue, "--------->",newValue);
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart4.update({
                    				
                        	        "series": [{
                        	        	"data": newValue.data
                        	        }],
                        	        "plotOptions": {
                        		        series: {
                        		            label: {
                        		                connectorAllowed: false
                        		            },
                        		            pointStart: newValue.start
                        		        }
                        		    }
                        	    });
                    			
                    			
                    		}	
                    		
                    			
                    		});
                        
                    }
                };
            })
            
            
            
            
            
            
            
            
                 // Directive for Timeline charts, pass in title and data only    
            .directive('myHistogramChart', function () {
                return {
                    restrict: 'E',
                   
                    scope: {
                        title: '=',
                        data: '='
                    },
                    template: '<div></div>',
                    link: function ($scope, element, attrs) {
                    	
                    	let visu = {
                    			chart:{
                    				height:"80%",
                    			},
                    		
                    			    title: {
                    			        text: 'Highcharts Histogram'
                    			    },

                    			    xAxis: [{
                    			        title: { text: 'Scatter' },
                    			        alignTicks: false
                    			    }, {
                    			        title: { text: 'Histogram' },
                    			        alignTicks: false,
                    			        opposite: true
                    			    }],

                    			    yAxis: [{
                    			        title: { text: 'Scatter' }
                    			    }, {
                    			        title: { text: 'Histogram' },
                    			        opposite: true
                    			    }],

                    			    plotOptions: {
                    			        histogram: {
                    			            accessibility: {
                    			                pointDescriptionFormatter: function (point) {
                    			                    var ix = point.index + 1,
                    			                        x1 = point.x.toFixed(3),
                    			                        x2 = point.x2.toFixed(3),
                    			                        val = point.y;
                    			                    return ix + '. ' + x1 + ' to ' + x2 + ', ' + val + '.';
                    			                }
                    			            }
                    			        }
                    			    },

                    			    series: [{
                    			        name: 'Histogram',
                    			        type: 'histogram',
                    			        xAxis: 0,
                    			        yAxis: 0,
                    			        baseSeries: 's1',
                    			        zIndex: -1
                    			    }, {
                    			        name: 'Scatter',
                    			        type: 'scatter',
                    			        data:  [],
                    			        id: 's1',
                    			        marker: {
                    			            radius: 1.5
                    			        }
                    			    }]
                    			};
                    	
                        var chart4 = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart4.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		//console.log(oldValue, "--------->",newValue);
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    		chart4.update({
                    				
                    			series: [{
                			        name: 'Histogram',
                			        type: 'histogram',
                			        xAxis: 0,
                			        yAxis: 0,
                			        baseSeries: 's1',
                			        zIndex: -1
                			    }, {
                			        name: 'Scatter',
                			        type: 'scatter',
                			        data:  newValue,
                			        id: 's1',
                			        marker: {
                			            radius: 1.5
                			        }
                			    }]
                        	    });
                    			
                    			
                    		}	
                    		
                    			
                    		});
                        
                    }
                };
            })
            
            
            
            
            
            
            
            
            
            
            
            // Directive for Histogram charts, pass in title and data only    
            .directive('myBoxplotChart', function () {
                return {
                    restrict: 'E',
                   
                    scope: {
                        title: '=',
                        data: '='
                    },
                    template: '<div></div>',
                    link: function ($scope, element, attrs) {
                    	
                    	let visu =  {
                    			chart: {
                            type: 'boxplot',
                            height:"80%",
                            
                        },
                        xAxis: {
    				        categories: [''],
    				        title: {
    				            text: ''
    				        }
    				    },
                        title: {
                            text: ''
                        },

                        legend: {
                            enabled: false
                        },

                       
                        
                        series: [{
                        	name:'',
                            data: [
                                
                      
                            ],
                            tooltip: {
                                headerFormat: '' //'<em>Experiment No {point.key}</em><br/>'
                            }
                        }]

                    };
                    	
                        var chart4 = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart4.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		//console.log(oldValue, "--------->",newValue);
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart4.update({
                    				 xAxis: {
                    				        categories: [newValue.label],
                    				        title: {
                    				            text: ''
                    				        }
                    				    },
                    				 yAxis: {
                    				        title: {
                    				            text: newValue.label
                    				        },
                    				        plotLines: [{
                    				            value: newValue.meanVal,
                    				            color: 'red',
                    				            width: 1,
                    				            label: {
                    				                text: 'Theoretical mean: '+ newValue.meanVal,
                    				                align: 'center',
                    				                style: {
                    				                    color: 'gray'
                    				                }
                    				            }
                    				        }]
                    				    },
		                       
		                        series: [{
		                        	name:newValue.label,
		                            data: [newValue.data] 
		                        	}]
                    			});
                    			
                    			
                    		}	
                    		
                    			
                    		});
                        
                    }
                };
            })
            
            
            
            
            
            
            
            
            
            
            
         // Directive for Wordcloud, pass in title and data only    
              
            // Directive for Multi boxplot charts, pass in title and data only    
            .directive('myMultiBoxplotChart', function () {
                return {
                    restrict: 'E',
                   
                    scope: {
                        title: '=',
                        data: '='
                    },
                    template: '<div></div>',
                    link: function ($scope, element, attrs) {
                    	
                    	let visu =  {
                    			chart: {
                            type: 'boxplot',
                            height:"80%",
                            
                        },

                        title: {
                            text: ''
                        },

                        legend: {
                            enabled: false
                        },

                        
                        
                        series: [{
                           
                            data: [
                                []
                      
                            ],
                            tooltip: {
                                headerFormat: '<em>{point.x}</em>'
                            }
                        }]

                    };
                    	
                        var chart4 = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart4.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart4.update({
                    				xAxis: {
                    			        categories:newValue.keys,
                    			        title: {
                    			            text: ''
                    			        }
                    			    },

                    				 yAxis: {
                    				        title: {
                    				            text: 'Values'
                    				        },
                    				        plotLines: [{
                    				            value: newValue.meanVal,
                    				            color: 'red',
                    				            width: 1,
                    				            label: {
                    				                text: 'Theoretical mean: '+ newValue.meanVal,
                    				                align: 'center',
                    				                style: {
                    				                    color: 'gray'
                    				                }
                    				            }
                    				        }]
                    				    },
		                       
		                        series: [{
		                        	name:'',
		                            data:   newValue.values 
		                            }]
                    			});
                    			
                    	
                    		}	
                    		
                    			
                    		});
                        
                    }
                };
            })
            
            
            
            
            
            
             // Directive for Graph  harts, pass in title and data only    
            .directive('myWheelChart', function () {
                return {
                    restrict: 'E',
                    template: '<div class="revert"></div>',
                    scope: {
                        title: '=',
                        data: '='
                    },                   
                    link: function ($scope, element, attrs) {         	
                    	let visu =  {
                    			chart: {
                    				height:"80%"
                    			},

                    		    title: {
                    		        text: ''
                    		    },

                    		   /* accessibility: {
                    		        point: {
                    		            valueDescriptionFormat: '{index}. From {point.from} to {point.to}: {Math.round(point.weight*100)}%.'
                    		        }

                    		    },*/

								tooltip:{
									nodeFormatter:function(){
										return `<span><b>${this.id}</b> : ${this.sum/(Array.from(new Set(this.linksTo.concat(this.linksFrom))).length)}`
									}
								},
                    		   
                    		    series: [{
                    		        keys: ['from', 'to', 'weight'],
                    		        data: [],
                    		        type: 'dependencywheel',
                    		        name: 'Dependency wheel series',
                    		        dataLabels: {
                    		          color: '#333',
                    		          textPath: {
                    		            enabled: true,
                    		            attributes: {
                    		              dy: 5
                    		            }
                    		          },
                    		          distance: 15
                    		        },
                    		       
                    		        size: '95%'
                    		      }]

                    		};
                    	
                        var chart = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart4.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                        	//console.log("UPDATE WHEEL--------->");
                        	//console.log(newValue);
                    		if(newValue != undefined){
                    			
                    			chart.update({
                        			"series": [{
                        		        keys: ['from', 'to', 'weight'],
                        		        data: newValue.links
                		    }]
                        	    });
                    		}	
                    		
                    			
                    		});
                        
                    }
                };
            }) 
            
            
            
            
            
            
              // Directive for Graph  harts, pass in title and data only    
            .directive('myHeatMapChart', function () {
                return {
                    restrict: 'E',
                    scope: {
                        title: '=',
                        data: '='
                    },                   
                    link: function ($scope, element, attrs) {   
                    	
                    	function getPointCategoryName(point, dimension) {
                    	    var series = point.series,
                    	        isY = dimension === 'y',
                    	        axis = series[isY ? 'yAxis' : 'xAxis'];
                    	    return axis.categories[point[isY ? 'y' : 'x']];
                    	}
                    	
                    	
                    	let visu =  {
                    			chart: {
                    				height:"100%",
                    				 type: 'heatmap',
                    				 plotBorderWidth: 1
                    			},

                    			title: {
                    		        text: ''
                    		    },

                    		    xAxis: {
                    		        categories: []
                    		    },

                    		    yAxis: {
                    		        categories: [],
                    		        title: null,
                    		        reversed: true
                    		    },

                    		    accessibility: {
                    		        point: {
                    		            descriptionFormatter: function (point) {
                    		                var ix = point.index + 1,
                    		                    xName = getPointCategoryName(point, 'x'),
                    		                    yName = getPointCategoryName(point, 'y'),
                    		                    val = point.value;
                    		                return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                    		            }
                    		        }
                    		    },

                    		    colorAxis: {
                    		        min: 0,
                    		        minColor: '#FFFFFF',
                    		        maxColor: Highcharts.getOptions().colors[2]
                    		    },

                    		    legend: {
                    		        align: 'right',
                    		        layout: 'vertical',
                    		        margin: 0,
                    		        verticalAlign: 'top',
                    		        y: 25,
                    		        symbolHeight: 280
                    		    },

                    		    tooltip: {
                    		        formatter: function () {
                    		            return '<b>' + getPointCategoryName(this.point, 'x') + '</b> - <b>' + 
                    		            '<b>' + getPointCategoryName(this.point, 'y') + '</b><br>' +
                		                this.point.value 
                    		            ;
                    		        }
                    		    },

                    		    series: [{
                    		        name: '',
                    		        borderWidth: 1,
                    		        data: [],
                    		        dataLabels: {
                    		            enabled: true,
                    		            color: '#000000'
                    		        }
                    		    }],

                    		    responsive: {
                    		        rules: [{
                    		            condition: {
                    		                maxWidth: 500
                    		            },
                    		            chartOptions: {
                    		                yAxis: {
                    		                    labels: {
                    		                        formatter: function () {
                    		                            return this.value.charAt(0);
                    		                        }
                    		                    }
                    		                }
                    		            }
                    		        }]
                    		    }
                    	};
                    	
                        var chart = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                        	
                    		if(newValue != undefined){
                    		
                    			chart.update({
                    				xAxis: {
                        		        categories: newValue.xAxis
                        		    },

                        		    yAxis: {
                        		        categories: newValue.yAxis,
                        		        title: null,
                        		        reversed: true
                        		    },
                        		    series: [{
                        		        name: '',
                        		        borderWidth: 1,
                        		        data: newValue.values,
                        		        dataLabels: {
                        		            enabled: true,
                        		            color: '#000000'
                        		        }
                        		    }]
                        	    });
                    		}	
                    		
                    			
                    		});
                        
                    }
                };
            }) 
            
 
            
            
            
              // Directive for Graph  harts, pass in title and data only    
            .directive('myScatterChart', function () {
                return {
                    restrict: 'E',
               
                    scope: {
                        title: '=',
                        data: '='
                    },                   
                    link: function ($scope, element, attrs) {         	
                    	let visu = {
                    		chart:{
                    			height:"80%",
                    		},
                    	    title: {
                    	        text: ''
                    	    },
                    	    
                    	    xAxis: {
                    	        gridLineWidth: 1,
                    	        title: {
                    	            enabled: true,
                    	            text: 'X axis'
                    	        },
                    	        startOnTick: true,
                    	        endOnTick: true,
                    	        showLastLabel: true
                    	    },
                    	    yAxis: {
                    	        title: {
                    	            text: 'Y axis'
                    	        }
                    	    },
                    	    legend: {
                    	        layout: 'vertical',
                    	        align: 'right',
                    	        verticalAlign: 'middle'
                    	    },
                    	    series: [{
                    	        name: 'Observations',
                    	        type: 'scatter',
                    	        color: Highcharts.getOptions().colors[1],
                    	        data: []

                    	    }],
                    	    tooltip: {
                    	        headerFormat: '<b>{series.name}</b><br>',
                    	        pointFormat: '{point.x}, {point.y}'
                    	    },
                    	    responsive: {
                    	        rules: [{
                    	            condition: {
                    	                maxWidth: 500
                    	            },
                    	            chartOptions: {
                    	                legend: {
                    	                    align: 'center',
                    	                    layout: 'horizontal',
                    	                    verticalAlign: 'bottom'
                    	                }
                    	            }
                    	        }]
                    	    }
                    	};
                    	
                        var chart = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                        	//console.log("UPDATE WHEEL--------->");
                        	//console.log(newValue);
                    		if(newValue != undefined){
                    			
                    			chart.update({
                    				series: [{
                            	        name: 'Observations',
                            	        type: 'scatter',
                            	        color: Highcharts.getOptions().colors[1],
                            	        data: newValue

                            	    }]
                        	    });
                    		}	
                    		
                    			
                    		});
                        
                    }
                };
            }) 
            
            
            
            
            
            
             // Directive for Graph  harts, pass in title and data only    
            .directive('myBubbleChart', function () {
                return {
                    restrict: 'E',
               
                    scope: {
                        title: '=',
                        data: '='
                    },                   
                    link: function ($scope, element, attrs) {         	
                    	let visu = {

                    		    chart: {
                    		        type: 'bubble',
                    		        plotBorderWidth: 1,
                    		        zoomType: 'xy',
                    		        height:"80%",
                    		    },

                    		    legend: {
                    		        enabled: false
                    		    },

                    		    title: {
                    		        text: 'PCA result'
                    		    },

                    		   
                    		    accessibility: {
                    		        point: {
                    		            valueDescriptionFormat: '{index}. {point.name}, comp 1: {point.x}, comp 2: {point.y}'
                    		        }
                    		    },

                    		    xAxis: {
                    		        gridLineWidth: 1,
                    		        title: {
                    		            text: ''
                    		        },
                    		        
                    		        
                    		    },

                    		    /*yAxis: {
                    		        startOnTick: false,
                    		        endOnTick: false,
                    		        title: {
                    		            text: 'Daily sugar intake'
                    		        },
                    		        labels: {
                    		            format: '{value} gr'
                    		        },
                    		        maxPadding: 0.2,
                    		        plotLines: [{
                    		            color: 'black',
                    		            dashStyle: 'dot',
                    		            width: 2,
                    		            value: 50,
                    		            label: {
                    		                align: 'right',
                    		                style: {
                    		                    fontStyle: 'italic'
                    		                },
                    		                text: 'Safe sugar intake 50g/day',
                    		                x: -10
                    		            },
                    		            zIndex: 3
                    		        }],
                    		        accessibility: {
                    		            rangeDescription: 'Range: 0 to 160 grams.'
                    		        }
                    		    },
*/
                    		    tooltip: {
                    		        useHTML: true,
                    		        headerFormat: '<table>',
                    		        pointFormat: '<tr><th colspan="2"><strong>{point.name}</strong></th></tr>' +
                    		            '<tr><th>Comp 1:</th><td>{point.x}</td></tr>' +
                    		            '<tr><th>Comp 2:</th><td>{point.y}</td></tr>',
                    		        footerFormat: '</table>',
                    		        followPointer: true
                    		    },

                    		    plotOptions: {
                    		        series: {
                    		            dataLabels: {
                    		                enabled: true,
                    		                format: '{point.name}'
                    		            }
                    		        }
                    		    },

                    		    series: [{
                    		        data: [ ]
                    		    }]

                    		};
                    	
                        var chart = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                        	//console.log("UPDATE BUBBLE--------->");
                        	//console.log(newValue);
                    		if(newValue != undefined){
                    			chart.update({
                    			series: [{
                    		        data: newValue,
                    		    }]
                    			});
                			}	
                    		
                    			
                    		});
                        
                    }
                };
            }) 
            
            
            
            
       // Directive for Graph  harts, pass in title and data only    
            .directive('myRadarChart', function () {
                return {
                    restrict: 'E',
               
                    scope: {
                        title: '=',
                        data: '='
                    },                   
                    link: function ($scope, element, attrs) {         	
                    	let visu = {

                    			 chart: {
                    			        polar: true,
                    			        type: 'line',
                    			        height:'80%'
                    			    },

                    			    accessibility: {
                    			        description: ''
                    			    },

                    			    title: {
                    			        text: '',
                    			        x: -80
                    			    },

                    			    pane: {
                    			        size: '80%'
                    			    },

                    			    xAxis: {
                    			        categories: [],
                    			        tickmarkPlacement: 'on',
                    			        lineWidth: 0
                    			    },

                    			    yAxis: {
                    			        gridLineInterpolation: 'polygon',
                    			        lineWidth: 0,
                    			        min: 0
                    			    },

                    			    tooltip: {
                    			        shared: true,
                    			        pointFormat: '<span style="color:{series.color}">{series.name}'
                    			    },
                    			    plotOptions: {
                    			        packedbubble: {
                    			            minSize: '20%',
                    			            maxSize: '100%',
                    			            zMin: 0,
                    			            zMax: 1000,
                    			            layoutAlgorithm: {
                    			                gravitationalConstant: 0.05,
                    			                splitSeries: true,
                    			                seriesInteraction: false,
                    			                dragBetweenSeries: false,
                    			                parentNodeLimit: true
                    			            },
                    			            dataLabels: {
                    			                enabled: true,
                    			                format: '{point.name}',
                    			                filter: {
                    			                    property: 'y',
                    			                    operator: '>',
                    			                    value: 150
                    			                },
                    			                style: {
                    			                    color: 'black',
                    			                    textOutline: 'none',
                    			                    fontWeight: 'normal'
                    			                }
                    			            }
                    			        }
                    			    },
                    			    legend: {
                    			        align: 'right',
                    			        verticalAlign: 'middle',
                    			        layout: 'vertical'
                    			    },

                    			    series: [],

                    			    responsive: {
                    			        rules: [{
                    			            condition: {
                    			                maxWidth: 500
                    			            },
                    			            chartOptions: {
                    			                legend: {
                    			                    align: 'center',
                    			                    verticalAlign: 'bottom',
                    			                    layout: 'horizontal'
                    			                },
                    			                pane: {
                    			                    size: '70%'
                    			                }
                    			            }
                    			        }]
                    			    }
                    	};
                    	
                        var chart = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                        	//console.log("UPDATE BUBBLE--------->");
                        	
                    		if(newValue != undefined){/*
                    			chart.update({
                    			series: newValue.series,
                    			xAxis: {
                			        categories: newValue.keys,
                			        tickmarkPlacement: 'on',
                			        lineWidth: 0
                			    }
                    			});*/
                    			
                    			
                    			
                    			let visu = {

                           			 chart: {
                           			        polar: true,
                           			        type: 'line',
                           			        height:'80%'
                           			    },

                           			    accessibility: {
                           			        description: 'A spiderweb chart compares the allocated budget against actual spending within an organization. The spider chart has six spokes. Each spoke represents one of the 6 departments within the organization: sales, marketing, development, customer support, information technology and administration. The chart is interactive, and each data point is displayed upon hovering. The chart clearly shows that 4 of the 6 departments have overspent their budget with Marketing responsible for the greatest overspend of $20,000. The allocated budget and actual spending data points for each department are as follows: Sales. Budget equals $43,000; spending equals $50,000. Marketing. Budget equals $19,000; spending equals $39,000. Development. Budget equals $60,000; spending equals $42,000. Customer support. Budget equals $35,000; spending equals $31,000. Information technology. Budget equals $17,000; spending equals $26,000. Administration. Budget equals $10,000; spending equals $14,000.'
                           			    },

                           			    title: {
                           			        text: '',
                           			        x: -80
                           			    },

                           			    pane: {
                           			        size: '80%'
                           			    },

                           			 series: newValue.series,
                         			xAxis: {
                     			        categories: newValue.keys,
                     			        tickmarkPlacement: 'on',
                     			        lineWidth: 0
                     			    },

                           			    yAxis: {
                           			        gridLineInterpolation: 'polygon',
                           			        lineWidth: 0,
                           			        min: 0
                           			    },

                           			    tooltip: {
                           			        shared: true,
                           			        pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>'
                           			    },
                           			 plotOptions: {
                           		        packedbubble: {
                           		            minSize: '20%',
                           		            maxSize: '100%',
                           		            zMin: 0,
                           		            zMax: 1000,
                           		            layoutAlgorithm: {
                           		                gravitationalConstant: 0.05,
                           		                splitSeries: true,
                           		                seriesInteraction: false,
                           		                dragBetweenSeries: true,
                           		                parentNodeLimit: true
                           		            },
                           		            dataLabels: {
                           		                enabled: true,
                           		                format: '{point.name}',
                           		                filter: {
                           		                    property: 'y',
                           		                    operator: '>',
                           		                    value: 250
                           		                },
                           		                style: {
                           		                    color: 'black',
                           		                    textOutline: 'none',
                           		                    fontWeight: 'normal'
                           		                }
                           		            }
                           		        }
                           		    },
                           			    legend: {
                           			        align: 'right',
                           			        verticalAlign: 'middle',
                           			        layout: 'vertical'
                           			    },

                           			   
                           			    responsive: {
                           			        rules: [{
                           			            condition: {
                           			                maxWidth: 500
                           			            },
                           			            chartOptions: {
                           			                legend: {
                           			                    align: 'center',
                           			                    verticalAlign: 'bottom',
                           			                    layout: 'horizontal'
                           			                },
                           			                pane: {
                           			                    size: '70%'
                           			                }
                           			            }
                           			        }]
                           			    }
                           	};
                           	
                               var chart = Highcharts.chart(element[0], visu);
                			}	
                    		
                    			
                    		});
                        
                    }
                };
            })       
            
            
            
            
            
            
            
            // Directive for Graph  harts, pass in title and data only    
            .directive('myGroupsChart', function () {
                return {
                    restrict: 'E',
               
                    scope: {
                        title: '=',
                        data: '='
                    },                   
                    link: function ($scope, element, attrs) {         	
                    	let visu = {

                    			chart: {
                    		        type: 'packedbubble',
                    		        height: '100%'
                    		    },
                    		    title: {
                    		        text: ''
                    		    },
                    		    tooltip: {
                    		        useHTML: true,
                    		        pointFormat: '<b>{point.name}:{point.value}</b>'
                    		    },
                    		    plotOptions: {
                    		        packedbubble: {
                    		            minSize: '20%',
                    		            maxSize: '80%',
                    		            zMin: 0,
                    		            zMax: 1000,
                    		            layoutAlgorithm: {
                    		                gravitationalConstant: 0.05,
                    		                splitSeries: true,
                    		                seriesInteraction: false,
                    		                dragBetweenSeries: false,
                    		                parentNodeLimit: true
                    		            },
                    		            dataLabels: {
                    		                enabled: true,
                    		                format: '{point.name}',
                    		                filter: {
                    		                    property: 'y',
                    		                    operator: '>',
                    		                    value: 199
                    		                },
                    		                style: {
                    		                    color: 'black',
                    		                    textOutline: 'none',
                    		                    fontWeight: 'normal'
                    		                }
                    		            }
                    		        }
                    		    },
                    		    series: []
                    		};
                    	
                        var chart = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                        	
                    		if(newValue != undefined){
                    			/*chart.update({
                    			series: newValue
                    			});*/
                    			
                    			let visu = {

                            			chart: {
                            		        type: 'packedbubble',
                            		        height: '100%'
                            		    },
                            		    title: {
                            		        text: ''
                            		    },
                            		    tooltip: {
                            		        useHTML: true,
                            		        pointFormat: '<b>{point.name}</b>: ({point.count})'
                            		    },
                            		    plotOptions: {
                            		        packedbubble: {
                            		            minSize: '20%',
                            		            maxSize: '100%',
                            		            zMin: 0,
                            		            zMax: 1000,
                            		            layoutAlgorithm: {
                            		                gravitationalConstant: 0.05,
                            		                splitSeries: true,
                            		                seriesInteraction: false,
                            		                dragBetweenSeries: false,
                            		                parentNodeLimit: true
                            		            },
                            		            dataLabels: {
                            		                enabled: true,
                            		                format: '{point.name}',
                            		                filter: {
                            		                    property: 'y',
                            		                    operator: '>',
                            		                    value: 124
                            		                },
                            		                style: {
                            		                    color: 'black',
                            		                    textOutline: 'none',
                            		                    fontWeight: 'normal'
                            		                }
                            		            }
                            		        }
                            		    },
                            		    series: newValue
                            		};
                            	
                                var chart = Highcharts.chart(element[0], visu);
                			}	
                    		
                    			
                    		});
                        
                    }
                };
            })       
            
            
            
            
            
           /* 
           // Directive for Graph  harts, pass in title and data only    
            .directive('myGraphChart', function () {
                return {
                    restrict: 'E',
                   
                    scope: {
                        title: '=',
                        data: '='
                    },
                    template: '<div></div>',
                    link: function ($scope, element, attrs) {
                    	
                    	
                    	
                    	
                    	
                    	
                    	
                    	
                    	
                    	
                    	
                    	var celticColor = "#7becb2",
                    	  italicColor = "#ecb27b",
                    	  indoIranianColor = "#ec7bb6";
                 	
                    	let visu =  {

                    			  chart: {
                    			    type: 'networkgraph',
                    			    marginTop: '80',
                    			    height:'80%'
                    			  },

                    			  title: {
                    			    text: 'The Indo-European Language Tree'
                    			  },

                    			  subtitle: {
                    			    text: 'A Force-Directed Network Graph in Highcharts'
                    			  },

                    			  plotOptions: {
                    			    networkgraph: {
                    			      keys: ['from', 'to'],
                    			      
                    			      layoutAlgorithm: {
                    			        enableSimulation: true,
                    			        integration: 'verlet',
                    			        linkLength: '100'
                    			      }
                    			    }
                    			  },

                    			  series: [{
                    			    marker: {
                    			      radius: 13,
                    			    },
                    			    dataLabels: {
                    			      enabled: true,
                    			      linkFormat: '',
                    			      allowOverlap: true
                    			    },
                    			    data: [
                    			      ['Proto Indo-European', 'Balto-Slavic'],
                    			      ['Proto Indo-European', 'Germanic'],
                    			      ['Proto Indo-European', 'Celtic'],
                    			      ['Proto Indo-European', 'Italic'],
                    			      ['Proto Indo-European', 'Hellenic'],
                    			      ['Proto Indo-European', 'Anatolian'],
                    			      ['Proto Indo-European', 'Indo-Iranian'],
                    			      ['Proto Indo-European', 'Tocharian'],
                    			      ['Indo-Iranian', 'Dardic'],
                    			      ['Indo-Iranian', 'Indic'],
                    			      ['Indo-Iranian', 'Iranian'],
                    			      ['Iranian', 'Old Persian'],
                    			      ['Old Persian', 'Middle Persian'],
                    			      ['Indic', 'Sanskrit'],
                    			      ['Italic', 'Osco-Umbrian'],
                    			      ['Italic', 'Latino-Faliscan'],
                    			      ['Latino-Faliscan', 'Latin'],
                    			      ['Celtic', 'Brythonic'],
                    			      ['Celtic', 'Goidelic']
                    			    ],
                    			    nodes: [{
                    			      id: 'Indo-Iranian',
                    			      color: indoIranianColor
                    			    }, {
                    			      id: 'Dardic',
                    			      color: indoIranianColor
                    			    }, {
                    			      id: 'Indic',
                    			      color: indoIranianColor
                    			    }, {
                    			      id: 'Iranian',
                    			      color: indoIranianColor
                    			    }, {
                    			      id: 'Old Persian',
                    			      color: indoIranianColor
                    			    }, {
                    			      id: 'Middle Persian',
                    			      color: indoIranianColor
                    			    }, {
                    			      id: 'Sanskrit',
                    			      color: indoIranianColor
                    			    }, {
                    			      id: 'Celtic',
                    			      color: celticColor
                    			    }, {
                    			      id: 'Brythonic',
                    			      color: celticColor
                    			    }, {
                    			      id: 'Goidelic',
                    			      color: celticColor
                    			    }, {
                    			      id: 'Italic',
                    			      color: italicColor
                    			    }, {
                    			      id: 'Osco-Umbrian',
                    			      color: italicColor
                    			    }, {
                    			      id: 'Latino-Faliscan',
                    			      color: italicColor
                    			    }, {
                    			      id: 'Latin',
                    			      color: italicColor
                    			    }]
                    			  }]
                    			};
                    	
                        var chart = Highcharts.chart(element[0], visu);
                        
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			/*chart4.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });
                    		}
                    		
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			chart.update({
                    				xAxis: {
                    			        categories:newValue.keys,
                    			        title: {
                    			            text: 'Experiment No.'
                    			        }
                    			    },

                    				 yAxis: {
                    				        title: {
                    				            text: 'Observations'
                    				        },
                    				        plotLines: [{
                    				            value: newValue.meanVal,
                    				            color: 'red',
                    				            width: 1,
                    				            label: {
                    				                text: 'Theoretical mean: '+ newValue.meanVal,
                    				                align: 'center',
                    				                style: {
                    				                    color: 'gray'
                    				                }
                    				            }
                    				        }]
                    				    },
		                       
		                        series: [{
		                            data:   newValue.links 
		                            }]
                    			});
                    			
                    			console.log(oldValue, "--------->",newValue);
                    		}	
                    		
                    			
                    		});
                        
                    }
                };
            }) 
            
           */
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            