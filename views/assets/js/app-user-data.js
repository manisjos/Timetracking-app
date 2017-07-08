var userData = angular.module('userData', []);




userData.controller('userDataCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
	

		$scope.fetchUserData = function(user){
		
			if (user == null || user.length === 0) {
    			swal("OOPS", "Username cannot be Blank!" );
  			}
			else
			{
				
			$scope.username = user;
			var sd = $('#sDate').val();
			var ed = $('#eDate').val();

			var usrName = localStorage.getItem("login");
			var appKey = localStorage.getItem("appKey");
			
			//$( "#tabs" ).tabs();
			$("#lnk1").click(function(){
				if ($("#tabs-1").hasClass("hidden-graph")){
					$("#tabs-1").removeClass("hidden-graph");
					$("#tabs-2").addClass("hidden-graph");
					$("#lnk2").removeClass("ui-tabs-active");
					$("#lnk1").addClass("ui-tabs-active");
					//console.log(this);
				}
				else{ //do nothing
				}
				
			});
			$("#lnk2").click(function(){
				if ($("#tabs-2").hasClass("hidden-graph")){
					$("#tabs-2").removeClass("hidden-graph");
					$("#tabs-1").addClass("hidden-graph");
					$("#lnk1").removeClass("ui-tabs-active");
					$("#lnk2").addClass("ui-tabs-active");
				}
				else{ //do nothing
				}
				
			});
			

			var dfrd = $q.defer();
			
			$http.get(APIBaseURL+"getUserdata?startdt="+sd+"&enddt="+ed+"&akey="+appKey+"&userid="+user,	   
				{
					
				}
			)
			.then(function(response) {
				
				$('#graphicalData').removeClass('hide');
				$('#profileData').removeClass('hide');
				
				var data = response.data; 

				$scope.user = data;
				
				// ====================
				// START OF D3 CHARTING
				// ====================
				//$("#line-chart-container-1").empty();
				//$("#line-chart-container-2").empty();
				// Set the dimensions of the canvas / graph
                var	margin = {top: 30, right: 50, bottom: 30, left: 50}, divWidth = $("#line-chart-container-1").width(), width = (divWidth - 30) - margin.left - margin.right,
                    height = 250 - margin.top - margin.bottom;

                // Parse the date / time
                var	parseDate = d3.time.format("%d-%b-%y").parse;
                var formatTime = d3.time.format("%e %B");// Format tooltip date / time

                // Set the ranges
                var	x = d3.time.scale.utc().range([0, width]);
                var	y = d3.scale.linear().range([height, 0]);

                // Define the line
                var	valueline = d3.svg.line()
					//.interpolate("basis")
                    .x(function(d) {
						if((d.date).toString().length == 8){
							return x(new Date((d.date).toString().substr(0,4)+"-"+(d.date).toString().substr(4,2)+"-"+(d.date).toString().substr(6,2)));
						}
						else{
							return x((d.date).toString().substr(8,2));
						}
					})
                    .y(function(d) { return y(parseInt(d.s)); });

                // Define the line
                var	valueline1 = d3.svg.line()
					//.interpolate("basis")
                    .x(function(d) {
						if((d.date).toString().length == 8){
							return x(new Date((d.date).toString().substr(0,4)+"-"+(d.date).toString().substr(4,2)+"-"+(d.date).toString().substr(6,2)));
							console.log(x);
						}
						else{
							return x((d.date).toString().substr(8,2));
						}
					})
                    .y(function(d) { return y(parseInt(d.e)); });

                // Define 'div' for tooltips
                var div = d3.select("body")
                    .append("div")  // declare the tooltip div
                    .attr("class", "tooltip")              // apply the 'tooltip' class
                    .style("opacity", 0);                  // set the opacity to nil
				// Define 'div' for tooltips
                var div1 = d3.select("body")
                    .append("div")  // declare the tooltip div
                    .attr("class", "map-tooltip shadow")              // apply the 'tooltip' class
                    .style("opacity", 0);                  // set the opacity to nil

                
				var svg;
				var svg1;
					
				// Adds the svg canvas
				
				var	svg = d3.select("#line-chart-container-1")
						.html('')
						.append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.attr('viewBox', '0 0 '+(width + margin.left + margin.right)+' '+(height + margin.top + margin.bottom))
						.attr('perserveAspectRatio', 'xMinYMid')
						.attr("class","chart")
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
				
					// Adds the svg canvas
				var svg1 = d3.select("#line-chart-container-2")
						.html('')
						.append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.attr('viewBox', '0 0 '+(width + margin.left + margin.right)+' '+(height + margin.top + margin.bottom))
						.attr('perserveAspectRatio', 'xMinYMid')
						.attr("class","chart")
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
			 
					// function loadChart(startDate, endDate, appKey){
						svg.selectAll("*").remove();
						svg1.selectAll("*").remove();
					
					
						dataTs = JSON.stringify(data.tS);
						dataTe = JSON.stringify(data.tE);
						
						data = JSON.parse(dataTs);
						
						data1 = JSON.parse(dataTe);
						
						plotLineChartdt(data, svg, div, false, 's', valueline, x, y, width, height);

						plotLineChartdt(data1,svg1, div1, true, "e", valueline1, x, y, width, height);

					//});
					//}
				
				// ===================
				// END OF D3 CHARTING
				// ===================
			
				
				}, function(x) {
					dfrd.reject(true);
				});
				return dfrd.promise;
				
			}//End of else	
		
		}; // End of main function fetch all data
			
			
		// Events Chart
	
		$scope.fetchEventCharts = function(event){

			var sd = $('#sDate').val();
			var ed = $('#eDate').val();
			
			
			var username = $scope.username
			var appKey = localStorage.getItem("appKey");
			
			
				
				$('.chart-main-div').show();
				$("#chart-container_1").empty();
				//$("#chart-container_2").empty();
				// Set the dimensions of the canvas / graph
                var	margin = {top: 30, right: 50, bottom: 30, left: 50}, divWidth = $("#chart-container_1").width(), width = (divWidth - 30) - margin.left - margin.right,
                    height = 250 - margin.top - margin.bottom;

                // Parse the date / time
                var	parseDate = d3.time.format("%d-%b-%y").parse;
                var formatTime = d3.time.format("%e %B");// Format tooltip date / time

                // Set the ranges
                var	x = d3.time.scale.utc().range([0, width]);
                var	y = d3.scale.linear().range([height, 0]);

				
				
                // Define the line
                var	valueline = d3.svg.line()
					//.interpolate("basis")
                    //.x(function(d) { return x(d.date); })
					.x(function(d) { 
						if((d.date).length === 8){
							return x(new Date((d.date).substr(0,4)+"-"+(d.date).substr(4,2)+"-"+(d.date).substr(6,2))); 
						}
						else{
							return x((d.date).substr(8,2));
						}
					})
                    .y(function(d) { return y(d.e); });
                
                

                // Define 'div' for tooltips
                var div = d3.select("body")
                    .append("div")  // declare the tooltip div 
                    .attr("class", "tooltip")              // apply the 'tooltip' class
                    .style("opacity", 0);                  // set the opacity to nil
				
                // Adds the svg canvas
                var	svge = d3.select("#chart-container_1")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
					.attr('viewBox', '0 0 '+(width + margin.left + margin.right)+' '+(height + margin.top + margin.bottom))
					.attr('perserveAspectRatio', 'xMinYMid')
					.attr("class","chart")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				
                
			
            d3.json(APIBaseURL+"getUserEventdata?startdt="+sd+"&enddt="+ed+"&akey="+appKey+"&eventname="+event+"&userid="+username,  function(error, data) {      
			
                    data.forEach(function(d) {
						
					  	d.date = d.date;
						
				  	});
                    plotLineChart(data,svge, div, false, "e", valueline, x, y, width, height);
                    
                   
                    
                });
			
			
			}// End of Events Charts
		
		
		
		
		
			// ===================
			// BEGIN FUNNEL CHART
			// ===================
			$scope.drawChart = function(event){
				
						var events = [];
						$.each($("input[name='events']:checked"), function(){            
							events.push($(this).val());
						});
						
						allEvents = events.join(",");
					
						var sd = $('#sDate').val();
						var ed = $('#eDate').val();
			
						
						var username = $scope.username
						var usrName = localStorage.getItem("login");
			
						var appKey = localStorage.getItem("appKey");

						var index = $("#picker").val();
					
						var dfrd = $q.defer();
						$http.get(APIBaseURL+"getUserAllEventdata?startdt="+sd+"&enddt="+ed+"&akey="+appKey+"&eventnames="+allEvents+"&userid="+username,  		  
							  {

							  }
						).then(function(response) {
								
						
							var events = response.data;
							var en;
							var ec;
							
							var result = JSON.stringify(events);
							
							var data =[];
							
							for(var i = 0; i<events.length; i++){
								
								var en = events[i].EventName;
								var ec = events[i].EventCount;
								
								var count = [];
								var count = [en,   ec]
								
								data.push(count);
								
							}
								
							function compare(a,b) {
							  if (a[1] < b[1])
								return 1;
							  if (a[1] >b[1])
								return -1;
							  return 0;
							} 
							
							data.sort(compare);
													
							var options = {
								"basic": {},
								"curved": {
									isCurved: true
								},
								"pinch": {
									bottomPinch: 1
								},
								"gradient": {
									fillType: "gradient"
								},
								"inverted": {
									isInverted: true
								},
								"hover": {
									hoverEffects: true
								},
								"dynamic": {
									dynamicArea: true
								},
								"label": {
									label: {
										fontSize: "16px"
									}
								},
								"color": {},
								"works": {
									isCurved: true,
									bottomPinch: 2,
									fillType: "gradient",
									hoverEffects: true,
									dynamicArea: true
								}
							};
							chart = new D3Funnel('#funnel');
							chart.draw(data, options[index]);

							
						}, function(response) {
								dfrd.reject(true);
						});
							return dfrd.promise;
					
			}// end of drwchart function 
			// ===================
			// END OF FUNNEL CHART
			// ===================
		
		
		
			
	
    
}]);

