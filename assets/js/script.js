const searchButton = document.querySelector('#search-button');
const inputCity = document.querySelector('#city-name');
const cityContainer = document.querySelector('#current-city');
const forecastContainer = document.querySelector('#forecast');

function getLocation(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=9bc8f53328dcb0d9e9ca44aef8aabc58`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            getCurrentWeather(lat, lon);
            getForecastWeather(lat, lon);
        })
}

function getCurrentWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9bc8f53328dcb0d9e9ca44aef8aabc58&units=imperial`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const section = convertDataToHTML(data, true);
            cityContainer.appendChild(section);
        })
}
function getForecastWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=9bc8f53328dcb0d9e9ca44aef8aabc58&units=imperial`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let d = 5; d < data.list.length; d++) {
                const forecastData = data.list[d];
                const section = convertDataToHTML(forecastData);
                forecastContainer.appendChild(section);
            }

        })
}

function convertDataToHTML(data, cityName) {
    const section = document.createElement('section');
    const time = document.createElement('h2');
    const icon = document.createElement('img');
    const temp = document.createElement('p');
    const wind = document.createElement('p');
    const humidity = document.createElement('p');
    
    section.className = 'city';
    const d = new Date(data.dt*1000);
    time.textContent = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()} ${d.getHours().toString().padStart(2,`0`)}:${d.getMinutes().toString().padStart(2,`0`)} `;
    icon.setAttribute(`src`, `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    temp.textContent = "Temp: " + data.main.temp + "\u00B0" + "F";
    wind.textContent = "Wind: " + data.wind.speed + " MPH";
    humidity.textContent = "Humidity: " + data.main.humidity + "%";
    if (cityName) {
        const city = document.createElement('h2');
        city.textContent = data.name;
        section.appendChild(city);
    }
    section.appendChild(time);
    section.appendChild(icon);
    section.appendChild(temp);
    section.appendChild(wind);
    section.appendChild(humidity);
    return section;
}

searchButton.addEventListener('click', function () {
    const searchedCity = inputCity.value;
    getLocation(searchedCity);
})

inputCity.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchButton.click();
    }
});