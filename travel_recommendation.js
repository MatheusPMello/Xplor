/**
 * Travel Recommendation System Logic
 * Enhanced search matching, responsive support, subpage redirects,
 * contact form verification, and simulated booking flow.
 */

// DOM Elements - safe selection with fallbacks
const searchInput = document.getElementById('destination-search');
const btnSearch = document.getElementById('btn-search');
const btnClear = document.getElementById('btn-clear');
const resultsContainer = document.getElementById('results-container');
const searchForm = document.getElementById('search-form') || document.querySelector('.search-form');
const contactForm = document.getElementById('contact-form');
const btnBookNow = document.getElementById('btn-book-now') || document.querySelector('.about-section .btn-primary');

let travelData = null;

// Embedded fallback data for local file:// access to bypass CORS policy restrictions
const fallbackData = {
    "countries": [
      {
        "id": 1,
        "name": "Australia",
        "cities": [
          {
            "name": "Sydney, Australia",
            "imageUrl": "images/sydney.png",
            "description": "A vibrant city known for its iconic landmarks like the Sydney Opera House and Sydney Harbour Bridge."
          },
          {
            "name": "Melbourne, Australia",
            "imageUrl": "images/melbourne.png",
            "description": "A cultural hub famous for its art, food, and diverse neighborhoods."
          }
        ]
      },
      {
        "id": 2,
        "name": "Japan",
        "cities": [
          {
            "name": "Tokyo, Japan",
            "imageUrl": "images/tokyo.png",
            "description": "A bustling metropolis blending tradition and modernity, famous for its cherry blossoms and rich culture."
          },
          {
            "name": "Kyoto, Japan",
            "imageUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
            "description": "Known for its historic temples, gardens, and traditional tea houses."
          }
        ]
      },
      {
        "id": 3,
        "name": "Brazil",
        "cities": [
          {
            "name": "Rio de Janeiro, Brazil",
            "imageUrl": "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=1000&auto=format&fit=crop",
            "description": "A lively city known for its stunning beaches, vibrant carnival celebrations, and iconic landmarks."
          },
          {
            "name": "São Paulo, Brazil",
            "imageUrl": "https://images.unsplash.com/photo-1543059080-f092dca52339?q=80&w=1000&auto=format&fit=crop",
            "description": "The financial hub with diverse culture, arts, and a vibrant nightlife."
          }
        ]
      }
    ],
    "temples": [
      {
        "id": 1,
        "name": "Angkor Wat, Cambodia",
        "imageUrl": "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1000&auto=format&fit=crop",
        "description": "A UNESCO World Heritage site and the largest religious monument in the world."
      },
      {
        "id": 2,
        "name": "Taj Mahal, India",
        "imageUrl": "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop",
        "description": "An iconic symbol of love and a masterpiece of Mughal architecture."
      }
    ],
    "beaches": [
      {
        "id": 1,
        "name": "Bora Bora, French Polynesia",
        "imageUrl": "images/bora_bora.jpg",
        "description": "An island known for its stunning turquoise waters and luxurious overwater bungalows."
      },
      {
        "id": 2,
        "name": "Copacabana Beach, Brazil",
        "imageUrl": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1000&auto=format&fit=crop",
        "description": "A famous beach in Rio de Janeiro, Brazil, with a vibrant atmosphere and scenic views."
      }
    ]
};

// Fetch data from the travel_recommendation_api.json file
async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        travelData = await response.json();
        console.log('Travel data fetched successfully:', travelData);
        
        // Auto-run search if 'search' query param is present
        checkUrlParams();
    } catch (error) {
        console.warn('Network fetch failed (likely CORS/file:// security restrictions). Falling back to embedded travel data.', error);
        travelData = fallbackData;
        
        // Auto-run search if 'search' query param is present
        checkUrlParams();
    }
}

// Initial fetch on load
fetchTravelData();

// Extract and search for URL search parameters (for subpage search redirect)
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchVal = urlParams.get('search');
    if (searchVal && searchInput) {
        searchInput.value = decodeURIComponent(searchVal);
        searchRecommendations();
    }
}

// Search and Recommendation Logic
function searchRecommendations(event) {
    if (event) event.preventDefault();

    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // If on a subpage (no resultsContainer), redirect to home page with search param
    if (!resultsContainer) {
        if (keyword) {
            window.location.href = `index.html?search=${encodeURIComponent(keyword)}`;
        }
        return;
    }

    if (!travelData) {
        console.error('Data not loaded yet');
        return;
    }

    resultsContainer.innerHTML = ''; // Clear previous results

    if (!keyword) return;

    let results = [];

    // 1. Check for generic category keywords (strict check for category plural/singular)
    if (keyword === 'beach' || keyword === 'beaches' || keyword === 'beachs') {
        results = travelData.beaches;
    } else if (keyword === 'temple' || keyword === 'temples') {
        results = travelData.temples;
    } else if (keyword === 'country' || keyword === 'countries') {
        travelData.countries.forEach(country => {
            results = results.concat(country.cities);
        });
    } else {
        // 2. Flexible partial & case-insensitive matching across data
        // Match country names -> include all their cities
        travelData.countries.forEach(country => {
            if (country.name.toLowerCase().includes(keyword)) {
                country.cities.forEach(city => {
                    if (!results.some(r => r.name === city.name)) {
                        results.push(city);
                    }
                });
            } else {
                // Match city names or descriptions
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(keyword) || city.description.toLowerCase().includes(keyword)) {
                        if (!results.some(r => r.name === city.name)) {
                            results.push(city);
                        }
                    }
                });
            }
        });

        // Match temples names or descriptions
        travelData.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(keyword) || temple.description.toLowerCase().includes(keyword)) {
                if (!results.some(r => r.name === temple.name)) {
                    results.push(temple);
                }
            }
        });

        // Match beaches names or descriptions
        travelData.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(keyword) || beach.description.toLowerCase().includes(keyword)) {
                if (!results.some(r => r.name === beach.name)) {
                    results.push(beach);
                }
            }
        });
    }

    if (results.length > 0) {
        displayResults(results);
    } else {
        resultsContainer.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1; font-weight: 500; font-size: 1.1rem; background: rgba(0,0,0,0.4); padding: 20px; border-radius: 12px; backdrop-filter: blur(5px);">No results found. Try searching for "beach", "temple", "Japan", "Sydney", etc.</p>';
    }
}

// Local Time Logic
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
    resultsContainer.innerHTML = '';
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

    // Subtly dim the hero about-header when results are presented
    const aboutHeader = document.querySelector('.about-header');
    if (aboutHeader) aboutHeader.style.opacity = '0.2';
}

// Clear Button Logic
function clearResults() {
    if (searchInput) searchInput.value = '';
    if (resultsContainer) resultsContainer.innerHTML = '';
    const aboutHeader = document.querySelector('.about-header');
    if (aboutHeader) aboutHeader.style.opacity = '1';
    console.log('Results cleared');
}

// Dynamic Custom Notification Modal
function showNotification(title, message) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const content = document.createElement('div');
    content.className = 'modal-card';
    
    content.innerHTML = `
        <h2>${title}</h2>
        <p>${message}</p>
        <button class="btn-primary btn-modal-close">Close</button>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    const closeBtn = content.querySelector('.btn-modal-close');
    closeBtn.focus();
    
    const closeModal = () => {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
}

// Dynamic Booking Modal
function openBookingModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const content = document.createElement('div');
    content.className = 'modal-card booking-modal';
    
    // Create options dynamically
    let destinationOptions = '<option value="">Select a destination</option>';
    if (travelData) {
        travelData.countries.forEach(country => {
            country.cities.forEach(city => {
                destinationOptions += `<option value="${city.name}">${city.name}</option>`;
            });
        });
        travelData.temples.forEach(temple => {
            destinationOptions += `<option value="${temple.name}">${temple.name}</option>`;
        });
        travelData.beaches.forEach(beach => {
            destinationOptions += `<option value="${beach.name}">${beach.name}</option>`;
        });
    } else {
        destinationOptions += `
            <option value="Sydney, Australia">Sydney, Australia</option>
            <option value="Tokyo, Japan">Tokyo, Japan</option>
            <option value="Rio de Janeiro, Brazil">Rio de Janeiro, Brazil</option>
        `;
    }
    
    content.innerHTML = `
        <h2>Book Your Adventure</h2>
        <p>Fill out the form below to start planning your dream vacation.</p>
        <form id="booking-form">
            <div class="form-group-modal">
                <label for="book-name">Full Name</label>
                <input type="text" id="book-name" required placeholder="Enter your full name">
            </div>
            <div class="form-group-modal">
                <label for="book-email">Email Address</label>
                <input type="email" id="book-email" required placeholder="Enter your email">
            </div>
            <div class="form-group-modal">
                <label for="book-destination">Destination</label>
                <select id="book-destination" required>
                    ${destinationOptions}
                </select>
            </div>
            <div class="form-group-modal">
                <label for="book-date">Travel Date</label>
                <input type="date" id="book-date" required>
            </div>
            <div class="booking-modal-buttons">
                <button type="submit" class="btn-primary">Confirm Booking</button>
                <button type="button" class="btn-secondary btn-modal-close">Cancel</button>
            </div>
        </form>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    const closeBtn = content.querySelector('.btn-modal-close');
    const form = content.querySelector('#booking-form');
    
    const closeModal = () => {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('book-name').value.trim();
        const dest = document.getElementById('book-destination').value;
        const date = document.getElementById('book-date').value;
        
        closeModal();
        
        // Show confirmation notification
        setTimeout(() => {
            showNotification(
                'Booking Confirmed!', 
                `Pack your bags, <strong>${name}</strong>! Your trip to <strong>${dest}</strong> on <strong>${date}</strong> has been successfully booked. Check your inbox for confirmation details.`
            );
        }, 350);
    });
}

// Event Listeners (Safe Registration)
if (searchForm) {
    searchForm.addEventListener('submit', searchRecommendations);
}
if (btnClear) {
    btnClear.addEventListener('click', clearResults);
}
if (btnBookNow) {
    btnBookNow.addEventListener('click', openBookingModal);
}

// Contact Form Event Listener
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        
        if (name && email) {
            showNotification(
                'Message Sent!',
                `Thank you, <strong>${name}</strong>! Your message has been received. We will get back to you at <strong>${email}</strong> as soon as possible.`
            );
            contactForm.reset();
        }
    });
}
