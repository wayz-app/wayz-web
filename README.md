# Wayz Web

Wayz Web is the web user interface for the Wayz app, a community-driven GPS navigation solution inspired by Waze. This React app allows users to plan routes, view traffic events reported by the community, and share routes with the mobile app via QR codes.

## Features

- **Route planning** with multiple options (faster, shorter, toll-free)
- **Real-time visualization** of road events (traffic, accidents, hazards, etc.)
- **Route sharing** via QR codes for the mobile app
- **Custom dashboard** to track your contributions
- **Community statistics** and high-density event areas

## Tech Stack

- **React** - JavaScript framework for the user interface
- **Leaflet** - Interactive mapping library
- **Axios** - HTTP client for API calls
- **React Router** - Route and navigation management
- **Docker** - Containerization for development and deployment

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.

## Development

1. Clone the repository
```bash
git clone https://github.com/wayz-app/wayz-web.git
cd wayz-web/app
```

2. Create a .env file at the root (use the .env.example file as an example) to insert your information :
```bash
REACT_APP_API_URL=http://localhost:8000 
REACT_APP_ORS_API_KEY=5b3ce3597851110001cf6248e9095669c4e345e8b17826953808d978
```

2. Create and Launch the Container
```bash
docker-compose up --build
```

The application will be accessible at http://localhost:3000.