/* ===================================
   TBILISI BITES — weather.js
   Uses OpenWeatherMap API (free key)
   Falls back to mock if key missing
=================================== */

const WEATHER_API_KEY = 'bd5e378503941ddeb2130bba8f3e49f5'; // demo key
const CITY = 'Tbilisi';
const WEATHER_CARD = document.getElementById('weatherCard');

const weatherIcons = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️',
};

async function fetchWeather() {
  if (!WEATHER_CARD) return;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric&lang=ka`;
    const res = await fetch(url);

    if (!res.ok) throw new Error('Weather API error');

    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const main = data.weather[0].main;
    const icon = weatherIcons[main] || '🌤️';
    const humidity = data.main.humidity;
    const wind = Math.round(data.wind.speed);

    WEATHER_CARD.innerHTML = `
      <div class="weather-icon" style="font-size:2.5rem">${icon}</div>
      <div class="weather-temp">${temp}°C</div>
      <div class="weather-desc">${desc}</div>
      <div class="weather-city">${CITY}, საქართველო</div>
      <div style="display:flex;gap:1.5rem;margin-top:0.75rem">
        <small style="color:var(--text-dim);font-size:0.75rem">💧 ${humidity}%</small>
        <small style="color:var(--text-dim);font-size:0.75rem">💨 ${wind} მ/წ</small>
      </div>
    `;
  } catch (err) {
    // Fallback mock data
    WEATHER_CARD.innerHTML = `
      <div style="font-size:2.5rem">🌤️</div>
      <div class="weather-temp">24°C</div>
      <div class="weather-desc">ნაწილობრივ ღრუბლიანი</div>
      <div class="weather-city">${CITY}, საქართველო</div>
      <div style="display:flex;gap:1.5rem;margin-top:0.75rem">
        <small style="color:var(--text-dim);font-size:0.75rem">💧 58%</small>
        <small style="color:var(--text-dim);font-size:0.75rem">💨 4 მ/წ</small>
      </div>
    `;
  }
}

fetchWeather();