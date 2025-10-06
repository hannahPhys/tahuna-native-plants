// Toast helper for showing messages
function showToast(message, bgColor = "#4caf50") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.backgroundColor = bgColor;
    toast.className = "toast show";

    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

function capitalize(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
}

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
    plantList.innerHTML = '';

    filteredPlants.forEach(plant => {
        const plantCard = document.createElement('div');
        plantCard.classList.add('plant-card');

        // Create HTML structure for plant data
        plantCard.innerHTML = `
            <div class="image-wrapper"> 
                <img src="plants/${plant.img}" alt="${plant.commonName}" class="zoom-image" width="300" height="200">
            </div>
            <img src="icons/plus.svg" class="add-to-garden" data-plant='${JSON.stringify(plant)}'></img> 

            ${plant.maoriName 
                ? `<h2>${plant.maoriName} (${plant.commonName})</h2>` 
                : `<h2>${plant.commonName}</h2>`}

            <p><strong>Botanical Name:</strong> <em>${plant.botanicalName}</em></p>
            <p><strong>5 Year Height:</strong> ${plant.height}</p>
            <p><strong>Growth Zones:</strong> ${plant.zones.map(zone => capitalize(zone)).join(', ').replace('—', '')}</p>
            <p><strong>Frost Tolerance:</strong> ${plant.frostTolerance.map(frost => capitalize(frost)).join(', ')}</p>
            <p>${capitalize(plant?.info)}</p>
            `;

        addPlantClasses(plant, plantCard);  // Add plant-specific classes
        addPlantIcons(plantCard);           // Add icons based on plant properties

        plantList.appendChild(plantCard);
    });

    // Attach event listener to each "Add to Garden" button
    document.querySelectorAll('.add-to-garden').forEach(button => {
        button.addEventListener('click', function () {
            const plantData = JSON.parse(this.getAttribute('data-plant'));
            addPlantToGarden(plantData);  // Function to add plant to localStorage
        });
    });


    document.querySelectorAll('.image-wrapper').forEach(wrapper => {
        const image = wrapper.querySelector('.zoom-image');

        wrapper.addEventListener('mousemove', function (e) {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            image.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        });

        wrapper.addEventListener('mouseleave', function () {
            image.style.transformOrigin = 'center center';
        });
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
            const label = iconClass.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            icon.title = label;
            icon.setAttribute('aria-label', label);
            iconContainer.appendChild(icon);
            hasRelevantIcon = true;
        }
    });

    // Only append icon container if at least one icon is added
    if (hasRelevantIcon) plantCard.appendChild(iconContainer);
}


function addPlantToGarden(plant) {
    let gardenPlants = JSON.parse(localStorage.getItem('gardenPlants')) || [];

    if (!gardenPlants.some(p => p.commonName === plant.commonName)) {
        gardenPlants.push(plant);
        localStorage.setItem('gardenPlants', JSON.stringify(gardenPlants));
        showToast(`${plant.commonName} added to your garden!`);
    } else {
        showToast(`${plant.commonName} is already in your garden.`, "#f44336"); // red for error
    }
}

// Initialize Masonry layout after images are loaded
function initializeMasonry() {
    const grid = document.querySelector('#plant-list');
    const msnry = new Masonry(grid, {
        itemSelector: '.plant-card',
        columnWidth: '.plant-card',
        gutter: 20,
        fitWidth: true
    });

    imagesLoaded(grid).on('progress', () => {
        msnry.layout();
    });
}

// Main function to initialize everything on page load
window.onload = function () {
    fetchAndDisplayPlants();  // Fetch and display plants from JSON
    document.getElementById('plant-detail-overlay').addEventListener('click', function (e) {
        if (e.target === this) {
            closePlantDetails();
        }
    });
};
