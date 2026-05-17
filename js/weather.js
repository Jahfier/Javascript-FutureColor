import { state } from './state.js';
import { render } from './render.js';

// Fetching live weather data from API using state coordinates
export async function fetchWeather() {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${state.weather.lat}&longitude=${state.weather.lon}&current_weather=true`);
        
        if (!response.ok) throw new Error("Weather API failed");

        const data = await response.json();
        
        // Updating state with API data
        state.weather.temperature = data.current_weather.temperature;
        
        const code = data.current_weather.weathercode;
        state.weather.isRainingOrSnowing = (code >= 61 && code <= 65) || (code >= 71 && code <= 75);

        render();
    } catch (error) {
        console.error("Could not get weather data:", error);
    }
}