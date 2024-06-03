const apiKey = '719c2dfe147062ea694d78525a1c7e25';
const searchBtn = document.getElementById('search-btn');


function getLatLon() {
    const userInput = document.getElementById('city-search');
    const citySearched = userInput.value;

    const geoApi = `http://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&limit=1&appid=${apiKey}`;

    fetch(geoApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        getCurrentWeather(data);
        getForecast(data);
    })
    .catch(function(error) {
        console.log('Error');
    })
}

function getCurrentWeather(data) {
    const currentDate = dayjs();
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}`;
    
    fetch(weatherApi) 
    .then(function(response) {
        return response.json();
    })
    .then(function(weather) {
        console.log(weather);
    })
    .catch(function(error) {
        console.log('Error');
    })
}

function getForecast(data) {
    const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&cnt=5&appid=${apiKey}`;

    fetch(forecastApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(forecast) {
        console.log(forecast);
    })
    .catch(function(error) {
        console.log('Error');
    })
}


searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    getLatLon();
})