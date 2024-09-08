// Global variable to hold all the plant data fetched from JSON
let allPlants = [];

// Function to fetch plant data from plants.json and apply filters
function fetchAndDisplayPlants() {
    fetch('plants.json')
        .then(response => response.json())
        .then(data => {
            allPlants = data;  // Store the fetched plant data globally
            applyFilters();    // Apply filters to the loaded data (if any are active)
        })
        .catch(error => console.error('Error fetching plants data:', error));
}

// Function to display the plants
function displayPlants(filteredPlants) {
    const plantList = document.getElementById('plant-list');
    plantList.innerHTML = ''; // Clear previous content

    filteredPlants.forEach(plant => {
        const plantCard = document.createElement('div');
        plantCard.classList.add('plant-card');

        // Create HTML structure for plant data
        plantCard.innerHTML = `
            <img src="plants/${plant.img}" alt="${plant.name}">
            <h2>${plant.name}</h2>
            <p><strong>5 Year Height:</strong> ${plant.height}</p>
            <p><strong>Growth Zones:</strong> ${plant.zones.map(zone => capitalize(zone)).join(', ')}</p>
            <p><strong>Frost Tolerance:</strong> ${plant.frostTolerance.map(frost => capitalize(frost)).join(', ')}</p>
        `;

        addPlantClasses(plant, plantCard);  // Add plant-specific classes
        addPlantIcons(plantCard);           // Add icons based on plant properties

        plantList.appendChild(plantCard);
    });
      initializeMasonry();
}

// Function to add plant-specific classes based on its properties
function addPlantClasses(plant, plantCard) {
    ['status', 'uses', 'frostTolerance', 'zones'].forEach(prop => 
      [].concat(plant[prop] || []).forEach(value => 
        plantCard.classList.add(value.replace(/\s+/g, '-').toLowerCase())
      )
    );
}

// Function to add icons for medicinal, frost-hardy, and bird-attractor plants
function addPlantIcons(plantCard) {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');
    
    const relevantIcons = ['medicinal', 'frost-hardy', 'bird-attractor'];
    let hasRelevantIcon = false;

    relevantIcons.forEach(iconClass => {
        if (plantCard.classList.contains(iconClass)) {
            const icon = document.createElement('div');
            icon.classList.add('icon', iconClass); // Class determines the icon from CSS
            iconContainer.appendChild(icon);
            hasRelevantIcon = true;
        }
    });

    // Only append icon container if at least one icon is added
    if (hasRelevantIcon) {
        plantCard.appendChild(iconContainer);
    }
}

// Helper function to capitalize the first letter of a string
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize Masonry layout after images are loaded
function initializeMasonry() {
    const grid = document.querySelector('#plant-list');
    imagesLoaded(grid, function() {
        new Masonry(grid, {
            itemSelector: '.plant-card',
            columnWidth: '.plant-card',
            gutter: 20,
            fitWidth: true
        });
    });
}

// Main function to initialize everything on page load
window.onload = function() {
    fetchAndDisplayPlants();  // Fetch and display plants from JSON
};