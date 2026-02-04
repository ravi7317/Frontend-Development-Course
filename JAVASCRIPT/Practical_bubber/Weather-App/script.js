
  /* =========================
   CONFIG
========================= */
const API_KEY = "2b894fd71873476c9ce210205230410";
const BASE = "https://api.weatherapi.com/v1";

/* =========================
   DOM
========================= */
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const suggestionsEl = document.getElementById("suggestions");
const geoBtn = document.getElementById("geoBtn");
const unitBtn = document.getElementById("unitBtn");
const statusText = document.getElementById("statusText");

const currentContent = document.getElementById("currentContent");
const hourlyRow = document.getElementById("hourlyRow");
const dailyList = document.getElementById("dailyList");
const dayDetails = document.getElementById("dayDetails");
const aqiContent = document.getElementById("aqiContent");
const astroContent = document.getElementById("astroContent");
const alertsContent = document.getElementById("alertsContent");
const favList = document.getElementById("favList");

/* =========================
   STATE
========================= */
const state = {
  unit: loadUnit(),        // "C" or "F"
  lastQuery: loadLastQuery(),
  favorites: loadFavorites()
};

/* =========================
   API HELPERS
========================= */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// 1) Forecast API (main)
async function fetchForecast(q, days = 7, aqi = "yes", alerts = "yes") {
  const url = `${BASE}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(q)}&days=${days}&aqi=${aqi}&alerts=${alerts}`;
  return fetchJSON(url);
}

// 2) Search API (autocomplete)
async function fetchCitySuggestions(query) {
  const url = `${BASE}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;
  return fetchJSON(url);
}

/* =========================
   UTIL: UNIT CONVERSION
========================= */
function tempVal(current) {
  return state.unit === "C" ? current.temp_c : current.temp_f;
}
function feelsLikeVal(current) {
  return state.unit === "C" ? current.feelslike_c : current.feelslike_f;
}
function windVal(current) {
  return state.unit === "C" ? current.wind_kph : current.wind_mph;
}
function windUnit() {
  return state.unit === "C" ? "kph" : "mph";
}
function pressureVal(current) {
  return state.unit === "C" ? current.pressure_mb : current.pressure_in;
}
function pressureUnit() {
  return state.unit === "C" ? "mb" : "in";
}
function tempUnit() {
  return state.unit === "C" ? "°C" : "°F";
}

/* =========================
   UTIL: AQI LABEL
========================= */
function aqiLabel(usEpaIndex) {
  // WeatherAPI: us-epa-index 1-6
  const map = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy (Sensitive)",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous"
  };
  return map[usEpaIndex] || "Unknown";
}

/* =========================
   UTIL: TIME
========================= */
function parseLocalTime(localtimeStr) {
  // "2026-02-04 17:20" -> Date (local machine)
  // We'll treat it as display-only; no heavy timezone math here.
  return localtimeStr;
}

// get next 24 hours starting from current local hour
function getNext24Hours(forecastday, localtimeStr) {
  const currentHour = Number(localtimeStr.split(" ")[1].split(":")[0]); // 17
  const todayHours = forecastday[0].hour.slice(currentHour);
  const remaining = 24 - todayHours.length;
  const nextDayHours = remaining > 0 ? (forecastday[1]?.hour || []).slice(0, remaining) : [];
  return [...todayHours, ...nextDayHours];
}

/* =========================
   RENDER FUNCTIONS
========================= */
function renderStatus(msg = "") {
  statusText.textContent = msg;
}

function renderCurrent(data) {
  const { location, current } = data;

  currentContent.innerHTML = `
    <p><b>${location.name}</b>, ${location.region}, ${location.country}</p>
    <p>Local time: ${parseLocalTime(location.localtime)}</p>
    <p style="font-size:22px;"><b>${tempVal(current).toFixed(1)}${tempUnit()}</b> (${current.condition.text})</p>
    <img alt="icon" src="https:${current.condition.icon}" />
    <p>Feels like: ${feelsLikeVal(current).toFixed(1)}${tempUnit()}</p>
    <p>Humidity: ${current.humidity}%</p>
    <p>Wind: ${windVal(current).toFixed(1)} ${windUnit()} (${current.wind_dir})</p>
    <p>Pressure: ${pressureVal(current)} ${pressureUnit()}</p>
    <p>Visibility: ${current.vis_km} km</p>
  `;

  applyTheme(current.is_day, current.condition.text);
}

function renderHourly(data) {
  const { forecast, location } = data;
  const hours = getNext24Hours(forecast.forecastday, location.localtime);

  hourlyRow.innerHTML = hours.map(h => {
    const t = state.unit === "C" ? h.temp_c : h.temp_f;
    const w = state.unit === "C" ? h.wind_kph : h.wind_mph;
    const hour = h.time.split(" ")[1]; // "17:00"
    return `
      <div class="hour-item">
        <p>${hour}</p>
        <img alt="icon" src="https:${h.condition.icon}" />
        <p><b>${Math.round(t)}${tempUnit()}</b></p>
        <p>Rain: ${h.chance_of_rain}%</p>
        <p>Wind: ${Math.round(w)} ${windUnit()}</p>
      </div>
    `;
  }).join("");
}

function renderDaily(data) {
  const days = data.forecast.forecastday;

  dailyList.innerHTML = days.map((d, idx) => {
    const maxT = state.unit === "C" ? d.day.maxtemp_c : d.day.maxtemp_f;
    const minT = state.unit === "C" ? d.day.mintemp_c : d.day.mintemp_f;

    return `
      <button class="day-item" data-day-index="${idx}">
        <div>
          <b>${d.date}</b>
          <div>${d.day.condition.text}</div>
          <div>${Math.round(maxT)}${tempUnit()} / ${Math.round(minT)}${tempUnit()}</div>
          <div>Rain: ${d.day.daily_chance_of_rain}% • Wind: ${Math.round(d.day.maxwind_kph)} kph</div>
        </div>
        <img alt="icon" src="https:${d.day.condition.icon}" />
      </button>
    `;
  }).join("");
}

function renderDayDetails(data, dayIndex = 0) {
  const d = data.forecast.forecastday[dayIndex];

  dayDetails.innerHTML = `
    <p><b>Date:</b> ${d.date}</p>
    <p><b>Condition:</b> ${d.day.condition.text}</p>
    <p><b>Max/Min:</b> ${Math.round(d.day.maxtemp_c)}°C / ${Math.round(d.day.mintemp_c)}°C</p>
    <p><b>Avg Humidity:</b> ${d.day.avghumidity}%</p>
    <p><b>Chance of Rain:</b> ${d.day.daily_chance_of_rain}%</p>
    <p><b>UV:</b> ${d.day.uv}</p>
  `;
}

function renderAQI(data) {
  const aq = data.current.air_quality;
  if (!aq) {
    aqiContent.innerHTML = `<p>No AQI data</p>`;
    return;
  }

  const epa = aq["us-epa-index"];
  aqiContent.innerHTML = `
    <p><b>US EPA Index:</b> ${epa} (${aqiLabel(epa)})</p>
    <p>PM2.5: ${aq.pm2_5}</p>
    <p>PM10: ${aq.pm10}</p>
    <p>O3: ${aq.o3}</p>
    <p>NO2: ${aq.no2}</p>
    <p>SO2: ${aq.so2}</p>
    <p>CO: ${aq.co}</p>
  `;
}

function renderAstro(data) {
  const astro = data.forecast.forecastday[0].astro;
  astroContent.innerHTML = `
    <p>Sunrise: ${astro.sunrise}</p>
    <p>Sunset: ${astro.sunset}</p>
    <p>Moonrise: ${astro.moonrise}</p>
    <p>Moonset: ${astro.moonset}</p>
    <p>Moon phase: ${astro.moon_phase}</p>
    <p>Moon illumination: ${astro.moon_illumination}%</p>
  `;
}

function renderAlerts(data) {
  const alerts = data.alerts?.alert || [];
  if (alerts.length === 0) {
    alertsContent.innerHTML = `<p>No alerts</p>`;
    return;
  }

  alertsContent.innerHTML = alerts.map(a => `
    <div class="alert-item">
      <p><b>${a.headline}</b></p>
      <p>${a.desc}</p>
    </div>
  `).join("");
}

function renderFavorites() {
  if (state.favorites.length === 0) {
    favList.innerHTML = `<p>No favorites yet</p>`;
    return;
  }

  favList.innerHTML = state.favorites.map(city => `
    <button class="fav-btn" data-city="${city}">${city}</button>
  `).join("");
}

/* =========================
   THEME
========================= */
function applyTheme(isDay, conditionText) {
  // super simple: add classes for CSS
  document.body.dataset.day = isDay ? "day" : "night";

  const c = conditionText.toLowerCase();
  if (c.includes("rain")) document.body.dataset.weather = "rain";
  else if (c.includes("cloud") || c.includes("overcast")) document.body.dataset.weather = "cloud";
  else if (c.includes("snow")) document.body.dataset.weather = "snow";
  else document.body.dataset.weather = "clear";
}

/* =========================
   STORAGE
========================= */
function loadUnit() {
  return localStorage.getItem("unit") || "C";
}
function saveUnit(unit) {
  localStorage.setItem("unit", unit);
}

function loadLastQuery() {
  return localStorage.getItem("lastQuery") || "Jaunpur";
}
function saveLastQuery(q) {
  localStorage.setItem("lastQuery", q);
}

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch {
    return [];
  }
}
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(state.favorites));
}

/* =========================
   MAIN FLOW
========================= */
let lastForecastData = null;

async function loadAndRender(query) {
  try {
    renderStatus("Loading...");
    const data = await fetchForecast(query, 7, "yes", "yes");
    lastForecastData = data;

    saveLastQuery(query);

    renderCurrent(data);
    renderHourly(data);
    renderDaily(data);
    renderDayDetails(data, 0);
    renderAQI(data);
    renderAstro(data);
    renderAlerts(data);

    renderFavorites();
    renderStatus("");
  } catch (err) {
    console.error(err);
    renderStatus("City not found or API error.");
  }
}

/* =========================
   AUTOCOMPLETE UI
========================= */
let debounceTimer = null;

cityInput.addEventListener("input", () => {
  const q = cityInput.value.trim();
  // show/hide search button when there's any input
  if (searchBtn) searchBtn.style.display = q.length > 0 ? "inline-block" : "none";
  clearTimeout(debounceTimer);

  if (q.length < 2) {
    suggestionsEl.innerHTML = "";
    return;
  }

  debounceTimer = setTimeout(async () => {
    try {
      const list = await fetchCitySuggestions(q);
      renderSuggestions(list);
    } catch (e) {
      suggestionsEl.innerHTML = "";
    }
  }, 300);
});

// Search button click: behave like Enter (search + add to favorites)
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const q = cityInput.value.trim();
    if (!q) return;
    suggestionsEl.innerHTML = "";
    loadAndRender(q);

    if (!state.favorites.includes(q)) {
      state.favorites.unshift(q);
      state.favorites = state.favorites.slice(0, 8);
      saveFavorites();
      renderFavorites();
    }
  });
}

function renderSuggestions(list) {
  if (!Array.isArray(list) || list.length === 0) {
    suggestionsEl.innerHTML = "";
    return;
  }

  suggestionsEl.innerHTML = list.slice(0, 8).map(item => {
    const label = `${item.name}, ${item.region}, ${item.country}`;
    return `<button class="sug-btn" data-city="${label}">${label}</button>`;
  }).join("");
}

/* =========================
   EVENT DELEGATION
========================= */
document.addEventListener("click", (e) => {
  // Suggestion click
  const sug = e.target.closest(".sug-btn");
  if (sug) {
    const city = sug.dataset.city;
    cityInput.value = city;
    suggestionsEl.innerHTML = "";
    loadAndRender(city);
  }

  // Day click
  const dayBtn = e.target.closest(".day-item");
  if (dayBtn && lastForecastData) {
    const idx = Number(dayBtn.dataset.dayIndex);
    renderDayDetails(lastForecastData, idx);
  }

  // Favorite click
  const fav = e.target.closest(".fav-btn");
  if (fav) loadAndRender(fav.dataset.city);
});

/* =========================
   UNIT TOGGLE
========================= */
unitBtn.addEventListener("click", () => {
  state.unit = state.unit === "C" ? "F" : "C";
  unitBtn.textContent = state.unit === "C" ? "°C" : "°F";
  unitBtn.dataset.unit = state.unit;
  saveUnit(state.unit);

  // rerender with cached data
  if (lastForecastData) {
    renderCurrent(lastForecastData);
    renderHourly(lastForecastData);
    renderDaily(lastForecastData);
    renderDayDetails(lastForecastData, 0);
    renderAQI(lastForecastData);
    renderAstro(lastForecastData);
    renderAlerts(lastForecastData);
  }
});

/* =========================
   GEOLOCATION
========================= */
geoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    renderStatus("Geolocation not supported.");
    return;
  }

  renderStatus("Getting location...");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const q = `${pos.coords.latitude},${pos.coords.longitude}`;
      loadAndRender(q);
    },
    () => renderStatus("Location permission denied.")
  );
});

/* =========================
   FAVORITES (simple add)
   - add current search to favorites by pressing Enter
========================= */
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const q = cityInput.value.trim();
    if (q) {
      suggestionsEl.innerHTML = "";
      loadAndRender(q);

      // add to favorites
      if (!state.favorites.includes(q)) {
        state.favorites.unshift(q);
        state.favorites = state.favorites.slice(0, 8);
        saveFavorites();
        renderFavorites();
      }
    }
  }
});

/* =========================
   OFFLINE HANDLING
========================= */
window.addEventListener("offline", () => renderStatus("You are offline."));
window.addEventListener("online", () => renderStatus(""));

/* =========================
   INIT
========================= */
unitBtn.textContent = state.unit === "C" ? "°C" : "°F";
// initialize search button visibility
if (searchBtn) searchBtn.style.display = cityInput.value.trim().length > 0 ? "inline-block" : "none";
loadAndRender(state.lastQuery);
renderFavorites();

