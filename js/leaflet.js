/* note: - weather data and sunset/sunrise data is for CURRENT Time - which is not NZ current time */

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
        //error handling to check returned promise has processed correctly
        if (latLng.info.statuscode == 400) {
            let errorHtml = document.getElementById("title");
            errorHtml.innerHTML = "Sorry, we're currently experiencing technical issues :(<br>Please try again later..."
        } else {
            city.lat = latLng.results["0"].locations["0"].latLng.lat;
            city.lng = latLng.results["0"].locations["0"].latLng.lng;
            //push lat,lng and city name details to list
            list.push({city:city.city,lat:city.lat,lng:city.lng});
            //callback function to parse gps coords into updateMap function below
            updateMap(city.city,city.lat,city.lng)
        };
    };
    
    //udpate map view from geo coords
    var updateMap = function(city,lat,lng) {
        mymap.setView([lat,lng],15);        
        var title = document.getElementById("title");
        title.innerHTML = "Weather Information:  "+city;
        
        //get openweatermapapi data using ajax
        getWeather(lat,lng);

        //get sunrise/sunset data using fetch and cURL - response JSON
        fetch("php/sunriseSunset.php?key="+city+"&lat="+lat+"&lng="+lng)
        .then(response => response.json())
	    .then(json => showInfo(json));
    };

    //method to show sunrise / sunset information
    var showInfo = function(response) { 
        //error handling to check returned promise has processes correctly
        if (response.status == "INVALID_REQUEST") {
            let errorHtml = document.getElementById("sunrise");
            errorHtml.innerHTML = "Unable to contact sunrise/sunset api :(<br>Please try again later..."
        } else {      
        var sunrise = document.getElementById("sunrise");
        var sunset = document.getElementById("sunset");
        
        let srtime = response.results.sunrise;
        let sstime = response.results.sunset;

        //convert sunrise/sunset times to nzt using moment.js
        let srtime2 = moment.utc(srtime).local();
        let sstime2 = moment.utc(sstime).local();
        //update html table and format date time again using moment.js
        sunrise.innerHTML = srtime2.format("h:mm:ss a");
        sunset.innerHTML = sstime2.format("h:mm:ss a"); 
        };   
    };

    //method to get weather data using ajax function return data text xml doc
    var getWeather = function (lat,lng) {
        var url = "php/weather.php?lat="+lat+"&lng="+lng;
        ajaxRequest("GET", url, true, "", displayWeather);
    };

    //display weather information min tmep, max temp, icon etc
    var displayWeather = function (response) {
        var pic = document.getElementById("wimg");
        var minTemp = document.getElementById("minTemp");
        var maxTemp = document.getElementById("maxTemp");
        var weatherDesc = document.getElementById("description");      

        //parse text xml into DOMParser 
        let parser = new DOMParser();
        xmlDoc = parser.parseFromString(response,"text/xml");

        //now traverse xml dom tree to get required weather data
        let main = xmlDoc.getElementsByTagName("temperature")[0];
        let weather = xmlDoc.getElementsByTagName("weather")[0];              
        //console.log(xmlDoc);

        //set required attributes from xml dom tree
        let min = main.getAttribute('min');
        let max = main.getAttribute('max');
        let wdesc = weather.getAttribute('value');
        let iconurl = weather.getAttribute('icon');

        //covert from kelvin to celsius
        let minCels = (min - 273.15).toFixed(2); 
        let maxCels = (max - 273.15).toFixed(2);
                        
        //populate html elements with data
        minTemp.innerHTML = minCels;
        maxTemp.innerHTML = maxCels;
        weatherDesc.innerHTML = wdesc;
        //setting url for img src
        pic.src = 'http://openweathermap.org/img/w/'+iconurl+'.png';
       
        //call function to populate list
        recentSearches();
    };

    var recentSearches = function() {
        let searchElement = document.getElementById("recentList");

        //clear the list before populating
        if(searchElement == null)			
            return;
        while(searchElement.hasChildNodes()){
        searchElement.removeChild(searchElement.lastChild);			
        }

        //function to update map and weather details from recent list using data stored locally in list
        this.update = function(city1) {
            list.forEach(function(element) {
                if (element.city == city1.id) {
                    let lat1 = element.lat;
                    let lng2 = element.lng;
                    updateMap(city1.id,lat1,lng2);
                }
            });
        }

        //populate recentSearch html Table
        var html = "<table>";
        for(i=0;i<list.length;i++) {
            html += "<tr id="+this.list[i].city+" onclick=update("+this.list[i].city+")><td>"+list[i].city+"</td></tr>";            
        }
        html+="</table>"; 
        //update html recentList div with table of recentSearch data
        var recentList = document.getElementById("recentList")
        recentList.innerHTML = html;                 
    }        
}

