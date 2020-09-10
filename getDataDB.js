	
	var dTable = new Object();
	
	google.charts.load('current', {'packages':['table']});
	google.charts.load('current', {'packages':['corechart']});

	function loadTwitterData(){
		var msg = [];
		$.ajax({
			type: "POST",
			url: "getTwitterData.php",
			dataType:'json',
			success: function(msg){
				//console.log(msg);
				drawTwitterDataTable(msg);
			},

		error: function(xhr, textStatus, errorThrown) {
			console.log(xhr.status);
			console.log(errorThrown);
		}
		
		});
	}

	function loadNbaData(){
		var msg = [];
		$.ajax({
			type: "POST",
			url: "getNbaData.php",
			dataType:'json',
			success: function(msg){
				//console.log(msg);
				//checkUser(msg);
				drawNbaDataTable(msg);
			},

		error: function(xhr, textStatus, errorThrown) {
			console.log(xhr.status);
			console.log(errorThrown);
		}
		});
	
	}

	function loadCorrelation(){
		var msg = [];
		$.ajax({
			type:'POST',
			url:'getCorrelationData.php',
			dataType:'json',
			success: function(msg){
				//console.log(msg);
				getCorrelation(msg);
			},
			error: function(xhr, textStatus, errorThrown){
				console.log(xhr.status);
				console.log(errorThrown);
			}
		});
	}


	function drawNbaDataTable(table) {

		dTable = table;

		  var data = new google.visualization.DataTable();
			data.addColumn('number', 'points');
		    data.addColumn('number', 'assists');
		    data.addColumn('number', 'rebounds');
		    data.addColumn('number', 'minutes');
		    data.addColumn('string', 'date');
	       

	        var tableSize = table.length;

	       	for(var i=0; i<tableSize; i++){

     	        var input = table[i];

		        var points = parseFloat(input.points);
	            var assists = parseFloat(input.assists);
	            var rebounds = parseFloat(input.rebounds);
	            var minutes = parseFloat(input.minutes);
	            var date = input.date;

	           data.addRow([points, assists, rebounds, minutes, date]);

		    }


		   	var options = {
		    	allowHTML:true,
		        showRowNumber: true,
		        width: '50%',
		        page: 'enabled',
		        pageSize: 14,
	            chartArea: {
	                width: '100%'
	            }
	        }

	    				document.getElementById("origTable").innerHTML = "";
				document.getElementById("normTable").innerHTML = "";
        var table = new google.visualization.Table(document.getElementById('tableDisplay'));

        table.draw(data, options);

        correlationChart(dTable);

	}


	function drawTwitterDataTable(table) {

		dTable = table;

		  var data = new google.visualization.DataTable();
			data.addColumn('number', 'tweet_count');
		    data.addColumn('number', 'follower_count');
		    data.addColumn('string', 'date');

	        var tableSize = table.length;

	       	for(var i=0; i<tableSize; i++){

     	        var input = table[i];
		        var tweet_count = parseInt(input.tweet_count);
		        var follower_count = parseInt(input.follower_count);
	            var date = input.date;

	           data.addRow([tweet_count, follower_count, date]);

		    }

		   	var options = {
		    	allowHTML:true,
		        showRowNumber: true,
		        width: '50%',
		        page: 'enabled',
		        pageSize: 14,
	            chartArea: {
	                width: '100%'
	            }
	        }

	        				document.getElementById("origTable").innerHTML = "";
				document.getElementById("normTable").innerHTML = "";
		
        var table = new google.visualization.Table(document.getElementById('tableDisplay'));

        table.draw(data, options);

        correlationChart(dTable);

	}


				function correlationChart(dTable){
				
				//check if data is twitter or nba by checking if object has property of points, true = nba, false = twitter
				var check = dTable[0];
				var check1 = check.hasOwnProperty("points");

				if(check1 == false){

					var data = new google.visualization.DataTable();
					data.addColumn('string', 'date');
					data.addColumn('number', 'follower_count');
					data.addColumn('number', 'tweet_count');


					var followerSize = dTable.length;

					for(var i=0;i<followerSize;i++){
						var input = dTable[i];
							var tweets = parseFloat(input.tweet_count);
			        		var followers = parseFloat(input.follower_count);
			        		var date = input.date;
							data.addRow([date,followers,tweets]);

					}

				}else{

					var data = new google.visualization.DataTable();
					data.addColumn('string', 'date');
					data.addColumn('number', 'points');
					data.addColumn('number', 'minutes');
					data.addColumn('number', 'assists');
					data.addColumn('number', 'rebounds');
					data.addColumn('number', 'overall (points, assists, and rebounds)');


					var nbaSize = dTable.length;

					for(var i=0;i<nbaSize;i++){
						var input = dTable[i];
							var points = parseFloat(input.points);
			        		var minutes = parseFloat(input.minutes);
			        		var date = input.date;
			        		var assists = parseFloat(input.assists);
			        		var rebounds = parseFloat(input.rebounds);
			        		var overall = points + assists + rebounds;
							data.addRow([date,points,minutes, assists, rebounds, overall]);

					}
				}

				if(check1 == false){

			
				var options ={
					title: "Correlation between Total Tweet Mentions and Twitter Followers",
					width:800,
					height:500,
					interpolateNulls: true,
					series: {
						0 : { color: '#e2431e'},
						1 : { color: '#6f9654'},

					}
				};

				}else{
					var options ={
					title: "Correlation between Minutes Played, Points, Assists, and Rebounds",
					width:1000,
					height:500,
					interpolateNulls: true,
					series: {
						0 : { color: '#e2431e'},
						1 : { color: '#6f9654'},
						2 : { color: '#1B57E0'},
						3 : { color: '#EF981B'},
						4 : { color: '#000000'},
					}
				};
				}

								document.getElementById("origTable").innerHTML = "";
				document.getElementById("normTable").innerHTML = "";

				var chart = new google.visualization.LineChart(document.getElementById('correlation'));

				chart.draw(data, options);


			}


			function getCorrelation(table){

				var corrValue = table[0];

				if(corrValue < (-0.5)){
					var statement = "the Hypothesis is rejected.";
				}else if(corrValue > 0.5){
					var statement = "the Hypothesis is supported.";
				}else{
					var statement = "we can't tell if the hypothesis was proven wrong or was supported.";
				}

				var oFollowers = [];
				var oPoints = [];
				var nFollowers =[];
				var nPoints =[];
				var tableSize = table.length;
				var tSizeHalf = Math.floor((tableSize/2)+1);
				var nFollowers;
				var nPoints;

				start =0;
				start1= 0;
				for(var i=1;i<tableSize/2;i++){
					if(i<(tableSize/2)/2){
						var orgFollowers=parseFloat(table[i]);
						oFollowers[start] = orgFollowers;
						start++;
					}else{
						var orgPoints = table[i];
						oPoints[start1] = orgPoints;
						start1++;
					}
				}

				start =0;
				start1 =0
				for(var j=tSizeHalf;j<tableSize;j++){
					if(j<tableSize*0.75){
						var normFollowers = table[j];
						nFollowers[start] = normFollowers;
						start++;
					}else{
						var normPoints = table[j];
						nPoints[start1] = normPoints;
						start1++;
					}
				}
				

				otherCalculations(oFollowers);

				// FOR NORMALIZED TABLE AND VALUES

				var data = new google.visualization.DataTable();
				data.addColumn('number', 'Followers');
			    data.addColumn('number', 'Overall Contribution');

			    for(var x=0;x<nFollowers.length;x++){

			    	var followers = nFollowers[x];
			    	var points = nPoints[x];

					data.addRow([followers, points]);

				}
			    

			   	var options = {
			    	allowHTML:true,
			        width: '100%',
			        page: 'enabled',
			        pageSize: 14,
		            chartArea: {
		                width: '100%'
		            }
		        }

				document.getElementById("tableDisplay").innerHTML = "";
				document.getElementById("correlation").innerHTML = "";
	        var table = new google.visualization.Table(document.getElementById('normTable'));

	        table.draw(data, options);

	        //FOR ORIGNAL TABLE AND VALUES

	        var data1 = new google.visualization.DataTable();
				data1.addColumn('number', 'Followers');
			    data1.addColumn('number', 'Overall Contribution');

			    for(var x=0;x<oFollowers.length;x++){

			    	var followers = parseFloat(oFollowers[x]);
			    	var points = parseFloat(oPoints[x]);

					data1.addRow([followers, points]);

				}
			    

			   	var options1 = {
			    	allowHTML:true,
			        width: '100%',
			        page: 'enabled',
			        pageSize: 14,
		            chartArea: {
		                width: '100%'
		            }
		        }

				document.getElementById("tableDisplay").innerHTML = "";
				document.getElementById("correlation").innerHTML = "";
	        var table1 = new google.visualization.Table(document.getElementById('origTable'));

	        table1.draw(data1, options1);

			document.getElementById("corr").innerHTML = "Correlation between Twitter Followers and Overall Game Contribution (Points, Assists, Rebounds) is: <b>" +corrValue+"</b> With the given correlation between the 2 dataset <b>" + statement + "</b><br><br>";

			//console.log(dTable);

			var data2 = new google.visualization.DataTable();
				data2.addColumn('string', 'date');
				data2.addColumn('number', 'Followers');
			    data2.addColumn('number', 'Overall Contribution');

			    for(var x=0;x<nFollowers.length;x++){
					var input = dTable[x];
	        		var date = input.date;
			    	var followers = parseFloat(nFollowers[x]);
			    	var points = parseFloat(nPoints[x]);

					data2.addRow([date, followers, points]);

				}
			    

				var options ={
					title: "Correlation between Twitter Followers and Overall Player Contribution (normalized)",
					width:1000,
					height:500,
					interpolateNulls: true,
					series: {
						0 : { color: '#e2431e'},
						1 : { color: '#6f9654'},
					}
				};

				document.getElementById("tableDisplay").innerHTML = "";
	        var table = new google.visualization.LineChart(document.getElementById('correlation'));

	        table.draw(data2, options);
			}

			// Thanks to DerickBailey for the code to find the standard devaiation of an array
			function otherCalculations(followers, overall){
				var avg = average(followers);

				  var squareDiffs = followers.map(function(value){
				    var diff = value - avg;
				    var sqrDiff = diff * diff;
				    return sqrDiff;
				  });
				  
				  var avgSquareDiff = average(squareDiffs);

				  var stdDev = Math.sqrt(avgSquareDiff);

				  zScore = (followers[8] - avg)/ stdDev; 
				  document.getElementById('zscore').innerHTML = "Sample <b>" + followers[8] + " followers </b> falls <b>" + zScore + "</b> standard devaiation below the mean. The percentage of samples that fall below the sample is: <b>0.5359</b>";

				}

				function average(data){
				  var sum = data.reduce(function(sum, value){
				    return sum + value;
				  }, 0);
				  var avg = sum / data.length;
				  return avg;
				}


			function clearScreen(){
				document.getElementById("corr").innerHTML = "";
				document.getElementById("tableDisplay").innerHTML = "";
				document.getElementById("correlation").innerHTML = "";
				document.getElementById("origTable").innerHTML = "";
				document.getElementById("normTable").innerHTML = "";
				document.getElementById("zscore").innerHTML = "";
			}