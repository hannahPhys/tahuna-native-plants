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
    applyFilters();  // Call the filtering logic after toggling filters
}

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
        filteredPlants = filteredPlants.filter(plant => {
            return plant.uses.some(use => activeFilters.uses.has(use));
        });
    }

    // Apply size filter (if size refers to height)
    if (activeFilters.size.size > 0) {
        filteredPlants = filteredPlants.filter(plant => activeFilters.size.has(plant.height));
    }

    displayPlants(filteredPlants);  // Call the display function to update the UI

}