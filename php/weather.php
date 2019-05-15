<?php
    $lat = $_GET["lat"];
    $lng = $_GET["lng"];
    $key = "1a7002ce4f09d21794aebec0cd1aa58d";
    //need to round lat/lng coords for api input
    round($lat);
    round($lng);

    //set api url with necessary parameters
    $url = "api.openweathermap.org/data/2.5/weather?mode=xml&APPID=".$key."&lat=".$lat."&lon=".$lng;

    //init cURL parse in url and execute
    $process = curl_init($url);

    curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
    $return = curl_exec($process);

    //echo response data back to javascript as xml
    echo $return;

    curl_close($process);
?>