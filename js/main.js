import { render } from './render.js';
import { fetchWeather } from './weather.js';

// Starting the app
async function init() {
    render();
    await fetchWeather();
}

init();