
//API key
var apiKey = "4abcc260a6bc7b01032a4489ed2ccdad";

//current weather  object
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
//arrays
var forecast = [];
var searchHistory = [];

//querySelectors to reference
var curUvEl = document.querySelector("#uv");
var searchInputEl = document.querySelector("#searchCity");
var formEl = document.querySelector("#searchFourm");
var historyEl = document.querySelector("#history");
var cityNameEl = document.querySelector("#name");
var curDateEl = document.querySelector("#date");
var curIconEl = document.querySelector("#icon");
var curTempEl = document.querySelector("#temp");
var curHumidityEl = document.querySelector("#humidity");
var curWindEl = document.querySelector("#wind");
var clearBtnEl = document.querySelector("#clearHistory");
var uvAlertEl = document.querySelector("#uvAlert");
var forecastEl = document.querySelector("#forecastBody");
var resultsContEl = document.querySelector("#resultsContainer");
var forecastContEl = document.querySelector("#forecastContainer");
var curStatsEl = document.querySelector("#currentStats");


//function tfor API CALL
var getWeather = (city) => {

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
                            //console.log(uvData);
                            currentWeather.uv = uvData.value;
                            displayWeather();
                            findForecast(city);
                        });
                    }
                    else {
                        curUvEl.innerHTML = "Error";
                        currentWeather.uv = "error";
                    }
                    
                });

            });
        } else {
            clearData();
            cityNameEl.innerHTML = "Error: " + response.status + " " + city + " " + response.statusText;
        }
    })
    .catch (function(error) {
        cityNameEl.innerHTML = error.message + " Please try again later.";
    })
}

//gcity user searched for & makes an api call to get 5day forecast

var findForecast = (city) => {

    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
    fetch(forecastUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //console.log(data);

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
      //console.log(findForecast);
}

//function gets data from  forecast array and creates specific  cards for each day
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

var displayWeather = () => {
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

//searchHistory array 
var displayHistory = () => {
  
    historyEl.innerHTML = "";
    for (var i = 0; i<searchHistory.length; i++) {
        var historyDiv = document.createElement("div");
        historyDiv.classList.add("history-item");
        historyDiv.innerHTML = "<h4>"+searchHistory[i]+"</h4>";
        historyEl.appendChild(historyDiv);
    }
}

//load search history from localStorage 
var loadHistory = () => {
    searchHistory = JSON.parse(localStorage.getItem("history"));
    if (!searchHistory) {
        searchHistory = [];
    }
    displayHistory();
     //console.log(loadHistory");
}

var formSubmitHandler = (event) => {

    event.preventDefault();
    var searchCity = searchInputEl.value.trim();
    if (searchCity) {
        getWeather(searchCity);
        searchHistory.push(searchCity);
        localStorage.removeItem("history");
        localStorage.setItem("history", JSON.stringify(searchHistory));
        clearForecast();
        displayHistory();
        searchInputEl.value = "";
    }
    else {
        return;
    }
}

// display alert next to the UV index data and color code it.
var uvCheck = () => {
    if (currentWeather.uv === "error") {
        return;
    }

    if (currentWeather.uv < 3) {
        currentWeather.uvAlert = "low";
        uvAlertEl.textContent = "low";
        uvAlertEl.classList.add("alert-success");
        return;
    }
    else if (currentWeather.uv < 6) {
        currentWeather.uvAlert = "moderate";
        uvAlertEl.textContent = "moderate";
        uvAlertEl.classList.add("alert-warning");
        return;
    }
    else if (currentWeather.uv < 8) {
        currentWeather.uvAlert = "high";
        uvAlertEl.textContent = "high";
        uvAlertEl.classList.add("alert-danger");
        return;
    }
    else if (currentWeather.uv < 11) {
        currentWeather.uvAlert = "very high";
        uvAlertEl.textContent = "very high";
        uvAlertEl.classList.add("alert-danger");
        return;
    }
    else {
        currentWeather.uvAlert = "extreme";
        uvAlertEl.textContent = "extreme";
        uvAlertEl.classList.add("alert-danger");
    }
}

//function for clear history button
var clearHistory = () => {
    localStorage.removeItem("history");
    searchHistory = [];
    displayHistory();
}

//clears the forecast data from page
var clearForecast = () => {
    forecast = [];
    forecastEl.innerHTML = "";
}

//function for user to click on a city in history
var historyClickHandler = (event) => {
    var histCity = event.target.textContent;
    if (histCity) {
        clearForecast();
        getWeather(histCity);
    }
}
// funtion to clear date
var clearData = () => {
    curStatsEl.style.display = "none";
    forecastContEl.style.display = "none";
    curDateEl.innerHTML = "";
    curIconEl.innerHTML = "";
    console.log(clearData)
}


loadHistory();

formEl.addEventListener("submit", formSubmitHandler);
clearBtnEl.addEventListener("click", clearHistory);
historyEl.addEventListener("click", historyClickHandler);