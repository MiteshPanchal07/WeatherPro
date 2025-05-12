const weatherIcons = {
    'Clear': 'fas fa-sun',
    'Sunny': 'fas fa-sun',
    'Clouds': 'fas fa-cloud',
    'Rain': 'fas fa-cloud-rain',
    'Drizzle': 'fas fa-cloud-rain',
    'Thunderstorm': 'fas fa-bolt',
    'Snow': 'fas fa-snowflake',
    'Mist': 'fas fa-smog',
    'Smoke': 'fas fa-smog',
    'Haze': 'fas fa-smog',
    'Dust': 'fas fa-smog',
    'Fog': 'fas fa-smog',
    'Sand': 'fas fa-wind',
    'Ash': 'fas fa-wind',
    'Squall': 'fas fa-wind',
    'Tornado': 'fas fa-wind',
    'Partly Cloudy': 'fas fa-cloud-sun',
    'Mostly Sunny': 'fas fa-cloud-sun',
    'Scattered Clouds': 'fas fa-cloud'
};

const defaultCity = "New Delhi";
const apiKey = "1733cb37427b472582f43657250605";

const cityInput = document.getElementById('city');
const searchForm = document.getElementById('search-form');
const weatherIcon = document.getElementById('weather-icon');
const loadingEl = document.getElementById('loading');
const weatherContentEl = document.getElementById('weather-content');

async function fetchWeather(city) {
    if (!city) return;

    loadingEl.style.display = 'block';
    weatherContentEl.style.opacity = '0.5';

    try {
        const cleanCity = city.split(',')[0].trim();
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(cleanCity)}&days=1&aqi=no&alerts=no`
        );

        if (!response.ok) {
            throw new Error("City not found or network issue");
        }

        const data = await response.json();
        console.log("Weather Data:", data);
        updateUI(data);

    } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
    } finally {
        loadingEl.style.display = 'none';
        weatherContentEl.style.opacity = '1';
    }
}
function updateUI(data) {
    const current = data.current;
    const forecast = data.forecast.forecastday[0].day;
    const location = data.location;

    // Helper function to safely update elements
    function updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // City and Country
    updateElement('cityName', `${location.name}, ${location.country}`);

    // Weather Icon with proper color class
    const condition = current.condition.text;
    const iconClass = weatherIcons[condition] || 'fas fa-cloud weather-icon text-secondary';
    if (weatherIcon) weatherIcon.className = iconClass + ' weather-icon';


    updateElement('temp', `${current.temp_c}°C`);
    updateElement('temp2', `${current.temp_c}°C`);
    updateElement('min_temp', `${forecast.mintemp_c}°C`);
    updateElement('min_temp_detail', `${forecast.mintemp_c}°C`);
    updateElement('max_temp', `${forecast.maxtemp_c}°C`);
    updateElement('max_temp_detail', `${forecast.maxtemp_c}°C`);
    updateElement('humidity', `${current.humidity}%`);
    updateElement('humidity2', `${current.humidity}%`);
    updateElement('wind_speed', `${current.wind_kph} km/h`);
    updateElement('wind_degrees', current.wind_dir);
    updateElement('feels_like', `${current.feelslike_c}°C`);
    updateElement('feels_like_detail', `${current.feelslike_c}°C`);
    updateElement('sunrise', data.forecast.forecastday[0].astro.sunrise);
    updateElement('sunset', data.forecast.forecastday[0].astro.sunset);
    updateElement('cloud_pct', `${current.cloud}%`);
    updateElement('pressure', `${current.pressure_mb} hPa`);
    updateElement('visibility', `${current.vis_km} km`);
    updateElement('weather-desc', current.condition.text);
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

document.querySelectorAll('.dropdown-item').forEach(option => {
    option.addEventListener('click', function (e) {
        e.preventDefault();
        const city = this.getAttribute('data-city') || this.textContent.trim();
        cityInput.value = city;
        fetchWeather(city);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather(defaultCity);
});
