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
                    <img src="plants/${plant.img}" alt="${plant.name}" class="zoom-image">
                </div>
                <img src="icons/minus.png" class="remove-from-garden" data-plant='${JSON.stringify(plant)}'></img> 
                <h2>${plant.name}</h2>

                <p><strong>5 Year Height:</strong> ${plant.height}</p>
                <p><strong>Growth Zones:</strong> ${plant.zones.join(', ')}</p>
                <p><strong>Frost Tolerance:</strong> ${plant.frostTolerance.join(', ')}</p>
            `;

            gardenList.appendChild(plantCard);
        });

        // Add event listeners for "Remove" buttons
        document.querySelectorAll('.remove-from-garden').forEach(button => {
            button.addEventListener('click', function () {
                const plantData = JSON.parse(this.getAttribute('data-plant'));
                removePlantFromGarden(plantData.name);
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

        // Initialize Masonry after images are loaded
        imagesLoaded(gardenList, function () {
            new Masonry(gardenList, {
                itemSelector: '.plant-card',
                columnWidth: '.plant-card',
                gutter: 20,
                fitWidth: true
            });
        });
    }
}

// Toast helper for showing messages
function showToast(message, bgColor = "#4caf50") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.backgroundColor = bgColor;
    toast.className = "toast show";

    // Hide after 3 seconds
    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

// Function to remove a plant from the garden
function removePlantFromGarden(plantName) {
    let gardenPlants = JSON.parse(localStorage.getItem('gardenPlants')) || [];
    gardenPlants = gardenPlants.filter(plant => plant.name !== plantName);
    localStorage.setItem('gardenPlants', JSON.stringify(gardenPlants));
    showToast(`${plantName} removed from garden!`);
    loadGardenPlants();  // Refresh the displayed list
}

// Load the garden plants when the page is loaded
window.onload = loadGardenPlants;