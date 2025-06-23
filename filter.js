// Active filters storage
let activeFilters = {
    zones: new Set(),
    frostTolerance: new Set(),
    uses: new Set(),
};

let heightThreshold = 5;
let heightDirection = 'above';

// Function to handle checkbox toggle
function toggleFilter(type, value) {
    if (activeFilters[type].has(value)) {
        activeFilters[type].delete(value);
    } else {
        activeFilters[type].add(value);
    }
    applyFilters();  // Call the filtering logic after toggling filters
}

function updateHeightFilter(value, direction) {
    heightThreshold = parseFloat(value);
    heightDirection = direction;
    applyFilters();
}


function syncHeightCheckboxes(clicked) {
    const above = document.getElementById('above-height');
    const below = document.getElementById('below-height');

    if (clicked === 'above') {
        if (above.checked) below.checked = false;
    } else if (clicked === 'below') {
        if (below.checked) above.checked = false;
    }

    const active = above.checked ? 'above' : below.checked ? 'below' : null;
    const rangeValue = document.getElementById('height-range').value;
    updateHeightFilter(rangeValue, active);
}

document.getElementById('height-range').addEventListener('input', function () {
    document.getElementById('height-value').textContent = `${this.value}m`;
    const direction = document.getElementById('above-height').checked ? 'above' :
        document.getElementById('below-height').checked ? 'below' : null;
    updateHeightFilter(this.value, direction);
});

document.getElementById('above-height').addEventListener('change', () => syncHeightCheckboxes('above'));
document.getElementById('below-height').addEventListener('change', () => syncHeightCheckboxes('below'));


// Function to apply filters
function applyFilters() {
    let filteredPlants = allPlants;  // Start with all plants from the global variable

    // Apply zone filter
    if (activeFilters.zones.size > 0) {
        filteredPlants = filteredPlants.filter(plant => {
            return plant.zones.some(zone => activeFilters.zones.has(zone));
        });
    }

    // Apply frost tolerance filter
    if (activeFilters.frostTolerance.size > 0) {
        filteredPlants = filteredPlants.filter(plant => {
            return plant.frostTolerance.some(frost => activeFilters.frostTolerance.has(frost));
        });
    }

    // Apply uses filter
    if (activeFilters.uses.size > 0) {
        console.log("Uses filter:", activeFilters.uses);
        filteredPlants = filteredPlants.filter(plant => {
            // Check if plant.uses is defined and is an array
            return Array.isArray(plant.uses) && plant.uses.some(use => {
                return activeFilters.uses.has(use.trim().toLowerCase());
            });
        });
    }

    // Apply height filter
    if (heightThreshold !== null && heightDirection) {
        filteredPlants = filteredPlants.filter(plant => {
            const height = parseFloat(plant.height);
            if (isNaN(height)) return true;
            return heightDirection === 'above' ? height >= heightThreshold : height <= heightThreshold;
        });
    }

    displayPlants(filteredPlants);  // Call the display function to update the UI

}