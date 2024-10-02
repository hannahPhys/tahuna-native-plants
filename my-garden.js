// Function to load and display garden plants from localStorage
function loadGardenPlants() {
    const gardenPlants = JSON.parse(localStorage.getItem('gardenPlants')) || [];
    const gardenList = document.getElementById('garden-plant-list');

    if (gardenPlants.length === 0) {
        gardenList.innerHTML = '<p>No plants added to your garden yet.</p>';
    } else {
        gardenList.innerHTML = '';
        gardenPlants.forEach(plant => {
            const plantCard = document.createElement('div');
            plantCard.classList.add('plant-card');
            plantCard.innerHTML = `
                <div class="image-wrapper">
                    <img src="plants/${plant.img}" alt="${plant.name}">
                </div>
                <h2>${plant.name}</h2>
                <p><strong>5 Year Height:</strong> ${plant.height}</p>
                <p><strong>Growth Zones:</strong> ${plant.zones.join(', ')}</p>
                <p><strong>Frost Tolerance:</strong> ${plant.frostTolerance.join(', ')}</p>
                <button class="remove-from-garden" data-plant-name="${plant.name}">Remove from Garden</button>
            `;

            gardenList.appendChild(plantCard);
        });

        // Add event listeners for "Remove" buttons
        document.querySelectorAll('.remove-from-garden').forEach(button => {
            button.addEventListener('click', function() {
                removePlantFromGarden(this.getAttribute('data-plant-name'));
            });
        });

        // Initialize Masonry after images are loaded
        imagesLoaded(gardenList, function() {
            new Masonry(gardenList, {
                itemSelector: '.plant-card',
                columnWidth: '.plant-card',
                gutter: 20,
                fitWidth: true
            });
        });
    }
}

// Function to remove a plant from the garden
function removePlantFromGarden(plantName) {
    let gardenPlants = JSON.parse(localStorage.getItem('gardenPlants')) || [];
    gardenPlants = gardenPlants.filter(plant => plant.name !== plantName);
    localStorage.setItem('gardenPlants', JSON.stringify(gardenPlants));
    loadGardenPlants();  // Refresh the displayed list
}

// Load the garden plants when the page is loaded
window.onload = loadGardenPlants;