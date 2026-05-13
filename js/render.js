import { state } from './state.js';

export function render() {
    const appContainer = document.getElementById("app-container");
    
    // Clearing the container
    appContainer.innerHTML = "";

    // Creating the header
    const h1 = document.createElement('h1');
    h1.textContent = "Je bent nu in Hal: " + state.currentHall;
    appContainer.appendChild(h1);

    // Creating the switch button
    const button = document.createElement("button");
    button.textContent = "Wissel van hal";
    button.addEventListener("click", () => {
        state.currentHall = (state.currentHall === 1) ? 2 : 1;
        render(); 
    });
    appContainer.appendChild(button);

    // Creating the list
    const list = document.createElement("ul");
    state.ingredients.forEach(ingredient => {
        if (ingredient.hallId === state.currentHall) {
            // Creating list item
            const item = document.createElement("li");
            item.textContent = `${ingredient.name} (Snelheid: ${ingredient.speed})`;
            list.appendChild(item);
        }
    });
    appContainer.appendChild(list);

    // Creating the add pot button
    const potButton = document.createElement("button");
    potButton.textContent = "Nieuwe pot maken";
    potButton.addEventListener("click", () => {
        state.pots.push({ id: Date.now(), ingredients: [] });
        render();
    });
    appContainer.appendChild(potButton);

    // Creating the pots
    state.pots.forEach(pot => {
        const potDiv = document.createElement("div");
        potDiv.style.border = "2px solid black";
        potDiv.style.width = "50px";
        potDiv.style.height = "50px";
        potDiv.textContent = "Pot";
        appContainer.appendChild(potDiv);
    });
}