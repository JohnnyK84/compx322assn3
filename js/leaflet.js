//initialise map
var mymap = L.map('leafletMap').setView([-37.7876, 175.281], 13);
var list = []; //list property to store lat/lng and city name 

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamtueiIsImEiOiJjanZrcHh4dGQwdHI5NDNxbGdycmdudTlmIn0.59DzACDwEhznc2wR44m4hQ', 
{ maxZoom: 18, attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', 
id: 'mapbox.streets' 
}).addTo(mymap);


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
        
        fetch("../php/sunriseSunset.php?key="+city+"&lat="+lat+"&lng"+lng)
        .then(response => showInfo(response));        
    }
    //method to show sunrise / sunset information
    var showInfo = function(response) {
        var element = document.getElementById("cityInfo");
        console.log(response);
        element.innerHTML = response;
    };

}