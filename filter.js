// filter.js

// Active filters storage
let activeFilters = {
    zones: new Set(),
    frostTolerance: new Set(),
    uses: new Set(),
    size: new Set(),
};

// Function to handle checkbox toggle
function toggleFilter(type, value) {
    if (activeFilters[type].has(value)) {
        activeFilters[type].delete(value);
    } else {
        activeFilters[type].add(value);
    }
    applyFilters();
}

// Function to apply filters and pass the filtered results to display function
function applyFilters() {
    let filteredPlants = plants;

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
        filteredPlants = filteredPlants.filter(plant => {
            return plant.uses.some(use => activeFilters.uses.has(use));
        });
    }

    // Apply size filter
    if (activeFilters.size.size > 0) {
        filteredPlants = filteredPlants.filter(plant => activeFilters.size.has(plant.height));
    }

    displayPlants(filteredPlants); // Call the display function with filtered plants
}