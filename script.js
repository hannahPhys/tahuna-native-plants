// script.js

// Function to add icons for medicinal, frost-hardy, and bird-attractor plants
function addPlantIcons(plantCard) {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');
    
    // Define the specific classes we are interested in
    const relevantIcons = ['medicinal', 'frost-hardy', 'bird-attractor'];
    
    // Loop through each relevant icon class and add an icon if the plant has that class
    let hasRelevantIcon = false;
    relevantIcons.forEach(iconClass => {
        if (plantCard.classList.contains(iconClass)) {
            const icon = document.createElement('div');
            icon.classList.add('icon', iconClass); // Class determines the icon from CSS
            iconContainer.appendChild(icon);
            hasRelevantIcon = true; // Mark that we found at least one relevant icon
        }
    });

    // Only append the iconContainer if we added at least one icon
    if (hasRelevantIcon) {
        plantCard.appendChild(iconContainer);
    }
}


// Function to add the relevant classes based on the plant's properties
function addPlantClasses(plant, plantCard) {
    const properties = ['status', 'uses', 'frostTolerance', 'zones'];

    properties.forEach(property => {
        if (Array.isArray(plant[property])) {
            plant[property].forEach(value => {
                plantCard.classList.add(value.replace(/\s+/g, '-').toLowerCase());
            });
        } else {
            plantCard.classList.add(plant[property].replace(/\s+/g, '-').toLowerCase());
        }
    });
}

function displayPlants(filteredPlants) {
    const plantList = document.getElementById('plant-list');
    plantList.innerHTML = ''; // Clear previous content

    filteredPlants.forEach(plant => {
        const plantCard = document.createElement('div');
        plantCard.classList.add('plant-card');

        plantCard.innerHTML = `
            <img src="plants/${plant.img}" alt="${plant.name}">
            <h2>${plant.name}</h2>
            <p><strong>Height:</strong> ${plant.height}</p>
            <p><strong>Growth Zones:</strong> ${plant.zones.map(zone => capitalize(zone)).join(', ')}</p>
            <p><strong>Frost Tolerance:</strong> ${plant.frostTolerance.map(frost => capitalize(frost)).join(', ')}</p>
        `;

        addPlantClasses(plant, plantCard);
        addPlantIcons(plantCard); // Add icons based on classes
        plantList.appendChild(plantCard);
    });
}

// Helper function to capitalize first letter
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Display all plants on page load
window.onload = function() {
    displayPlants(plants); // Display all plants by default
};