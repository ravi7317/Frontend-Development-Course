const apikey = "66cb0dbb76eb561c3b207f961eccc640";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherBox = document.querySelector(".weather");
const errorBox = document.querySelector(".error");

// hide on load
errorBox.style.display = "none";
weatherBox.style.display = "none";

async function checkWeather(city) {
  try {
    const response = await fetch(`${apiUrl}${encodeURIComponent(city)}&appid=${apikey}`);

    if (!response.ok) {
      errorBox.style.display = "block";
      weatherBox.style.display = "none";
      return;
    }

    errorBox.style.display = "none";

    const data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";

    const main = data.weather[0].main;

    if (main === "Clouds") weatherIcon.src = "images/clouds.png";
    else if (main === "Clear") weatherIcon.src = "images/clear.png";
    else if (main === "Rain") weatherIcon.src = "images/rain.png";
    else if (main === "Drizzle") weatherIcon.src = "images/drizzle.png";
    else if (main === "Mist") weatherIcon.src = "images/mist.png";
    else weatherIcon.src = "images/clear.png"; // fallback

    weatherBox.style.display = "block";
  } catch (err) {
    console.error("Fetch failed:", err);
    errorBox.style.display = "block";
    weatherBox.style.display = "none";
  }
}

searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city) checkWeather(city);
});

searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = searchBox.value.trim();
    if (city) checkWeather(city);
  }
});
