function formatDate() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6 && index > 0) {
      forecastHTML =
        forecastHTML +
        `     
              <div class="col-2">
                <div class="weather-forecast-date">${formatDay(
                  forecastDay.dt
                )}</div>
                <img
                  id="img-weather-forecast"
                  src="icons/${forecastDay.weather[0].icon}.png"
                  alt="sun"
                  width="60"
                />
                <div class="weather-forecast-tempreatures">
                  <span class="weather-forecast-tempreature-max">${Math.round(
                    forecastDay.temp.max
                  )}°</span>
                  <span class="weather-forecast-tempreature-min">${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </div>
              </div>
              `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;

  let uvi = Math.round(response.data.current.uvi);
  let uvElement = document.querySelector("#uv");
  if (uvi <= 2) uvElement.innerHTML = `${uvi} (Low)`;
  else if (uvi < 6) uvElement.innerHTML = `${uvi} (Moderate)`;
  else if (uvi < 8) uvElement.innerHTML = `${uvi} (High)`;
  else uvElement.innerHTML = `${uvi} (Very high)`;
}

function getForecast(coordinates) {
  let apiKey = "4826c8e04d4686528238e637fd752385";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;
  let descriptionElement = document.querySelector("#weather-description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let dataElement = document.querySelector("#date");
  dataElement.innerHTML = formatDate();

  let iconCountryElement = document.querySelector("#flag-icon");
  iconCountryElement.setAttribute(
    "src",

    `country/${response.data.sys.country}.png`
  );

  celsiusTemp = response.data.main.temp;

  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute(
    "src",

    `icons/${response.data.weather[0].icon}.png`
  );
  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "4826c8e04d4686528238e637fd752385";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function searchByClick(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  findCity(cityInputElement.value);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchByClick);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

search("Kyiv");
function findCity(city) {
  let apiKey = "4826c8e04d4686528238e637fd752385";
  let findCityurl = `https://api.openweathermap.org/data/2.5/find?q=${city}&type=like&sort=population&cnt=30&appid=${apiKey}`;
  axios.get(findCityurl).then(function (response) {
    let cities = response.data.list;
    let citiesElement = "";
    let citiesElementContainer = document.querySelector(
      ".search-dropdown-menu"
    );
    if (cities.length === 1) {
      searchCityChoose(cities[0].coord);
      citiesElementContainer.innerHTML = "";
      return;
    }
    cities.forEach(function (object, index) {
      citiesElement =
        citiesElement +
        `  <li data-long="${object.coord.lon}" data-lat="${object.coord.lat}">
     <span>${object.name} (${object.sys.country})`;
      if (index !== cities.length - 1) {
        citiesElement = citiesElement + ",";
      }
      citiesElement = citiesElement + `</span> </li>`;
    });

    citiesElementContainer.innerHTML = citiesElement;

    function searchCityChoose(coord) {
      let apiKey = "4826c8e04d4686528238e637fd752385";
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
      axios.get(apiUrl).then(displayTemperature);
    }
    let li = document.querySelectorAll(".search-dropdown-menu li");
    li.forEach(function (value) {
      value.addEventListener("click", function () {
        searchCityChoose({
          lat: value.getAttribute("data-lat"),
          lon: value.getAttribute("data-long"),
        });
      });
    });
  });
}
