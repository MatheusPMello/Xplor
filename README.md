# TravelEase

![TravelEase Home](screenshots/home.png)

Welcome to **TravelEase**, your ultimate portal to explore dream destinations. Discover the world's most breathtaking places with our curated selection of travel experiences. From pristine beaches to majestic mountains, we have something for every adventurer.

## 🌟 Features

*   **Destination Search:** Easily search for your next getaway using keywords (e.g., "beach", "temples", "countries") directly from the navigation bar.
*   **Dynamic Recommendations:** View detailed destination cards featuring beautiful images, descriptions, and the current **local time** for that location.
*   **Modern & Responsive UI:** A clean, glassmorphism-inspired design with a stunning hero background that looks great on any screen.
*   **About Us:** Get to know our team of travel enthusiasts dedicated to helping you experience the joy of travel.
*   **Contact Form:** A sleek contact page to get in touch with us for any inquiries or assistance.

## 📸 Screenshots

### Search Results & Destinations
![Destinations](screenshots/destinations.png)

### About Us
![About Us](screenshots/about.png)

### Contact Us
![Contact Us](screenshots/contact.png)

## 🛠️ Technology Stack

This project is built using core web technologies:
*   **HTML5:** Structured semantic markup for all pages (`index.html`, `about.html`, `contact.html`).
*   **CSS3:** Custom styling in `style.css` featuring modern design aesthetics like glassmorphism and flexbox/grid layouts.
*   **JavaScript:** Vanilla JS in `travel_recommendation.js` for handling the search logic, fetching data, and computing local times dynamically.
*   **JSON Data:** Recommendations are driven by a local API mock file (`travel_recommendation_api.json`).

## 🚀 Getting Started

To run this project locally:

1.  Clone the repository or download the source code.
2.  Open the project folder.
3.  Since it uses vanilla web technologies and fetches a local JSON file, it is recommended to serve it via a local web server to avoid CORS issues with the `fetch` API.
    *   *Using VS Code:* Install the **Live Server** extension and click "Go Live".
    *   *Using Python:* Run `python -m http.server 8000` in the terminal and navigate to `http://localhost:8000`.
    *   *Using Node.js:* Run `npx serve` in the terminal.
4.  Navigate to the site and start searching for your next adventure!

## 📁 Project Structure

```text
Xplor/
├── index.html                       # Home page
├── about.html                       # About Us page
├── contact.html                     # Contact page
├── style.css                        # Global stylesheet
├── travel_recommendation.js         # Main JavaScript logic (search, time, UI updates)
├── travel_recommendation_api.json   # Mock database containing destination info
└── images/                          # Project assets (icons, destination photos)
```

## 📝 Note on Screenshots
*Please place the provided screenshots (Home, Destinations, About Us, Contact Us) into a `screenshots/` directory at the root of the project to display them properly in this README.*
