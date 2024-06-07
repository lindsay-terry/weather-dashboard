const apiKey = '719c2dfe147062ea694d78525a1c7e25';
const searchBtn = document.getElementById('search-btn');
const searchedCities = document.getElementById('searched-cities');

//local storage functions
let savedCities = JSON.parse(localStorage.getItem('savedCities')) ||[];

function readCityStorage() {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) ||[];
    return savedCities;
}

function saveCityStorage() {
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
}

//fetch functions:
function getLatLon(searchAgain) {
    const userInput = document.getElementById('city-search');
    let citySearched;
   //Check to see if data from the button is being passed in or using user input
    if (!searchAgain) {
        citySearched = userInput.value;
    } else {
        citySearched = searchAgain;
    }
    
    //GeoApi to get coordinates based on searched city
    const geoApi = `https://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&limit=1&appid=${apiKey}`;

    fetch(geoApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //passes result into fetch requests to get current weather and forecast
        getCurrentWeather(data);
        getForecast(data);
        userInput.value = '';
    })
    .catch(function(error) {
        console.log('Error');
    })
}

//fetch request using latitude and longitude to pass into current weather api
function getCurrentWeather(data) {
    readCityStorage();
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=imperial`;
    
    fetch(weatherApi) 
    .then(function(response) {
        return response.json();
    })
    .then(function(weather) {
        displayCurrentWeather(weather);
        //checks to see if city exists in previously searched citites
        //to avoid having duplicates in list
        if (!savedCities.includes(weather.name)) {
            savedCities.push(weather.name);
        }
        saveCityStorage(savedCities);
        //displays saved cities buttons
        displaySavedCities();
        
    })
    .catch(function(error) {
        console.log('Error');
    })
}

//fetch request using latitude and longitude to pass into forecast api
function getForecast(data) {
    const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=imperial`;

    fetch(forecastApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(forecast) {
        displayForecast(forecast);
    })
    .catch(function(error) {
        console.log('Error');
    })
}

//function to display 5 day forecast
function displayForecast(forecast) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    //Set up container and header for 5 day forecasts to render
    const fiveDayHeader = document.createElement('h4');
    const fiveDayDiv = document.createElement('div');
    
    fiveDayHeader.textContent = "5 Day Forecast:";
    fiveDayDiv.setAttribute('class', 'd-flex flex-wrap m-2 p2 justify-content-evenly');

    forecastDiv.appendChild(fiveDayHeader);
    forecastDiv.appendChild(fiveDayDiv);

    //Find first midday index in results from fetch
    let midday; 
    for (i = 0; i < 8; i++) {
        let hour = (dayjs(forecast.list[i].dt_txt).add(forecast.city.timezone, 'second')).format('HH');
        if (hour >= 12 && hour <=14) {midday = i;}
    }

    //find all midday indexes 
    for (i =0; i <5; i++) {
        let index = i * 8 + midday;
        let date = (dayjs(forecast.list[index].dt_txt).add(forecast.city.timezone, 'second')).format('MM/DD/YYYY');
    
    //create and render cards for 5 day forecast using each index pulled from loop to find midday hours
        const forecastCard = document.createElement('div');
        const dateHeader = document.createElement('h5');
        const icon = document.createElement('img');
        const temp = document.createElement('p');
        const wind = document.createElement('p');
        const humidity = document.createElement('p');

        forecastCard.setAttribute('class', 'card mx-4 p-3 custom-card');
        
        icon.setAttribute('src', `https://openweathermap.org/img/wn/${forecast.list[index].weather[0].icon}@2x.png`)
        icon.setAttribute('alt', `${forecast.list[index].weather[0].description} weather icon`);
        icon.setAttribute('style', 'height: 50px; width: 50px;');

        dateHeader.textContent = dayjs(forecast.list[index].dt_txt).format('MM/DD/YYYY');
        temp.textContent = `Temp: ${forecast.list[index].main.temp}\u00B0F`;
        wind.textContent = `Wind: ${forecast.list[index].wind.speed} MPH`;
        humidity.textContent = `Humidity: ${forecast.list[index].main.humidity}%`;

        forecastCard.appendChild(dateHeader);
        forecastCard.appendChild(icon);
        forecastCard.appendChild(temp);
        forecastCard.appendChild(wind);
        forecastCard.appendChild(humidity);
        
        fiveDayDiv.appendChild(forecastCard);
    }
}

//Creates a div to store current weather information and displays all current
//weather information for searched city
function displayCurrentWeather(weather) {
    const currentWeather = document.getElementById('current-weather');
    currentWeather.innerHTML = '';

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

//Display a list of citites previously searched as buttons
function displaySavedCities() {
    const searchedList = document.getElementById('searched-cities');
    searchedList.innerHTML = '';
    readCityStorage();
    for (let i = 0; i < savedCities.length; i++) {
        const searchedCityBtn = document.createElement('button');
        searchedCityBtn.setAttribute('class', 'btn btn-secondary my-2');
        searchedCityBtn.textContent = savedCities[i];

        searchedList.appendChild(searchedCityBtn);
    }
}

//calls function to display saved cities so they persist on refresh
readCityStorage();
displaySavedCities();

//Event listener to search for cities
searchBtn.addEventListener("click", function(event) {
    readCityStorage();
    event.preventDefault();
    getLatLon();

})

//Event listener for previously searched cities
searchedCities.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-secondary')) {
        const searchAgain = event.target.textContent;
        getLatLon(searchAgain);
    }
})