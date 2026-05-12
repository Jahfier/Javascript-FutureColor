"use strict"

const state = {
    ingredients: [
        { id: 1, name: "Neon Blue", speed: 5, time: 2000, color: "hsl(200, 100%, 50%)", texture: "smooth" },
        { id: 2, name: "Toxic Green", speed: 5, time: 3000, color: "hsl(120, 100%, 50%)", texture: "grainy" },
        { id: 3, name: "Flashy Red", speed: 8, time: 2500, color: "hsl(0, 100%, 50%)", texture: "coarse" }
    ]
};

function renderIngredients() {
    const appContainer = Document.getElementById("app-container");

const list = document.createElement("ul");

state.ingredients.forEach(ingredient => {
    // 4. Een "rij" maken
    const item = document.createElement("li");
    item.textContent = ingredient.name;
    
    // 5. De rij in de lijst stoppen
    list.appendChild(item);
});

// 6. De lijst op de muur plakken
appContainer.appendChild(list);
}
























function init() {
    console.log("De applicatie is gestart en de state is:", state);
}

init();