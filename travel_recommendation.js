/**
 * Travel Recommendation System Logic
 * Tasks 6-10 Implementation
 */

const searchInput = document.getElementById('destination-search');
const btnSearch = document.getElementById('btn-search');
const btnClear = document.getElementById('btn-clear');
const resultsContainer = document.getElementById('results-container');
const searchForm = document.getElementById('search-form');

let travelData = null;

// Task 6: Fetch data from the travel_recommendation_api.json file
async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        travelData = await response.json();
        console.log('Travel data fetched successfully:', travelData);
    } catch (error) {
        console.error('There was a problem fetching the travel data:', error);
    }
}

// Initial fetch
fetchTravelData();

// Task 7 & 8: Search and Recommendation Logic
function searchRecommendations(event) {
    if (event) event.preventDefault();
    
    if (!travelData) {
        console.error('Data not loaded yet');
        return;
    }

    const keyword = searchInput.value.toLowerCase().trim();
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!keyword) return;

    let results = [];

    // Keyword logic
    if (keyword.includes('beach')) {
        results = travelData.beaches;
    } else if (keyword.includes('temple')) {
        results = travelData.temples;
    } else if (keyword.includes('country') || keyword.includes('countries')) {
        // For countries, we show all cities in all countries for this generic keyword
        travelData.countries.forEach(country => {
            results = results.concat(country.cities);
        });
    } else {
        // Check for specific country names
        const specificCountry = travelData.countries.find(c => c.name.toLowerCase() === keyword);
        if (specificCountry) {
            results = specificCountry.cities;
        }
    }

    if (results.length > 0) {
        displayResults(results);
    } else {
        resultsContainer.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">No results found. Try keywords like "beach", "temple", or "country".</p>';
    }
}

// Task 10: Local Time Logic
function getLocalTime(placeName) {
    let timeZone = 'UTC';
    
    if (placeName.includes('Australia')) timeZone = 'Australia/Sydney';
    else if (placeName.includes('Japan')) timeZone = 'Asia/Tokyo';
    else if (placeName.includes('Brazil')) timeZone = 'America/Sao_Paulo';
    else if (placeName.includes('Cambodia')) timeZone = 'Asia/Phnom_Penh';
    else if (placeName.includes('India')) timeZone = 'Asia/Kolkata';
    else if (placeName.includes('French Polynesia')) timeZone = 'Pacific/Tahiti';

    const options = { 
        timeZone: timeZone, 
        hour12: true, 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric' 
    };
    
    try {
        return new Date().toLocaleTimeString('en-US', options);
    } catch (e) {
        return '';
    }
}

// Rendering Logic
function displayResults(results) {
    results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        const localTime = getLocalTime(item.name);
        const timeHtml = localTime ? `<div class="recommendation-time">Local Time: ${localTime}</div>` : '';

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" class="recommendation-image">
            <div class="recommendation-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                ${timeHtml}
            </div>
        `;
        resultsContainer.appendChild(card);
    });

    // Hide hero section details if results are shown (optional, for better UX)
    const aboutHeader = document.querySelector('.about-header');
    if (aboutHeader) aboutHeader.style.opacity = '0.3';
}

// Task 9: Clear Button Logic
function clearResults() {
    searchInput.value = '';
    resultsContainer.innerHTML = '';
    const aboutHeader = document.querySelector('.about-header');
    if (aboutHeader) aboutHeader.style.opacity = '1';
    console.log('Results cleared');
}

// Event Listeners
searchForm.addEventListener('submit', searchRecommendations);
btnClear.addEventListener('click', clearResults);
