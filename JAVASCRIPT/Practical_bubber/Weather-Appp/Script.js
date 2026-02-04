let userTab = document.querySelector('.weatherTab');
let searchTab = document.querySelector('.searchTab');
let grantAccessContainer = document.querySelector('.grant-location-container');
let searchForm = document.querySelector('.form-container');
let loadingScreen = document.querySelector('.loading-container');
let userInfoContainer = document.querySelector('.user-info-container');
let grantAccessBtn = document.querySelector('.btn'); // Fixed: Changed to .btn as per HTML

let currentTab = userTab;
const API_KEY = "66cb0dbb76eb561c3b207f961eccc640";
currentTab.classList.add('current-tab');

// Initialize on page load
getfromSessionStorage();

//function for switch
function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');

        if (currentTab === searchTab) {
            // Show search form
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            loadingScreen.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            // Show user weather tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            loadingScreen.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

// function call when we click the tab 
userTab.addEventListener('click', () => {
    switchTab(userTab);
});

// function call when we click the tab 
searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

//check if coordinates are already present in session
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
        userInfoContainer.classList.remove("active");
        loadingScreen.classList.remove("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchuserWeather(coordinates);
    }
}

async function fetchuserWeather(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data); // Fixed function name
    } catch (err) {
        console.log("Error occurred: " + err);
        loadingScreen.classList.remove("active");
        alert("Failed to fetch weather data. Please try again.");
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector(".data-cityName");
    const countryFlag = document.querySelector(".data-countryIcon");
    const description = document.querySelector(".data-weatherDesc");
    const weatherIcon = document.querySelector(".data-weatherIcon");
    const temp = document.querySelector(".data-temp");
    const windSpeed = document.querySelector(".wind-speed");
    const humidity = document.querySelector(".humidity");
    const cloud = document.querySelector(".cloud");

    // fetch weather data and put in the elements
    cityName.innerText = weatherInfo?.name || "Unknown City";
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
    countryFlag.alt = `${weatherInfo?.sys?.country} flag`;
    description.innerText = weatherInfo?.weather?.[0]?.description || "No description";
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;
    weatherIcon.alt = weatherInfo?.weather?.[0]?.description || "Weather icon";
    temp.innerText = `${Math.round(weatherInfo?.main?.temp)}°C` || "N/A";
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s` || "N/A";
    humidity.innerText = `${weatherInfo?.main?.humidity}%` || "N/A";
    cloud.innerText = `${weatherInfo?.clouds?.all}%` || "N/A";
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchuserWeather(userCoordinates);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Grant access button event listener
grantAccessBtn.addEventListener('click', getLocation);

 //Search functionality
const searchInput = document.querySelector('.form-container input[type="text"]');
const searchButton = document.querySelector('.form-container .btn');

searchButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    
    if (city) {
        try {
            loadingScreen.classList.add("active");
            userInfoContainer.classList.remove("active");
            
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            const data = await response.json();
            
            if (data.cod === 200) {
                loadingScreen.classList.remove("active");
                userInfoContainer.classList.add("active");
                renderWeatherInfo(data);
                searchInput.value = ""; // Clear input
            } else {
                alert("City not found. Please try again.");
                loadingScreen.classList.remove("active");
            }
        } catch (error) {
            console.log("Error occurred: " + error);
            alert("Failed to fetch weather data. Please check your connection.");
            loadingScreen.classList.remove("active");
        }
    } else {
        alert("Please enter a city name.");
    }
});

// Allow form submission with Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchButton.click();
    }
});