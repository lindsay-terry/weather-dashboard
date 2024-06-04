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
        // getForecast(data);
    })
    .catch(function(error) {
        console.log('Error');
    })
}

function getCurrentWeather(data) {
    const currentDate = dayjs();
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=imperial`;
    
    fetch(weatherApi) 
    .then(function(response) {
        return response.json();
    })
    .then(function(weather) {
        // console.log(weather);
        displayCurrentWeather(weather);
    })
    .catch(function(error) {
        console.log('Error');
    })
}

// function getForecast(data) {
//     const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&cnt=5&appid=${apiKey}&units=imperial`;

//     fetch(forecastApi)
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(forecast) {
//         console.log(forecast);
//     })
//     .catch(function(error) {
//         console.log('Error');
//     })
// }

function displayCurrentWeather(weather) {
    const currentWeather = document.getElementById('current-weather');
    currentWeather.innerHTML = '';

    //border around current weather for user-entered city
    currentWeather.setAttribute('class', 'border border-dark p-2 m-2');
    const currentWeatherDiv = document.createElement('div');
    const nameRow = document.createElement('div');

    const currentCity = document.createElement('h3');
    const weatherIcon = document.createElement('img');
    const currentStats = document.createElement('div');

    const tempP = document.createElement('p');
    const windP = document.createElement('p');
    const humidityP = document.createElement('p');

    nameRow.setAttribute('class', 'd-flex align-middle');
    currentCity.textContent = `${weather.name} (${dayjs().format('M/D/YYYY')})`;
    currentCity.setAttribute('class', 'my-2');
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)
    weatherIcon.setAttribute('alt', `${weather.weather[0].main} weather icon`);
    weatherIcon.setAttribute('style', 'height: 50px;');

    tempP.textContent = `Temp: ${weather.main.temp} \u00B0F`;
    windP.textContent = `Wind: ${weather.wind.speed} MPH`;
    humidityP.textContent = `Humidity: ${weather.main.humidity}%`;

    currentWeatherDiv.appendChild(nameRow);
    nameRow.appendChild(currentCity);
    nameRow.appendChild(weatherIcon);
    currentWeatherDiv.appendChild(currentStats);

    currentStats.appendChild(tempP);
    currentStats.appendChild(windP);
    currentStats.appendChild(humidityP);
    currentWeather.appendChild(currentWeatherDiv);

}


searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    getLatLon();
})