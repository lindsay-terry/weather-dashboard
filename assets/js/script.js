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

//fetch functions
function getLatLon(searchAgain) {
    console.log(searchAgain);
    const userInput = document.getElementById('city-search');
    let citySearched;
   //Check to see if data from the button is being passed in or using user input
    if (!searchAgain) {
        citySearched = userInput.value;
    } else {
        citySearched = searchAgain;
    }
    

    const geoApi = `http://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&limit=1&appid=${apiKey}`;

    fetch(geoApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        getCurrentWeather(data);
        getForecast(data);
        userInput.value = '';
    })
    .catch(function(error) {
        console.log('Error');
    })
}

function getCurrentWeather(data) {
    readCityStorage();
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=imperial`;
    
    fetch(weatherApi) 
    .then(function(response) {
        return response.json();
    })
    .then(function(weather) {
        // console.log(weather);
        displayCurrentWeather(weather);
        //checks to see if city exists in previously searched citites
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

function displayForecast(forecast) {
    const currentTime = dayjs().format('HH');
    const list = forecast.list;
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    let filteredTimes;
    //Function to check current time against the time blocks of 3 that the API returns results in and 
    //choose closest time block
    if (currentTime === '00') {
        filteredTimes = list.filter(item => item.dt_txt.includes('00:00'));
    } else {
        const timeBlock = Math.floor(parseInt(currentTime)/3) *3;
        filteredTimes = list.filter(item => item.dt_txt.includes(`${timeBlock.toString().padStart(2, '0')}:00`))
    }
    // displayForecast(filteredTimes);
    console.log(filteredTimes);

    const fiveDayHeader = document.createElement('h4');
    const fiveDayDiv = document.createElement('div');

    fiveDayHeader.textContent = "5 Day Forecast:";
    fiveDayDiv.setAttribute('class', 'd-flex m-2 p2');

    forecastDiv.appendChild(fiveDayHeader);
    forecastDiv.appendChild(fiveDayDiv);

    //create and render cards for 5 day forecast
    filteredTimes.forEach(entry => {
        const forecastCard = document.createElement('div');
        const dateHeader = document.createElement('h5');
        const icon = document.createElement('img');
        const temp = document.createElement('p');
        const wind = document.createElement('p');
        const humidity = document.createElement('p');

        forecastCard.setAttribute('class', 'card mx-4 p-3 custom-card');
        // forecastCard.setAttribute('style', 'background-color: --var(dark); color: white;')
        icon.setAttribute('src', `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`)
        icon.setAttribute('alt', `${entry.weather[0].icon} weather icon`);
        icon.setAttribute('style', 'height: 50px; width: 50px;');

        dateHeader.textContent = dayjs(entry.dt_txt).format('MM/DD/YYYY');
        temp.textContent = `Temp: ${entry.main.temp}\u00B0F`;
        wind.textContent = `Wind: ${entry.wind.speed} MPH`;
        humidity.textContent = `Humidity: ${entry.main.humidity}%`;

        forecastCard.appendChild(dateHeader);
        forecastCard.appendChild(icon);
        forecastCard.appendChild(temp);
        forecastCard.appendChild(wind);
        forecastCard.appendChild(humidity);
        
        fiveDayDiv.appendChild(forecastCard);
    }) 

    
}

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
    // displaySavedCities();

}

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

//Event listener to search for cities
searchBtn.addEventListener("click", function(event) {
    readCityStorage();
    // displaySavedCities();
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