/**
 * Legacy local property-search form helpers only.
 * RealScout web components load from <head>; do not auto-hide or re-mount them here.
 * (Closed shadow roots make shadowRoot checks unreliable; async paint can make height < 50px briefly.)
 */
document.addEventListener('DOMContentLoaded', function () {
    function setupLocalPropertySearch() {
        return {
            init: function () {
                const searchForm = document.getElementById('property-search-form');
                if (searchForm) {
                    searchForm.addEventListener('submit', handleLocalSearch);
                }
            },
        };
    }

    function handleLocalSearch(e) {
        e.preventDefault();

        const location = document.getElementById('search-location');
        const propertyType = document.getElementById('search-property-type');
        const priceRange = document.getElementById('search-price-range');
        if (!location || !propertyType || !priceRange) return;

        showLocalSearchResults({
            location: location.value,
            propertyType: propertyType.value,
            priceRange: priceRange.value,
        });
    }

    function showLocalSearchResults(params) {
        const resultsContainer = document.getElementById('property-results');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <h3>Search Results for ${params.propertyType} in ${params.location}</h3>
            <p>Price range: ${params.priceRange}</p>
            <div class="property-grid">
                <div class="property-card">
                    <img src="assets/images/property1.jpg" alt="Luxury Home in Mountain's Edge">
                    <div class="property-details">
                        <h4>Luxury Home</h4>
                        <p>$850,000</p>
                        <p>4 bed | 3 bath | 3,200 sqft</p>
                    </div>
                </div>
                <div class="property-card">
                    <img src="assets/images/property2.jpg" alt="Modern Villa in Mountain's Edge">
                    <div class="property-details">
                        <h4>Modern Villa</h4>
                        <p>$920,000</p>
                        <p>5 bed | 4 bath | 3,800 sqft</p>
                    </div>
                </div>
                <div class="property-card">
                    <img src="assets/images/property3.jpg" alt="Family Home in Mountain's Edge">
                    <div class="property-details">
                        <h4>Family Home</h4>
                        <p>$750,000</p>
                        <p>3 bed | 2.5 bath | 2,800 sqft</p>
                    </div>
                </div>
            </div>
        `;
    }

    if (document.getElementById('property-search-form')) {
        setupLocalPropertySearch().init();
    }
});
