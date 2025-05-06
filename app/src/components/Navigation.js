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
import { QRCodeSVG } from 'qrcode.react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIconPng,
    iconRetinaUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const formatDuration = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    
    const minutes = Math.floor(seconds / 60);
    
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

const startIcon = L.divIcon({
    className: 'navigation-custom-div-icon',
    html: `
        <div class="navigation-marker-pin navigation-marker-pin-start">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="white">
                <path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5 2.5,1.12 2.5,2.5 -1.12,2.5 -2.5,2.5z"/>
            </svg>
        </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
});

const endIcon = L.divIcon({
    className: 'navigation-custom-div-icon',
    html: `
        <div class="navigation-marker-pin navigation-marker-pin-end">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="white">
                <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
            </svg>
        </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
});

const FitBounds = ({ start, end, route }) => {
    const map = useMap();

    useEffect(() => {
        if (!start || !end || route.length === 0) return;

        try {
            const bounds = L.latLngBounds(route);
            map.fitBounds(bounds, { padding: [50, 50] });
        } catch (err) {
            console.error("Error fitting bounds:", err);
        }
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
    const mapKey = Date.now();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiKey = process.env.REACT_APP_ORS_API_KEY;

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                if (!start) {
                    setStart([lat, lng]);
                    setStartInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                } else if (!end) {
                    setEnd([lat, lng]);
                    setEndInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                }
            },
        });
        return null;
    };

    const getRoute = async () => {
        if (!start || !end) {
            setError("Please select both start and destination points");
            return;
        }

        setLoading(true);
        setError('');

        const startCoords = `${start[1]},${start[0]}`;
        const endCoords = `${end[1]},${end[0]}`;
    
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoords}&end=${endCoords}`;
    
        try {
            const response = await axios.get(url);
            const coordinates = response.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            const summary = response.data.features[0].properties.summary;
            setRoute(coordinates);
            setSummary(summary); 
            setLoading(false);
        } catch (error) {
            console.error('Error fetching route:', error);
            setError("An error occurred while fetching the route. Please try again.");
            setLoading(false);
        }
    };

    const fetchSuggestions = async (query, type) => {
        if (!query) {
            setSuggestions(prev => ({ ...prev, [type]: [] }));
            return;
        }

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
                                    <div 
                                        key={index} 
                                        className="navigation-suggestion" 
                                        onClick={() => selectLocation(item.name, item.coords, 'start')}
                                    >
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
                                    <div 
                                        key={index} 
                                        className="navigation-suggestion" 
                                        onClick={() => selectLocation(item.name, item.coords, 'end')}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="navigation-route-actions">
                        <button onClick={getRoute} disabled={loading}>
                            {loading ? 'Calculating...' : 'Generate Route'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="navigation-error">
                        <p>{error}</p>
                    </div>
                )}

                {summary && (
                    <div className="navigation-route-summary-container">
                        <div className="navigation-route-summary">
                            <div className="navigation-summary-header">
                                <h3>Route Summary</h3>
                            </div>
                            <div className="navigation-summary-body">
                                <div className="navigation-summary-item">
                                    <div className="navigation-summary-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#1b1b83">
                                            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
                                        </svg>
                                    </div>
                                    <div className="navigation-summary-item-content">
                                        <span className="navigation-summary-label">Distance</span>
                                        <span className="navigation-summary-value">{(summary.distance / 1000).toFixed(1)} km</span>
                                    </div>
                                </div>
                                <div className="navigation-summary-item">
                                    <div className="navigation-summary-item-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#1b1b83">
                                            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                                        </svg>
                                    </div>
                                    <div className="navigation-summary-item-content">
                                        <span className="navigation-summary-label">Duration</span>
                                        <span className="navigation-summary-value">{formatDuration(summary.duration)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="navigation-qr-code">
                            <div className="navigation-qr-header">
                                <h3>Share Route</h3>
                            </div>
                            <div className="navigation-qr-container">
                                <QRCodeSVG 
                                    value={`https://www.google.com/maps/dir/?api=1&origin=${start?.[0]},${start?.[1]}&destination=${end?.[0]},${end?.[1]}`}
                                    size={140} 
                                    bgColor="#ffffff" 
                                    fgColor="#000000" 
                                    level="L" 
                                    includeMargin={false}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="navigation-map-wrapper">
                    <MapContainer 
                        key={mapKey}
                        center={[46.6031, 1.8883]} 
                        zoom={6} 
                        style={{ height: '100%', width: '100%' }}
                        className="navigation-map-container"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        {start && <Marker position={start} icon={startIcon} />}
                        {end && <Marker position={end} icon={endIcon} />}
                        {route.length > 0 && <Polyline positions={route} color="#1b1b83" weight={5} opacity={0.7} />}
                        <MapClickHandler />
                        <FitBounds start={start} end={end} route={route} />
                    </MapContainer>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Navigation;