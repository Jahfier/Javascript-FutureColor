// State data
export const state = {
    currentHall: 1,
    currentPage: "halls", 
    selectedPotId: null, 
    
    // List of ingredients
    ingredients: [
        { id: 1, name: "Neon Blue", hallId: 1, speed: 5, time: 2000, color: "hsl(200, 100%, 50%)", texture: "smooth" },
        { id: 2, name: "Toxic Green", hallId: 1, speed: 5, time: 3000, color: "hsl(120, 100%, 50%)", texture: "grainy" },
        { id: 3, name: "Flashy Red", hallId: 2, speed: 8, time: 2500, color: "hsl(0, 100%, 50%)", texture: "coarse" }
    ],
    
    // List of pots
    pots: [
        { id: 101, ingredients: [], mixed: false, color: null, texture: null },
        { id: 102, ingredients: [], mixed: false, color: null, texture: null },
        { id: 103, ingredients: [], mixed: false, color: null, texture: null }
    ],
    
    // List of machines
    machines: [],

    // List of mixed pots in cabinet
    cabinet: [],

    // Grid cells for testing
    grid: Array(24).fill(null),
    
    // Weather data with coordinates
    weather: {
        temperature: 15,
        isRainingOrSnowing: false,
        location: "Arnhem",
        lat: 51.9851,
        lon: 5.9039
    }
};