import { state } from './state.js';
import { fetchWeather } from './weather.js';

// Creating helper to mix colors
function mixColors(ingredients) {
    if (ingredients.length === 0) return "hsl(0, 0%, 50%)";
    let totalH = 0;
    ingredients.forEach(ing => {
        const match = ing.color.match(/\d+/);
        totalH += match ? parseInt(match[0]) : 0;
    });
    const avgH = Math.round(totalH / ingredients.length);
    return `hsl(${avgH}, 100%, 50%)`;
}

// Creating helper to convert HSL to RGB text
function hslToRgbText(hslStr) {
    // Extract the numbers from the HSL string (e.g., "hsl(120, 100%, 50%)" -> [120, 100, 50])
    const matches = hslStr.match(/\d+/g);
    if (!matches) return "rgb(255, 255, 255)";

    // Convert degrees and percentages to fractions between 0 and 1
    const h = parseInt(matches[0]) / 360;
    const s = parseInt(matches[1]) / 100;
    const l = parseInt(matches[2]) / 100;

    // If saturation is 0, the color is gray (Red, Green and Blue are all equal)
    if (s === 0) {
        const grayValue = Math.round(l * 255);
        return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    }

    // Helper function to calculate the color intensity for a specific color zone
    const calculateChannel = (p, q, t) => {
        let hueTime = t;
        if (hueTime < 0) hueTime += 1;
        if (hueTime > 1) hueTime -= 1;
        
        if (hueTime < 1/6) return p + (q - p) * 6 * hueTime;
        if (hueTime < 1/2) return q;
        if (hueTime < 2/3) return p + (q - p) * (2/3 - hueTime) * 6;
        return p;
    };

    // Calculate temporary mathematical values based on lightness and saturation
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    // Calculate the final Red, Green and Blue values and scale them to 0-255
    const r = Math.round(calculateChannel(p, q, h + 1/3) * 255);
    const g = Math.round(calculateChannel(p, q, h) * 255);
    const b = Math.round(calculateChannel(p, q, h - 1/3) * 255);

    return `rgb(${r}, ${g}, ${b})`;

}

export function render() {
    const appContainer = document.getElementById("app-container");
    
    // Clearing the container
    appContainer.innerHTML = "";

    // Creating navigation bar
    const nav = document.createElement("nav");
    nav.className = "main-nav";
    
    const btnHalls = document.createElement("button");
    btnHalls.textContent = "Menghallen";
    if (state.currentPage === "halls") btnHalls.className = "active";
    btnHalls.addEventListener("click", () => { state.currentPage = "halls"; render(); });
    
    const btnTest = document.createElement("button");
    btnTest.textContent = "Kleurentest Pagina";
    if (state.currentPage === "test") btnTest.className = "active";
    btnTest.addEventListener("click", () => { state.currentPage = "test"; render(); });
    
    nav.appendChild(btnHalls);
    nav.appendChild(btnTest);
    appContainer.appendChild(nav);

    // Creating the weather widget
    const weatherDiv = document.createElement("div");
    weatherDiv.className = "weather-widget";
    
    const weatherText = document.createElement("span");
    weatherText.textContent = `Filiaal: ${state.weather.location} | Temp: ${state.weather.temperature}°C | Neerslag: ${state.weather.isRainingOrSnowing ? "Ja" : "Nee"} | Wijzig locatie: `;
    weatherDiv.appendChild(weatherText);

    // Creating location selector dropdown
    const locationSelect = document.createElement("select");
    locationSelect.style.width = "auto";
    locationSelect.style.display = "inline-block";
    locationSelect.style.marginLeft = "10px";
    
    const options = [
        { name: "Arnhem (Normaal)", lat: 51.9851, lon: 5.9039 },
        { name: "Dubai (Extreem Warm)", lat: 25.2048, lon: 55.2708 },
        { name: "Spitsbergen (Extreem Koud)", lat: 78.2232, lon: 15.6469 }
    ];

    options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt.name;
        o.textContent = opt.name;
        if (state.weather.location === opt.name) o.selected = true;
        locationSelect.appendChild(o);
    });

    locationSelect.addEventListener("change", async (e) => {
        const selected = options.find(o => o.name === e.target.value);
        state.weather.location = selected.name;
        state.weather.lat = selected.lat;
        state.weather.lon = selected.lon;
        await fetchWeather();
    });

    weatherDiv.appendChild(locationSelect);
    appContainer.appendChild(weatherDiv);

    // --- RENDERING HALLS PAGE ---
    if (state.currentPage === "halls") {
        const pageHeader = document.createElement("div");
        pageHeader.className = "page-header";

        // Creating the header
        const h1 = document.createElement('h1');
        h1.textContent = "Je bent nu in Hal: " + state.currentHall;
        pageHeader.appendChild(h1);

        // Creating the switch button
        const button = document.createElement("button");
        button.textContent = "Wissel van hal";
        button.className = "btn-switch";
        button.addEventListener("click", () => {
            state.currentHall = (state.currentHall === 1) ? 2 : 1;
            render(); 
        });
        pageHeader.appendChild(button);
        appContainer.appendChild(pageHeader);

        // Creating main content layout
        const mainContent = document.createElement("div");
        mainContent.className = "hall-content";

        // Creating sidebar for ingredients
        const sidebar = document.createElement("aside");
        sidebar.className = "ingredient-sidebar";

        // Creating the add ingredient form
        if (state.currentHall === 1) {
            const formContainer = document.createElement("div");
            formContainer.className = "form-container ing-form";
            
            formContainer.innerHTML = `
                <h3>Nieuw Ingrediënt</h3>
                <div class="form-group"><label>Naam:</label><input type="text" id="ing-name" value="Custom Color"></div>
                <div class="form-group"><label>Snelheid:</label><input type="number" id="ing-speed" value="5"></div>
                <div class="form-group"><label>Tijd (ms):</label><input type="number" id="ing-time" value="2000"></div>
                <div class="form-group"><label>Kleur:</label><input type="color" id="ing-color" value="#ff0000"></div>
                <div class="form-group"><label>Structuur:</label>
                    <select id="ing-texture">
                        <option value="smooth">Glad</option>
                        <option value="grainy">Korrelig</option>
                        <option value="coarse">Grof</option>
                        <option value="slimy">Slijmerig</option>
                    </select>
                </div>
            `;

            const addIngBtn = document.createElement("button");
            addIngBtn.textContent = "Toevoegen";
            addIngBtn.className = "btn-primary btn-full";
            addIngBtn.addEventListener("click", () => {
                const name = document.getElementById("ing-name").value;
                const speed = parseInt(document.getElementById("ing-speed").value);
                const time = parseInt(document.getElementById("ing-time").value);
                const color = document.getElementById("ing-color").value;
                const texture = document.getElementById("ing-texture").value;
                if (!name) { alert("Vul een naam in!"); return; }
                state.ingredients.push({ id: Date.now(), name: name, hallId: 1, speed: speed, time: time, color: color, texture: texture });
                render();
            });
            formContainer.appendChild(addIngBtn);
            sidebar.appendChild(formContainer);
        }

        // Creating the ingredient list
        const list = document.createElement("ul");
        list.className = "ingredient-list";
        state.ingredients.forEach(ingredient => {
            if (ingredient.hallId === state.currentHall) {
                const item = document.createElement("li");
                item.className = "ingredient-item";
                item.draggable = true;
                item.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/ingredient-id", ingredient.id); });

                const colorDot = document.createElement("span");
                colorDot.className = "color-dot";
                colorDot.style.backgroundColor = ingredient.color;

                const textSpan = document.createElement("span");
                textSpan.className = "ing-text";
                textSpan.innerHTML = `<strong>${ingredient.name}</strong><br><small>${ingredient.texture} | Spd: ${ingredient.speed} | T: ${ingredient.time}ms</small>`;

                item.appendChild(colorDot);
                item.appendChild(textSpan);
                list.appendChild(item);
            }
        });
        sidebar.appendChild(list);
        mainContent.appendChild(sidebar);

        // Creating the main area for machines and pots
        const workspace = document.createElement("section");
        workspace.className = "workspace";

        // Creating machine section
        const machineHeaderDiv = document.createElement("div");
        machineHeaderDiv.className = "section-header";
        const h2Machines = document.createElement("h2");
        h2Machines.textContent = "Mengmachines";
        machineHeaderDiv.appendChild(h2Machines);

        const machineButton = document.createElement("button");
        machineButton.textContent = "+ Machine";
        machineButton.className = "btn-primary";
        machineButton.addEventListener("click", () => {
            const machinesInHall = state.machines.filter(m => m.hallId === state.currentHall).length;
            if (machinesInHall < 5) {
                // Giving machine a default max allowed time of 2500ms
                state.machines.push({ id: Date.now(), hallId: state.currentHall, isMixing: false, pot: null, maxTime: 2500 });
                render();
            } else { alert("Max 5 machines!"); }
        });
        machineHeaderDiv.appendChild(machineButton);
        workspace.appendChild(machineHeaderDiv);

        const machineContainer = document.createElement("div");
        machineContainer.className = "machine-container";

        state.machines.forEach(machine => {
            if (machine.hallId === state.currentHall) {
                const machineDiv = document.createElement("div");
                machineDiv.className = "machine-box drop-zone";
                
                if (machine.isMixing) {
                    machineDiv.classList.add("mixing-active");
                    machineDiv.innerHTML = `<div class="loader"></div><strong>MIXING...</strong><br>Pot: ${machine.pot.id.toString().slice(-3)}`;
                } else {
                    machineDiv.innerHTML = `<strong>Mixer</strong><br><small>Limit: ${machine.maxTime}ms</small><br><small>Drop pot</small>`;
                    machineDiv.addEventListener("dragover", (e) => { e.preventDefault(); machineDiv.classList.add("drag-over"); });
                    machineDiv.addEventListener("dragleave", () => { machineDiv.classList.remove("drag-over"); });
                    machineDiv.addEventListener("drop", (e) => {
                        e.preventDefault();
                        machineDiv.classList.remove("drag-over");
                        const potId = parseInt(e.dataTransfer.getData("text/pot-id"));
                        const potIndex = state.pots.findIndex(p => p.id === potId);
                        const pot = state.pots[potIndex];
                        if (!pot || pot.ingredients.length === 0) { alert("Pot is leeg!"); return; }

                        if (state.weather.temperature > 35) {
                            const activeCount = state.machines.filter(m => m.hallId === state.currentHall && m.isMixing).length;
                            if (activeCount >= 1) { alert("Te warm! Max 1 actieve machine per hal."); return; }
                        }

                        let maxTime = 0;
                        pot.ingredients.forEach(i => { if (i.time > maxTime) maxTime = i.time; });

                        // Checking FAQ rule: ingredient time higher than machine time limit
                        if (maxTime > machine.maxTime) {
                            alert("Mislukt! De mengtijd van de ingrediënten is hoger dan deze machine aankan. Ingrediënten zijn vernietigd!");
                            pot.ingredients = []; 
                            render();
                            return;
                        }

                        if (state.weather.isRainingOrSnowing) maxTime *= 1.10;
                        if (state.weather.temperature < 10) maxTime *= 1.15;

                        machine.isMixing = true;
                        machine.pot = pot;
                        state.pots.splice(potIndex, 1);
                        render();

                        setTimeout(() => {
                            machine.isMixing = false;
                            pot.mixed = true;
                            pot.texture = "smooth";
                            pot.color = mixColors(pot.ingredients);
                            state.cabinet.push(pot);
                            machine.pot = null;
                            render();
                        }, maxTime);
                    });
                }
                machineContainer.appendChild(machineDiv);
            }
        });
        workspace.appendChild(machineContainer);

        // Creating pot section
        const potHeaderDiv = document.createElement("div");
        potHeaderDiv.className = "section-header";
        const h2Pots = document.createElement("h2");
        h2Pots.textContent = "Verfpotten (Vloer)";
        potHeaderDiv.appendChild(h2Pots);

        const potButton = document.createElement("button");
        potButton.textContent = "+ Lege Pot";
        potButton.className = "btn-primary";
        potButton.addEventListener("click", () => {
            state.pots.push({ id: Date.now(), ingredients: [], mixed: false });
            render();
        });
        potHeaderDiv.appendChild(potButton);
        workspace.appendChild(potHeaderDiv);

        const potContainer = document.createElement("div");
        potContainer.className = "pot-container";
        state.pots.forEach(pot => {
            const potDiv = document.createElement("div");
            potDiv.className = "pot-box drop-zone";
            potDiv.draggable = true;
            potDiv.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/pot-id", pot.id); });

            let potContentText = `<strong>Pot ${pot.id.toString().slice(-3)}</strong><br><small>Items: ${pot.ingredients.length}/3</small><br><ul class="pot-ing-list">`;
            pot.ingredients.forEach(ing => { potContentText += `<li>${ing.name}</li>`; });
            potContentText += "</ul>";
            potDiv.innerHTML = potContentText;

            potDiv.addEventListener("dragover", (e) => { e.preventDefault(); potDiv.classList.add("drag-over"); });
            potDiv.addEventListener("dragleave", () => { potDiv.classList.remove("drag-over"); });
            potDiv.addEventListener("drop", (e) => {
                e.preventDefault();
                potDiv.classList.remove("drag-over");
                
                // Checking if the dragged item is actually an ingredient
                const ingredientIdStr = e.dataTransfer.getData("text/ingredient-id");
                if (!ingredientIdStr) return; 

                const ingredientId = parseInt(ingredientIdStr);
                const ingredient = state.ingredients.find(i => i.id === ingredientId);
                if (!ingredient) return;

                if (pot.ingredients.length >= 3) { alert("Pot is vol!"); return; }
                if (pot.ingredients.length > 0 && pot.ingredients[0].speed !== ingredient.speed) { alert("Snelheden verschillen!"); return; }
                pot.ingredients.push(ingredient);
                render();
            });
            potContainer.appendChild(potDiv);
        });
        workspace.appendChild(potContainer);
        mainContent.appendChild(workspace);
        appContainer.appendChild(mainContent);

        // Creating cabinet section
        const cabinetDiv = document.createElement("section");
        cabinetDiv.className = "cabinet-section";
        const cabinetHeader = document.createElement("h2");
        cabinetHeader.textContent = "Opslagkast (Gemengde Verf)";
        cabinetDiv.appendChild(cabinetHeader);

        const cabinetContainer = document.createElement("div");
        cabinetContainer.className = "cabinet-container";
        state.cabinet.forEach(pot => {
            const mixedPot = document.createElement("div");
            mixedPot.className = "mixed-pot-box";
            mixedPot.style.backgroundColor = pot.color;
            mixedPot.innerHTML = `<strong>Pot ${pot.id.toString().slice(-3)}</strong><br><small>${pot.texture}</small>`;
            cabinetContainer.appendChild(mixedPot);
        });
        cabinetDiv.appendChild(cabinetContainer);
        appContainer.appendChild(cabinetDiv);
    }

    // --- RENDERING COLOR TEST PAGE ---
    if (state.currentPage === "test") {
        const testPage = document.createElement("div");
        testPage.className = "test-page";

        const h1Test = document.createElement("h1");
        h1Test.textContent = "Kleurentest Pagina";
        testPage.appendChild(h1Test);

        const selectText = document.createElement("p");
        selectText.className = "instruction-text";
        selectText.textContent = "1. Selecteer een pot uit de kast (klik):";
        testPage.appendChild(selectText);

        const testCabinet = document.createElement("div");
        testCabinet.className = "cabinet-container test-selector";
        state.cabinet.forEach(pot => {
            const mixedPot = document.createElement("div");
            mixedPot.className = `mixed-pot-box selectable ${state.selectedPotId === pot.id ? "selected" : ""}`;
            mixedPot.style.backgroundColor = pot.color;
            mixedPot.innerHTML = `<strong>Pot ${pot.id.toString().slice(-3)}</strong>`;
            mixedPot.addEventListener("click", () => { state.selectedPotId = pot.id; render(); });
            testCabinet.appendChild(mixedPot);
        });
        testPage.appendChild(testCabinet);

        const paintText = document.createElement("p");
        paintText.className = "instruction-text";
        paintText.textContent = "2. Klik op een vakje in het grid om te verven (of bekijk triadic advies):";
        testPage.appendChild(paintText);

        // Creating the 6x4 Grid
        const gridContainer = document.createElement("div");
        gridContainer.className = "test-grid";

        state.grid.forEach((cellColor, index) => {
            const cell = document.createElement("div");
            cell.className = "grid-cell";
            cell.style.backgroundColor = cellColor || "#fff";

            cell.addEventListener("click", (e) => {
                if (state.selectedPotId) {
                    const selectedPot = state.cabinet.find(p => p.id === state.selectedPotId);
                    state.grid[index] = selectedPot.color;
                    state.selectedPotId = null; 
                    render();
                } else if (cellColor) {
                    const match = cellColor.match(/\d+/);
                    const h = match ? parseInt(match[0]) : 0;
                    const t1 = `hsl(${(h + 120) % 360}, 100%, 50%)`;
                    const t2 = `hsl(${(h + 240) % 360}, 100%, 50%)`;

                    const popup = document.createElement("div");
                    popup.className = "triadic-popup";
                    popup.style.left = `${e.pageX + 10}px`;
                    popup.style.top = `${e.pageY + 10}px`;

                    popup.innerHTML = `
                        <h4>Triadic Kleuradvies</h4>
                        <div class="advice-row">
                            <div class="color-preview" style="background:${t1};"></div>
                            <div class="color-codes">HSL: <small>${t1}</small><br>RGB: <small>${hslToRgbText(t1)}</small></div>
                        </div>
                        <div class="advice-row">
                            <div class="color-preview" style="background:${t2};"></div>
                            <div class="color-codes">HSL: <small>${t2}</small><br>RGB: <small>${hslToRgbText(t2)}</small></div>
                        </div>
                        <button class="btn-primary btn-sm" id="close-popup">Sluiten</button>
                    `;
                    appContainer.appendChild(popup);
                    document.getElementById("close-popup").addEventListener("click", () => { popup.remove(); });
                }
            });
            gridContainer.appendChild(cell);
        });
        testPage.appendChild(gridContainer);
        appContainer.appendChild(testPage);
    }
}