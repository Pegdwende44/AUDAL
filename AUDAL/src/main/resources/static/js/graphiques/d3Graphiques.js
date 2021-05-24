app.directive('myWordCloud', function () {
                return {
                    restrict: 'E',
                    template: "<svg width='850' height='50%'></svg>",
                    scope: {
                        title: '=',
                        data: '='
                    },
                    //template: '<div style="background-color:gray"></div>',
                    link: function ($scope, element, attrs) {
                  
                    	 var words = [];
                        
                    
                    	var width = element.parent()[0].offsetWidth;
                    	var height = $( document ).height()*80/100;
                    	fontFamily = "Arial",
                    	fontScale = d3.scaleLinear().range([20, 120]), // Construction d'une échelle linéaire continue qui va d'une font de 20px à 120px
                        fillScale = d3.scaleOrdinal(d3.schemeCategory10);
                    	function draw() {
                    		d3.select(element[0]).selectAll("*").remove();//Remove if exists
                            d3.select(element[0]).append("svg") // Ajout d'un élément SVG sur un DIV existant de la page
                                .attr("class", "svg")
                                .attr("width", width)
                                .attr("height", height)
                                .append("g") // Ajout du groupe qui contiendra tout les mots
                                    .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")") // Centrage du groupe
                                    .selectAll("text")
                                    .data(words)
                                    .enter().append("text") // Ajout de chaque mot avec ses propriétés
                                        .style("font-size", d => d.size + "px")
                                        .style("font-family", fontFamily)
                                        .style("fill", d => fillScale(d.size))
                                        .attr("text-anchor", "middle")
                                		.attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                            			.text(d => d.text);;
                        }
                    	
                    	function updateVisu(){
                            let minSize = d3.min(words, d => d.size);
                            let maxSize = d3.max(words, d => d.size);                           
                            fontScale.domain([minSize, maxSize]);
                            d3.layout.cloud()
                                .size([width, height])
                                .words(words)
                                .padding(1)
                                .rotate(function() {
                                    return ~~(Math.random() * 2) * 45;
                                })
                                .spiral("rectangular")
                                .font(fontFamily)
                                .fontSize(d => fontScale(d.size))
                                .on("end", draw)
                                .start();
                    	}
                        
                        $scope.$watch('title', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			/*chart4.update({
                        			"title": {
                        	            "text": newValue
                        	        },
                        	    });*/
                    		}
                    		
                    		});
                        
                        $scope.$watch('data', function(newValue, oldValue) {
                    		if(newValue != undefined){
                    			//restart(newValue.links, newValue.nodes);
                    			//console.log("UPDATE");
                    			
                    			words = newValue.terms;
                    			updateVisu();
                    			
                           		}	
                    		
                    			
                    		});
                        
                    }
                };
            })             