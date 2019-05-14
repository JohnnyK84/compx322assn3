<?php

    //$apikey = $_GET["key"];
    $lat = $_GET["lat"];
    $lng =$_GET["lng"];
    //$city =$_GET["city"];

    $url = "https://api.sunrise-sunset.org/json?lat=".$lat."&lng=".$lng;

    echo "test";

    $process = curl_init($url);

    curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
    $return = curl_exec($process);

    echo $return;

    curl_close($process);
?>