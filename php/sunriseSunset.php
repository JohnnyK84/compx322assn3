<?php
    //get lat+lng data and input into api url
    $lat = $_GET["lat"];
    $lng = $_GET["lng"];
    //$city =$_GET["city"];

    $url = "https://api.sunrise-sunset.org/json?lat=".$lat."&lng=".$lng;

    //init cURL parse in url and execute
    $process = curl_init($url);

    curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
    $return = curl_exec($process);

    //echo response data back to java script
    echo $return;

    curl_close($process);
?>