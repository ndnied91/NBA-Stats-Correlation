<?php

	define("IN_CODE", 1);

	include "dbconfigProject.php";

	# Open a Connection to the MySQL Server
	$con = mysqli_connect($server, $username, $password, $dbname);

	#check connection
	if(!$con){
		die("Connection failed: <br>" . mysqli_conncet_errors());
	}

	$sql = " select * from twitter_data;";

	$result = $con->query($sql);

	$msg = array();

	#fetch the data from the database
	$row = $result->num_rows;

	while($row = $result->fetch_assoc()){
	
		$msg[] = $row;
	}

	mysqli_close($con);

	echo json_encode($msg);

	?>