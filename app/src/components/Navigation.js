import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import '../css/Navigation.css';
import Footer from './Footer';
import Header from './Header';

const Navigation = () => {
    const [start, setStart] = useState([48.8566, 2.3522]); // Paris (par défaut)
    const [end, setEnd] = useState([48.8584, 2.2945]); // Tour Eiffel (par défaut)
    const [route, setRoute] = useState([]);
    const [startInput, setStartInput] = useState('');
    const [endInput, setEndInput] = useState('');
    const [suggestions, setSuggestions] = useState({ start: [], end: [] });

    const apiKey = process.env.REACT_APP_ORS_API_KEY;

    // Fonction pour récupérer l'itinéraire
    const getRoute = async () => {
    const apiKey = process.env.REACT_APP_ORS_API_KEY;

    // ⚠️ ORS attend l'ordre: longitude, latitude
    const startCoords = `${start[1]},${start[0]}`;
    const endCoords = `${end[1]},${end[0]}`;

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoords}&end=${endCoords}`;

    console.log("Requesting route from:", start, "to:", end);
    console.log("Request URL:", url); // ✅ Debug

    try {
        const response = await axios.get(url);

        if (!response.data.routes || response.data.routes.length === 0) {
            console.error('No route found:', response.data);
            alert("No route found. Try different locations.");
            return;
        }

        // ✅ Convertir en Leaflet format
        const coordinates = response.data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
        setRoute(coordinates);
        console.log("Route coordinates:", coordinates);
    } catch (error) {
        console.error('Error fetching route:', error);
        alert("An error occurred while fetching the route.");
    }
};

    // Fonction pour récupérer les suggestions de lieux
    const fetchSuggestions = async (query, type) => {
        if (!query) return;

        const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${query}&size=5`;

        try {
            const response = await axios.get(url);
            const results = response.data.features.map((feature) => ({
                name: feature.properties.label,
                coords: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
            }));

            setSuggestions(prev => ({
                ...prev,
                [type]: results
            }));
        } catch (error) {
            console.error('Error fetching location suggestions:', error);
        }
    };

    // Fonction pour sélectionner une suggestion
    const selectLocation = (name, coords, type) => {
        if (type === 'start') {
            setStart(coords);
            setStartInput(name);
            setSuggestions(prev => ({ ...prev, start: [] }));
        } else {
            setEnd(coords);
            setEndInput(name);
            setSuggestions(prev => ({ ...prev, end: [] }));
        }
    };

    return (
        <>
            <Header />
            <div className="navigate-content">
                <h1>🚗 Navigation</h1>
                <p>Plan your route from the starting point to your destination.</p>

                {/* Champs de recherche */}
                <div className="search-container">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Enter start location"
                            value={startInput}
                            onChange={(e) => {
                                setStartInput(e.target.value);
                                fetchSuggestions(e.target.value, 'start');
                            }}
                        />
                        {suggestions.start.length > 0 && (
                            <div className="suggestions">
                                {suggestions.start.map((item, index) => (
                                    <div key={index} className="suggestion" onClick={() => selectLocation(item.name, item.coords, 'start')}>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Enter destination"
                            value={endInput}
                            onChange={(e) => {
                                setEndInput(e.target.value);
                                fetchSuggestions(e.target.value, 'end');
                            }}
                        />
                        {suggestions.end.length > 0 && (
                            <div className="suggestions">
                                {suggestions.end.map((item, index) => (
                                    <div key={index} className="suggestion" onClick={() => selectLocation(item.name, item.coords, 'end')}>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Carte avec itinéraire */}
                <MapContainer center={start} zoom={13} className="map-container">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    <Marker position={start} />
                    <Marker position={end} />
                    {route.length > 0 && <Polyline positions={route} color="blue" />}
                    <MapClickHandler setStart={setStart} setEnd={setEnd} />
                </MapContainer>

                <div className="route-actions">
                    <button onClick={getRoute}>Generate Route</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

// Composant pour gérer les clics sur la carte
const MapClickHandler = ({ setStart, setEnd }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            setStart(prev => prev.length === 0 ? [lat, lng] : prev);
            setEnd(prev => prev.length === 0 ? [lat, lng] : prev);
        },
    });

    return null;
};

export default Navigation;