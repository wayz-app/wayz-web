import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents, Popup } from 'react-leaflet';import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import polyline from '@mapbox/polyline';
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
        if (!start && !end) {
            const franceBounds = L.latLngBounds(
                [41.3, -5.2], 
                [51.2, 9.9]
            );
            map.fitBounds(franceBounds);
            return;
        }

        if (start && !end) {
            map.setView(start, 6); 
            return;
        }

        if (start && end && route.length === 0) {
            const bounds = L.latLngBounds([start, end]);
            map.fitBounds(bounds, { padding: [80, 80] });
            return;
        }

        if (route.length > 0) {
            try {
                const bounds = L.latLngBounds(route);
                map.fitBounds(bounds, { padding: [80, 80] });
            } catch (err) {
                console.error("Error fitting bounds:", err);
            }
        }
    }, [start, end, route, map]);

    return null;
};

const EventMarkers = ({ events }) => {
    const getEventIcon = (eventType) => {
        let color = '#F44336'; 
        let icon = '⚠️'; 
        
        switch(eventType) {
            // Traffic conditions
            case 'slow_traffic':
                color = '#FFE500'; 
                icon = '🚙'; 
                break;
            case 'heavy_traffic':
                color = '#FF9800'; 
                icon = '🚙'; 
                break;
            case 'standstill_traffic':
                color = '#F44336'; 
                icon = '🚙'; 
                break;
                
            // Crashes
            case 'pile_up_crash':
                color = '#F44336';
                icon = '💥'; 
                break;
                
            // Police
            case 'visible_police':
                color = '#2196F3'; 
                icon = '👮‍♂️';
                break;
            case 'hidden_police':
                color = '#2196F3'; 
                icon = '👮‍♂️'; 
                break;
                
            // Hazards
            case 'construction_hazard':
                color = '#FF9800'; 
                icon = '🚧'; 
                break;
            case 'car_on_shoulder_hazard':
                color = '#FF9800'; 
                icon = '🚘'; 
                break;
            case 'broken_traffic_light_hazard':
                color = '#F44336'; 
                icon = '🚦';
                break;
            case 'pothole_hazard':
                color = '#FF9800'; 
                icon = '⚠️'; 
                break;
            case 'object_hazard':
                color = '#FF9800'; 
                icon = '📦'; 
                break;
            case 'roadkill_hazard':
                color = '#FFE500'; 
                icon = '🦔'; 
                break;
                
            // Blocked lanes
            case 'left_blocked_lane':
                color = '#FF9800'; 
                icon = '⬅️'; 
                break;
            case 'right_blocked_lane':
                color = '#FF9800'; 
                icon = '➡️'; 
                break;
            case 'center_blocked_lane':
                color = '#FF9800'; 
                icon = '⬆️'; 
                break;
                
            // Weather conditions
            case 'slippery_road_weather':
                color = '#2196F3';
                icon = '❄️'; 
                break;
            case 'flooded_road_weather':
                color = '#2196F3'; 
                icon = '💧'; 
                break;
            case 'fog_weather':
                color = '#BDBDBD';
                icon = '☁️'; 
                break;
            case 'icy_road_weather':
                color = '#2196F3'; 
                icon = '🍃'; 
                break;
            
            // Default case (for any unknown event types)
            default:
                color = '#F44336'; 
                icon = '⚠️';
                break;
        }
            
        return L.divIcon({
            className: 'navigation-custom-div-icon',
            html: `
                <div class="navigation-marker-pin navigation-event-pin" style="background-color: ${color};">
                <span class="navigation-event-icon" style="transform: rotate(45deg);">${icon}</span>
                </div>
            `,
            iconSize: [30, 40],
            iconAnchor: [15, 40],
            popupAnchor: [0, -35]
        });
    };

    return (
        <>
            {events.map((event) => (
                <Marker 
                    key={event.id} 
                    position={[event.location.coordinates[1], event.location.coordinates[0]]} 
                    icon={getEventIcon(event.event_type)}
                >
                    <Popup>
                        <div className="navigation-event-popup">
                            <h4>{event.event_type.replace(/_/g, ' ').toUpperCase()}</h4>
                            <p>{event.description}</p>
                            <p className="navigation-event-time">
                                {new Date(event.timestamp).toLocaleString()}
                            </p>
                            <div className="navigation-event-votes">
                                <span className="navigation-event-upvotes">✅ {event.valid_votes}</span>
                                <span className="navigation-event-downvotes">❌ {event.invalid_votes}</span>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
      );
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
    const [allRoutes, setAllRoutes] = useState({});
    const [activeRouteType, setActiveRouteType] = useState('fastest');
    const [events, setEvents] = useState([]);
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
    
        try {
            const coordinates = [
                [start[1], start[0]], 
                [end[1], end[0]]
            ];
    
            const fastestResponse = await axios.post(
                'https://api.openrouteservice.org/v2/directions/driving-car',
                {
                    coordinates: coordinates,
                    preference: "fastest"
                },
                {
                    headers: {
                        'Authorization': apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, application/geo+json'
                    }
                }
            );
    
            const shortestResponse = await axios.post(
                'https://api.openrouteservice.org/v2/directions/driving-car',
                {
                    coordinates: coordinates,
                    preference: "shortest"
                },
                {
                    headers: {
                        'Authorization': apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, application/geo+json'
                    }
                }
            );
    
            const noTollsResponse = await axios.post(
                'https://api.openrouteservice.org/v2/directions/driving-car',
                {
                    coordinates: coordinates,
                    preference: "fastest",
                    options: {
                        avoid_features: ["tollways"]
                    }
                },
                {
                    headers: {
                        'Authorization': apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, application/geo+json'
                    }
                }
            );
    
            const routes = {};
        
            if (fastestResponse.data?.routes?.[0]) {
                const coords = parseRouteGeometry(fastestResponse.data.routes[0].geometry);
                routes.fastest = {
                    coordinates: coords,
                    summary: fastestResponse.data.routes[0].summary,
                    type: 'fastest'
                };
            }
        
            if (shortestResponse.data?.routes?.[0]) {
                const coords = parseRouteGeometry(shortestResponse.data.routes[0].geometry);
                routes.shortest = {
                    coordinates: coords,
                    summary: shortestResponse.data.routes[0].summary,
                    type: 'shortest'
                };
            }
        
            if (noTollsResponse.data?.routes?.[0]) {
                const coords = parseRouteGeometry(noTollsResponse.data.routes[0].geometry);
                routes.noTolls = {
                    coordinates: coords,
                    summary: noTollsResponse.data.routes[0].summary,
                    type: 'no tolls'
                };
            }
        
            const defaultRoute = routes.fastest || routes.shortest || routes.noTolls;
        
            if (defaultRoute) {
                setRoute(defaultRoute.coordinates);
                setSummary({
                    ...defaultRoute.summary,
                    routeType: defaultRoute.type
                });
                setAllRoutes(routes);
                setActiveRouteType(defaultRoute.type);
            } else {
                setError("No routes found between these locations");
            }
        
            setLoading(false);
        } catch (error) {
            console.error('Error fetching routes:', error);
            setError("Sorry the route for this destination is not available.");
            setLoading(false);
        }
    };
      
    const parseRouteGeometry = (geometry) => {
        if (Array.isArray(geometry)) {
            return geometry.map(([lng, lat]) => [lat, lng]);
        }
        
        if (typeof geometry === 'string') {
            try {
                return polyline.decode(geometry);
            } catch (error) {
                console.error('Error decoding polyline:', error);
                return [];
            }
        }
        
        return [];
    }
      
    const switchRoute = (routeType) => {
        if (allRoutes[routeType]) {
            setRoute(allRoutes[routeType].coordinates);
            setSummary({
                ...allRoutes[routeType].summary,
                routeType
            });
            setActiveRouteType(routeType);
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

    const fetchEvents = async () => {        
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
            if (response.data) {
                setEvents(response.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

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

                {(Object.keys(allRoutes).length > 0 && summary) && (
                    <div className='navigation-route-types-summary-container'>
                        {Object.keys(allRoutes).length > 0 && (
                            <div className="navigation-route-types">
                                <h3>Route Options</h3>
                                <div className="navigation-route-tabs">
                                {allRoutes.fastest && (
                                    <button 
                                    className={`navigation-route-tab ${activeRouteType === 'fastest' ? 'active' : ''}`}
                                    onClick={() => switchRoute('fastest')}
                                    >
                                    <span className="navigation-route-icon">⚡</span>
                                    Fastest
                                    </button>
                                )}
                                {allRoutes.shortest && (
                                    <button 
                                    className={`navigation-route-tab ${activeRouteType === 'shortest' ? 'active' : ''}`}
                                    onClick={() => switchRoute('shortest')}
                                    >
                                    <span className="navigation-route-icon">📏</span>
                                    Shortest
                                    </button>
                                )}
                                {allRoutes.noTolls && (
                                    <button 
                                    className={`navigation-route-tab ${activeRouteType === 'noTolls' ? 'active' : ''}`}
                                    onClick={() => switchRoute('noTolls')}
                                    >
                                    <span className="navigation-route-icon">💸</span>
                                    No Tolls
                                    </button>
                                )}
                                </div>
                            </div>
                        )}

                        {summary && (
                            <div className="navigation-route-summary-container">
                                <div className="navigation-route-summary">
                                    <div className="navigation-summary-header">
                                        <h3>Route Summary</h3>
                                        {summary.routeType && (
                                            <span className="navigation-route-type-badge">
                                                {summary.routeType === 'fastest' && '⚡ Fastest'}
                                                {summary.routeType === 'shortest' && '📏 Shortest'} 
                                                {summary.routeType === 'noTolls' && '💸 No Tolls'}
                                            </span>
                                        )}
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
                    </div>
                )}

                <div className="navigation-map-wrapper">
                    <MapContainer 
                        key={mapKey}
                        center={[46.2, 2.2]}
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
                        <EventMarkers events={events} />
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