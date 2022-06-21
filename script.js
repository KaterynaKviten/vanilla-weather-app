function displayTemperature(response) {
  console.log(response.data.main.temp);
}
let apiKey = "4826c8e04d4686528238e637fd752385";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Kyiv&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(displayTemperature);
