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

var getForecast = (city) =>  {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
    fetch(forecastUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
console.log(data);

                var today = moment().format("YYYY-MM-DD");
                for (var i=0; i<data.list.length; i++){
                    var dateTime = data.list[i].dt_txt.split(' ');

                    if (dateTime[0] !== today && dateTime[1] === "12:00:00" ) {
                        var futureDate = {
                            date: moment(dateTime[0]).format("MM/DD/YYYY"),
                            time: dateTime[1],
                            icon: data.list[i].weather[0].icon,
                            temp: data.list[i].main.temp,
                            humidity: data.list[i].main.humidity
                        };
                        forecast.push(futureDate);
                    }
                }
                displayForecast();
            })
        }
        else {
            forecastEl.innerHTML = "Error: " + response.status + " " + response.statusText;
        }
    })
    .catch (function(error) {
        forecastEl.innerHTML = error.message;
    })
}



var displayForecast =  () => {
    for (var i=0; i<forecast.length; i++) {
        var cardContainerEl = document.createElement("div");
        cardContainerEl.classList.add("col-xl");
        cardContainerEl.classList.add("col-md-4");

        var cardEl = document.createElement("div");
        cardEl.classList.add("card");
        cardEl.classList.add("forecast-card");

        var cardBodyEl = document.createElement("div");
        cardBodyEl.classList.add("card-body");

        var dateEl = document.createElement("h5");
        dateEl.classList.add("card-title");
        dateEl.innerHTML = forecast[i].date;
        cardBodyEl.appendChild(dateEl);

        var iconEl = document.createElement("p");
        iconEl.classList.add("card-text");
        iconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + forecast[i].icon + "@2x.png'></img>";
        cardBodyEl.appendChild(iconEl);

        var tempEl = document.createElement("p");
        tempEl.classList.add("card-text");
        tempEl.innerHTML = "Temp: " + forecast[i].temp;
        cardBodyEl.appendChild(tempEl);

        var humidityEl = document.createElement("p");
        humidityEl.classList.add("card-text");
        humidityEl.innerHTML = "Humidity: " + forecast[i].humidity
        cardBodyEl.appendChild(humidityEl);

        cardEl.appendChild(cardBodyEl);
        cardContainerEl.appendChild(cardEl);
        forecastEl.appendChild(cardContainerEl);

    }


}
// display current weather information collectied by api
var displayWeather = () => {

    var displayWeather = function() {
        curStatsEl.style.display = "block";
        forecastContEl.style.display = "block";
        cityNameEl.innerHTML = currentWeather.name;
        curDateEl.innerHTML = currentWeather.date;
        curTempEl.innerHTML = currentWeather.temp;
        curHumidityEl.innerHTML = currentWeather.humidity;
        curWindEl.innerHTML = currentWeather.wind;
        curUvEl.innerHTML = currentWeather.uv;
        curIconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png'></img>";
        uvCheck();
    
    }

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