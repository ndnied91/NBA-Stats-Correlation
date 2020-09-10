<?php

	define("IN_CODE", 1);

	include "dbconfigProject.php";

	# Open a Connection to the MySQL Server
	$con = mysqli_connect($server, $username, $password, $dbname);

	#check connection
	if(!$con){
		die("Connection failed: <br>" . mysqli_conncet_errors());
	}

	$sql = " select * from correlation;";

	$result = $con->query($sql);

	$msg = array();
	$corval = array();
	$orgT = array();
	$normT = array();

	#fetch the data from the database
	$row = $result->num_rows;
	$followers = array();
	$points = array();
	$assists = array();
	$rebounds = array();
	$overall = array();

	$normFol = array();
	$normPoi = array();

	while($row = $result->fetch_assoc()){
	
		$followers[] = $row['follower_count'];
		$points[] = $row['points'];
		$assists[] = $row['assists'];
		$rebounds[] = $row['rebounds'];
	}
	
	//$orgT = array_merge($followers, $points);

	for($i=0;$i<sizeof($points);$i++){
		$overall[] = $points[$i] + $assists[$i] + $rebounds[$i];
	}

	$orgT = array_merge($followers,$overall);

	for($i=0;$i<sizeof($followers);$i++){
		$normFol[] = ($followers[$i]-min($followers))/(max($followers)-min($followers));
		//$normPoi[] = ($points[$i]-min($points))/(max($points)-min($points));
		$normPoi[] = ($overall[$i]-min($overall))/(max($overall)-min($overall));
	}

		$normT = array_merge($normFol, $normPoi);
		$corr = corr($normFol, $normPoi);
		$corval[] = $corr;

		function corr($followers, $points){

			$length= count($followers);
			$mean1=array_sum($followers) / $length;
			$mean2=array_sum($points) / $length;

			$a=0;
			$b=0;
			$axb=0;
			$a2=0;
			$b2=0;

			for($i=0;$i<$length;$i++)
			{
			$a=$followers[$i]-$mean1;
			$b=$points[$i]-$mean2;
			$axb=$axb+($a*$b);
			$a2=$a2+ pow($a,2);
			$b2=$b2+ pow($b,2);
			}

			$corr= $axb / sqrt($a2*$b2);

			return $corr*2;
		}

		//$msg = $corval + $orgT + $normT;

		$msg = array_merge($corval,$orgT,$normT);

	mysqli_close($con);

	echo json_encode($msg);

	?>