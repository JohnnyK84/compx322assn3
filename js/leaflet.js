//initialise map
var mymap = L.map('leafletMap').setView([-37.7876, 175.281], 13);
var list = []; //list property to store lat/lng and city name 

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamtueiIsImEiOiJjanZrcHh4dGQwdHI5NDNxbGdycmdudTlmIn0.59DzACDwEhznc2wR44m4hQ', 
{ maxZoom: 18, attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', 
id: 'mapbox.streets' 
}).addTo(mymap);

//function to get geo coords from user input (City Name)
function getGeocode(){

	var cityInput = document.getElementById("city").value;
    
    //object for city and lat/lng coords
	var city = {
		city : cityInput,
        lat :   0,
        lng :   0,
		}

    fetch("http://www.mapquestapi.com/geocoding/v1/address?key=pWuhUoVNcKwGGZdK5G1HyIbvArOc1Cxf&location="+cityInput+",NZ")
    .then(response => response.json())
	.then(json => initMap(json));

    var initMap = function (latLng) {
        city.lat = latLng.results["0"].locations["0"].latLng.lat;
        city.lng = latLng.results["0"].locations["0"].latLng.lng;
        //callback function to parse gps coords into updateMap function below
        updateMap(city.city,city.lat,city.lng)
    };
    
    //udpate map view from geo coords and push lat,lng and city name details to list
    var updateMap = function(city,lat,lng) {
        mymap.setView([lat,lng],15);
        list.push({lat,lng,city});
        console.log(list);
        
        fetch("php/sunriseSunset.php?key="+city+"&lat="+lat+"&lng="+lng)
        .then(response => response.json())
	    .then(json => showInfo(json));
    };

    //method to show sunrise / sunset information
    var showInfo = function(response) {
        var title = document.getElementById("title");
        var sunrise = document.getElementById("sunrise");
        var sunset = document.getElementById("sunset");
        console.log(response.results);
        
        //conSunrise = Date.parse(response.results.sunrise);
        var sunRtime = response.results.sunrise;
        console.log(sunRtime);
        title.innerHTML = "Weather Information:  "+city.city;
        sunrise.innerHTML = response.results.sunrise;
        sunset.innerHTML = response.results.sunset;
        getWeather();
    };

    //method to get weather data using ajax function
    var getWeather = function () {
        var url = "php/weather.php?lat="+city.lat+"&lng="+city.lng;
        ajaxRequest("GET", url, true, "", displayWeather);
    };

    //display weather information min tmep, max temp, icon etc
    var displayWeather = function (response) {
        var minTemp = document.getElementById("minTemp");
        var maxTemp = document.getElementById("maxTemp");
        var weatherDesc = document.getElementById("description");
        var pic = document.getElementById("wimg");

        let parser = new DOMParser();
        xmlDoc = parser.parseFromString(response,"text/xml");

        let main = xmlDoc.getElementsByTagName("temperature")[0];
        let weather = xmlDoc.getElementsByTagName("weather")[0];
        
        
        console.log(xmlDoc);

        let min = main.getAttribute('min');
        let max = main.getAttribute('max');
        let wdesc = weather.getAttribute('value');
        let weathericon = weather.getAttribute('icon');

        //covert from kelvin to celsius
        let minCels = (min - 273.15).toFixed(2); 
        let maxCels = (max - 273.15).toFixed(2);
        
        //populate html elements with data
        pic.src = 'http://openweathermap.org/img/w/'+weathericon+'.png';
        minTemp.innerHTML = minCels;
        maxTemp.innerHTML = maxCels;
        weatherDesc.innerHTML = wdesc;
        //setting url for weather icon
        
    };
}

