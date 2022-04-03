var apiKey = "4abcc260a6bc7b01032a4489ed2ccdad";

//store weather variables in object
var currentWeather = {
    name: "",
    date: "",
    temp: "",
    humidity: "",
    wind: "",
    uv: "",
    uvAlert: "",
    icon: ""
}

//array
var forecast = [];
//array
var searchHistory = [];

//querySelectors to reference in the sccript.
var cityNameEl = document.querySelector("#name");
var curDateEl = document.querySelector("#date");
var curIconEl = document.querySelector("#icon");
var curTempEl = document.querySelector("#temp");
var curHumidityEl = document.querySelector("#humidity");
var curWindEl = document.querySelector("#wind");
var curUvEl = document.querySelector("#uv");
var searchInputEl = document.querySelector("#search-city");
var formEl = document.querySelector("#search-form");
var historyEl = document.querySelector("#history");
var clearBtnEl = document.querySelector("#clear-history");
var uvAlertEl = document.querySelector("#uv-alert");
var forecastEl = document.querySelector("#forecast-body");
var resultsContEl = document.querySelector("#results-container");
var forecastContEl = document.querySelector("#forecast-container");
var curStatsEl = document.querySelector("#current-stats");

// fatch api
var getWeather =  (city) => {

    var getWeather = function (city){

        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=" + apiKey;
        var lat = "";
        var lon = "";
        fetch(apiUrl).then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    //console.log(data);
                    currentWeather.name = data.name;
                    currentWeather.date = moment().format("dddd, MMMM Do YYYY");
                    currentWeather.temp = data.main.temp + " &#176F";
                    currentWeather.humidity = data.main.humidity+"%";
                    currentWeather.wind = data.wind.speed + " MPH";
                    currentWeather.icon = data.weather[0].icon;
                    lat = data.coord.lat;
                    lon = data.coord.lon;
    
                    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat="+lat+"&lon="+lon;
                    fetch(uvUrl)
                    .then(function(uvResponse) {
                        if (uvResponse.ok) {
                            uvResponse.json().then(function(uvData) {
                                currentWeather.uv = uvData.value;
                                displayWeather();
                                getForecast(city);
                            });
                        }
                        else {
                            curUvEl.innerHTML = "Error";
                            currentWeather.uv = "Error";
                        }
                        
                    });
    
                });
            } else {
                //catch error
                clearData();
                cityNameEl.innerHTML = "Error: " + response.status + " " + city + " " + response.statusText;
    
    
            }
        })
        .catch (function(error) {
            cityNameEl.innerHTML = error.message + " Try again later.";
        })
    }

}



var getForecast = function () {

}


var displayForecast = function () {


}

var displayWeather = function() {


}


var displayHistory = function() {

}


var loadHistory = function() {

}

var formSubmitHandle = () => {

}

var clearHistory = function() {
}


var historyClickHandler = function (event) {

}