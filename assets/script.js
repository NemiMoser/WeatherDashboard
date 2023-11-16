var API_KEY = '8ef563bd1f484030efdef8474bd3e481';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const selectedCityContainer = document.querySelector('#selectedCity');
const cityInput = document.querySelector('#cityInput');
const searchButton = document.querySelector('#searchButton');
let dayElements;
let searchHistory = [];
const MAX_SEARCH_HISTORY = 5;

//city options
function fetchWeatherData(cityName) {
    console.log('Fetching weather data for:', cityName);
    const queryParams = {
        q: cityName,
        appid: API_KEY,
    };

    const apiURL = `${API_BASE_URL}?${new URLSearchParams(queryParams)}`;

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        // Update the weather display with data for the selected city
        const temperature_K = data.list[0].main.temp;
        const wind_mps = data.list[0].wind.speed;
        const humidity = data.list[0].main.humidity;
        const temperature_F = ((temperature_K - 273.15) * 9/5) + 32;
        const wind_mph = wind_mps * 2.23694;
        const weatherIconCode = data.list[0].weather[0].icon;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;

        selectedCityContainer.querySelector('.cityAndDate').textContent = `${cityName.toUpperCase()}`;
        selectedCityContainer.querySelector('.temperature').textContent = `Temp: ${temperature_F.toFixed(1)}°F`;
        selectedCityContainer.querySelector('.wind').textContent = `Wind: ${wind_mph.toFixed(1)} mph`;
        selectedCityContainer.querySelector('.humidity').textContent = `Humidity: ${humidity}%`;
        const weatherIcon = selectedCityContainer.querySelector('.weather-icon');
        weatherIcon.src = weatherIconUrl;

        const forecastList = data.list.slice(1, 7);
        processForecastData(forecastList, cityName);
    })
    .catch(error => {
        console.error('Error fetching weather data: ', error);
    });
}

//adding city to search history
function addToSearchHistory(cityName) {
    searchHistory.unshift(cityName);

    if (searchHistory.length > MAX_SEARCH_HISTORY) {
        searchHistory.pop();
    }
    updateSearchHistoryUI();
}
//updates displayed search hx in UI
function updateSearchHistoryUI() {
    const listItems = document.querySelector('.listItems');

    listItems.innerHTML = '';

    searchHistory.forEach(city => {
        const listItem = document.createElement('li');
        const cityButton = document.createElement('button');
        cityButton.textContent = city; 
        cityButton.classList.add('btn', 'btn-link'); 
        cityButton.addEventListener('click', () => { 
            fetchWeatherData(city);
        });

        listItem.appendChild(cityButton);
        listItems.appendChild(listItem);
    });

    const cityButtons = document.querySelectorAll('.list-group-item');
    cityButtons.forEach(cityButton => {
        cityButton.addEventListener('click', () => {
            const cityName = cityButton.textContent;
            fetchWeatherData(cityName);
        });
    });
}


//searching for a city
searchButton.addEventListener('click', (event) => {
    const cityName = cityInput.value;
    if (!searchHistory.includes(cityName)) {
        addToSearchHistory(cityName);
    }
    fetchWeatherData(cityName);

    const queryParams = {
        q: cityName,
        appid: '8ef563bd1f484030efdef8474bd3e481',
    };

    const apiURL = `${API_BASE_URL}?${new URLSearchParams(queryParams)}`;

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        const temperature_K = data.list[0].main.temp;
        const wind_mps = data.list[0].wind.speed;
        const humidity = data.list[0].main.humidity;
        const temperature_F = ((temperature_K - 273.15) * 9/5) + 32;
        const wind_mph = wind_mps * 2.23694;

        selectedCityContainer.querySelector('.temperature').textContent = `Temp: ${temperature_F.toFixed(1)}°F`;
        selectedCityContainer.querySelector('.wind').textContent = `Wind: ${wind_mph.toFixed(1)} mph`;
        selectedCityContainer.querySelector('.humidity').textContent = `Humidity: ${humidity}%`;

        const forecastList = data.list.slice(1, 7);
        processForecastData(forecastList, cityName);

       addToSearchHistory(cityName);
    })
    .catch(error => {
        console.error('Error fetching weather data: ', error);
    });
});


function processForecastData(forecastList, cityName) {

    if (!dayElements || dayElements.length === 0) {
        console.error('No day-card elements found.');
        return;
    }

    dayElements.forEach((dayElement, index) => {
        console.log(dayElement);

        try {
            const forecastDayName = dayElement.querySelector('.forecast-day-name');
            const forecastDayTemp = dayElement.querySelector('.forecast-day-temp');
            const forecastDayWind = dayElement.querySelector('.forecast-day-wind');
            const forecastDayHumidity = dayElement.querySelector('.forecast-day-humidity');
            const weatherIcon = dayElement.querySelector('.weather-icon');

            if (!forecastDayName || !forecastDayTemp || !forecastDayWind || !forecastDayHumidity || !weatherIcon) {
                throw new Error(`One or more elements not found for day ${index}.`);
        }

        forecastDayName.textContent = '';
        forecastDayTemp.textContent = '';
        forecastDayWind.textContent = '';
        forecastDayHumidity.textContent = '';
        weatherIcon.src = '';
    } catch (error) {
        console.error(error.message);
    }
    });

    forecastList.forEach((forecast, index) => {
        const forecastDate = dayjs().add(index + 1, 'day');//added on to correct dates
        const day = forecastDate.format('M-DD');
        const temperature_K = forecast.main.temp;
        const temperature_F = ((temperature_K - 273.15) * 9/5) + 32;
        const wind_mps = forecast.wind.speed;
        const wind_mph = wind_mps * 2.23694;
        const humidity = forecast.main.humidity;
        const weatherIconCode = forecast.weather[0].icon;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;

        if (index === 0) {
            selectedCityContainer.querySelector('.cityAndDate').textContent = `${cityName.toUpperCase()} ${day}`;
        } else {
            const forecastDayElement = dayElements[index - 1];
            forecastDayElement.querySelector('.forecast-day-name').textContent = day;
        }

        const forecastDayElement = dayElements[index];
        forecastDayElement.querySelector('.forecast-day-temp').textContent = `Temp: ${temperature_F.toFixed(1)}°F`;
        forecastDayElement.querySelector('.forecast-day-wind').textContent = `Wind: ${wind_mph.toFixed(1)} mph`;
        forecastDayElement.querySelector('.forecast-day-humidity').textContent = `Humidity: ${humidity}%`;
        forecastDayElement.querySelector('.weather-icon').src = weatherIconUrl;
    });
}


// Function to fetch weather data for a city
function fetchDefaultCityWeather() {
    const defaultCityName = 'Charlotte';
    const queryParams = {
        q: defaultCityName,
        appid: '8ef563bd1f484030efdef8474bd3e481',
    };

    const apiURL = `${API_BASE_URL}?${new URLSearchParams(queryParams)}`;

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        const currentDate = dayjs(); // to get the current date
        const temperature_K = data.list[0].main.temp;
        const wind_mps = data.list[0].wind.speed;
        const humidity = data.list[0].main.humidity;
        const temperature_F = ((temperature_K - 273.15) * 9/5) + 32;
        const wind_mph = wind_mps * 2.23694;
        const weatherIconCode = data.list[0].weather[0].icon;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;
        dayElements = document.querySelectorAll('.day-card');

        selectedCityContainer.querySelector('.temperature').textContent = `Temp: ${temperature_F.toFixed(1)}°F`;
        selectedCityContainer.querySelector('.wind').textContent = `Wind: ${wind_mph.toFixed(1)} mph`;
        selectedCityContainer.querySelector('.humidity').textContent = `Humidity: ${humidity}%`;

        const weatherIcon = selectedCityContainer.querySelector('.weather-icon');
        weatherIcon.src = weatherIconUrl;

        const forecastList = data.list.slice(0, 6);
        processForecastData(forecastList, defaultCityName, currentDate);
    })
    .catch(error => {
        console.error('Error fetching default city weather data: ', error);
    });
}
//window.addEventListener('load', fetchDefaultCityWeather);
document.addEventListener('DOMContentLoaded', () => {
    fetchDefaultCityWeather();
    updateSearchHistoryUI(); 
});

    //city options
    const cityButtons = document.querySelectorAll('.list-group-item');
    cityButtons.forEach(cityButton => {
        cityButton.addEventListener('click', () => {
            const cityName = cityButton.textContent; // Get the city name from the button text
            fetchWeatherData(cityName); // Fetch weather data for the selected city
        });
    });