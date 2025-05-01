import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import '../css/Navigation.css';
import Footer from './Footer';
import Header from './Header';
import { QRCodeSVG } from 'qrcode.react'; // Import QR code library

// Fonction pour formater la durée en jours, heures et minutes
const formatDuration = (seconds) => {
    // Calculer les jours, heures et minutes
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    
    const minutes = Math.floor(seconds / 60);
    
    // Construire la chaîne de texte en fonction des valeurs
    let durationString = "";
    
    if (days > 0) {
        durationString += `${days} day${days > 1 ? 's' : ''} `;
    }
    
    if (hours > 0 || days > 0) {
        durationString += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    
    if (minutes > 0 || hours > 0 || days > 0) {
        durationString += `${minutes} min`;
    }
    
    return durationString.trim();
};

const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconAnchor: [12, 41], // pour centrer correctement
});

L.Marker.prototype.options.icon = defaultIcon;

const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const endIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const FitBounds = ({ start, end, route }) => {
    const map = useMap();

    useEffect(() => {
        if (!start || !end || route.length === 0) return;

        const bounds = L.latLngBounds(route);
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [start, end, route, map]);

    return null;
};

const Navigation = () => {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [route, setRoute] = useState([]);
    const [startInput, setStartInput] = useState('');
    const [endInput, setEndInput] = useState('');
    const [suggestions, setSuggestions] = useState({ start: [], end: [] });
    const [summary, setSummary] = useState(null);

    const apiKey = process.env.REACT_APP_ORS_API_KEY;

    // Fonction pour récupérer l'itinéraire
    const getRoute = async () => {
        const apiKey = process.env.REACT_APP_ORS_API_KEY;
    
        const startCoords = `${start[1]},${start[0]}`;
        const endCoords = `${end[1]},${end[0]}`;
    
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoords}&end=${endCoords}`;
    
        try {
            const response = await axios.get(url);
            const coordinates = response.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            const summary = response.data.features[0].properties.summary;
            setRoute(coordinates);
            setSummary(summary); 
        } catch (error) {
            console.error('Error fetching route:', error);
            alert("An error occurred while fetching the route.");
        }
    };

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

    const selectLocation = (name, coords, type) => {
        setRoute([]); 
    
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
            <div className="navigation-navigate-content">
                <h1>🚗 Navigation</h1>
                <p>Plan your route from the starting point to your destination.</p>

                {/* Champs de recherche */}
                <div className="navigation-search-container">
                    <div className="navigation-search-box">
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
                            <div className="navigation-suggestions">
                                {suggestions.start.map((item, index) => (
                                    <div key={index} className="navigation-suggestion" onClick={() => selectLocation(item.name, item.coords, 'start')}>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="navigation-search-box">
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
                            <div className="navigation-suggestions">
                                {suggestions.end.map((item, index) => (
                                    <div key={index} className="navigation-suggestion" onClick={() => selectLocation(item.name, item.coords, 'end')}>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="navigation-route-actions">
                        <button onClick={getRoute}>Generate Route</button>
                    </div>
                </div>

                {summary && (
                    <div className="navigation-route-summary-container">
                        <div className="navigation-route-summary">
                            <h3>📝 Route Summary</h3>
                            <div className="navigation-route-summary-paragraphs">
                                <p><strong>Distance:</strong> {(summary.distance / 1000).toFixed(1)} km</p>
                                <p><strong>Duration:</strong> {formatDuration(summary.duration)}</p>
                            </div>
                        </div>
                        <div className="navigation-qr-code">
                            <QRCodeSVG 
                                value="https://www.google.com" 
                                size={128} 
                                bgColor="#ffffff" 
                                fgColor="#000000" 
                                level="L" 
                                includeMargin={false}
                            />
                        </div>
                    </div>
                )}

                <MapContainer center={[46.6031, 1.8883]} zoom={6} className="navigation-map-container">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    {start && <Marker position={start} icon={startIcon} />}
                    {end && <Marker position={end} icon={endIcon} />}
                    {route.length > 0 && <Polyline positions={route} color="blue" />}
                    <MapClickHandler setStart={setStart} setEnd={setEnd} />
                    <FitBounds start={start} end={end} route={route} />
                </MapContainer>
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