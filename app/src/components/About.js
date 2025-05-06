import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/About.css';
import Header from '../components/Header'; 
import Footer from '../components/Footer';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';

const About = () => {
    const [statistics, setStatistics] = useState({
        eventTypes: { total_events: 0, frequencies: [] },
        locationDensity: { points: [], total_locations: 0 },
        topLocations: { locations: [] },
        topReporters: { reporters: [] },
        hotspots: { hotspots: [] }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState([48.8566, 2.3522]); 

    const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8884d8', '#82ca9d', '#0088FE', '#00C49F'];
    const USER_COLORS = ['#4299E1', '#48BB78', '#ED8936', '#9F7AEA', '#ED64A6'];

    const formatReportName = (name) => {
        return name.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getAvatarLetter = (username) => {
        if (!username) return '?';
        return username.charAt(0).toUpperCase();
    };

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.REACT_APP_API_URL;

                const requests = [
                    axios.get(`${apiUrl}/statistic/event-types`).catch(e => ({ data: { total_events: 0, frequencies: [] } })),
                    axios.get(`${apiUrl}/statistic/location-density`).catch(e => ({ data: { points: [], total_locations: 0 } })),
                    axios.get(`${apiUrl}/statistic/top-locations`).catch(e => ({ data: { locations: [] } })),
                    axios.get(`${apiUrl}/statistic/top-reporters`).catch(e => ({ data: { reporters: [] } })),
                    axios.get(`${apiUrl}/statistic/hotspots`).catch(e => ({ data: { hotspots: [] } }))
                ];

                const responses = await Promise.all(requests);

                const [eventTypesRes, locationDensityRes, topLocationsRes, topReportersRes, hotspotsRes] = responses;

                const stats = {
                    eventTypes: eventTypesRes.data,
                    locationDensity: locationDensityRes.data,
                    topLocations: topLocationsRes.data,
                    topReporters: topReportersRes.data || { reporters: [] },
                    hotspots: hotspotsRes.data
                };

                setStatistics(stats);
                
                if (stats.hotspots.hotspots && stats.hotspots.hotspots.length > 0 && 
                    stats.hotspots.hotspots[0].center && stats.hotspots.hotspots[0].center.length === 2) {
                    setMapCenter([stats.hotspots.hotspots[0].center[1], stats.hotspots.hotspots[0].center[0]]);
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching statistics:", err);
                setError("Failed to load statistics. Please try again later.");
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const getMaxReports = () => {
        if (!statistics.topReporters || !statistics.topReporters.reporters || statistics.topReporters.reporters.length === 0) {
            return 1; 
        }
        return Math.max(...statistics.topReporters.reporters.map(reporter => reporter.event_count || 0));
    };

    const maxReports = getMaxReports();

    return (
        <>
            <Header />

            <div className="about-container">
                <h1 className="about-title">About Wayz</h1>
                <p className="about-description">
                    At <strong>Wayz</strong>, we believe in making every journey <strong>smarter, faster, and stress-free</strong>.
                    Whether you're commuting, traveling, or navigating a new city, our real-time GPS
                    app ensures you reach your destination efficiently.
                </p>

                {/* Core Information */}
                <div className="about-grid">
                    <div className="about-item">
                        <h3>Interactive Maps</h3>
                        <p>Navigate <span className="about-value">smarter</span> with real-time traffic insights.</p>
                    </div>
                    <div className="about-item">
                        <h3>Alert in One Click</h3>
                        <p>Keep everyone <span className="about-value">safe</span> by sharing road updates.</p>
                    </div>
                    <div className="about-item">
                        <h3>Optimize Driving</h3>
                        <p>Analyze your routes for a <span className="about-value">smoother</span> driving experience.</p>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="about-statistics-section">
                    <h2 className="about-section-title">Community Impact</h2>
                    
                    {loading ? (
                        <div className="about-statistics-loading">
                            <div className="about-loading-spinner"></div>
                            <p>Loading statistics...</p>
                        </div>
                    ) : error ? (
                        <div className="about-statistics-error">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="about-statistics-container">
                            {/* Row 1: Key Metrics */}
                            <div className="about-statistics-row">
                                <div className="about-stat-card about-total-reports">
                                    <h3>Total Reports</h3>
                                    <div className="about-stat-value">{statistics.eventTypes.total_events}</div>
                                    <p>community alerts shared</p>
                                </div>
                                <div className="about-stat-card about-total-locations">
                                    <h3>Locations Covered</h3>
                                    <div className="about-stat-value">{statistics.locationDensity.total_locations}</div>
                                    <p>unique areas monitored</p>
                                </div>
                            </div>
                            
                            {/* Row 2: Charts and Map */}
                            <div className="about-statistics-row">
                                {/* Report Types */}
                                <div className="about-stat-card about-event-types">
                                    <h3>Report Types</h3>
                                    {statistics.eventTypes.frequencies && statistics.eventTypes.frequencies.length > 0 ? (
                                        <div className="about-report-types-list">
                                            {statistics.eventTypes.frequencies.map((item, index) => (
                                                <div key={index} className="about-report-type-item">
                                                    <div className="about-report-type-header">
                                                        <div className="about-report-type-dot" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                                                        <div className="about-report-type-name">{formatReportName(item.event_type)}</div>
                                                    </div>
                                                    <div className="about-report-type-bar-container">
                                                        <div 
                                                            className="about-report-type-bar" 
                                                            style={{
                                                                width: `${item.percentage}%`, 
                                                                backgroundColor: COLORS[index % COLORS.length]
                                                            }}
                                                        ></div>
                                                        <div className="about-report-type-value">{item.count} ({item.percentage.toFixed(1)}%)</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="about-no-data-message">No report type data available</div>
                                    )}
                                </div>

                                {/* Top Reporters */}
                                <div className="about-stat-card top-reporters">
                                    <h3>Top Contributors</h3>
                                    {statistics.topReporters && statistics.topReporters.reporters && statistics.topReporters.reporters.length > 0 ? (
                                        <div className="about-reporters-list">
                                            {statistics.topReporters.reporters.slice(0, 5).map((reporter, index) => (
                                                <div key={index} className="about-reporter-item">
                                                    <div className="about-reporter-header">
                                                        <div className="about-reporter-avatar" style={{ backgroundColor: USER_COLORS[index % USER_COLORS.length] }}>
                                                            {getAvatarLetter(reporter.username)}
                                                        </div>
                                                        <div className="about-reporter-name">{reporter.username || 'Anonymous User'}</div>
                                                    </div>
                                                    <div className="about-reporter-bar-container">
                                                        <div 
                                                            className="about-reporter-bar" 
                                                            style={{
                                                                width: `${maxReports > 0 ? ((reporter.event_count || 0) / maxReports) * 100 : 0}%`, 
                                                                backgroundColor: USER_COLORS[index % USER_COLORS.length]
                                                            }}
                                                        ></div>
                                                        <div className="about-reporter-value">{reporter.event_count || 0} reports</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="about-no-data-message">No contributor data available</div>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Alert Hotspots Map */}
                            <div className="about-statistics-row map-row">
                                <div className="about-stat-card hotspots">
                                    <h3>Alert Hotspots</h3>
                                    {statistics.hotspots.hotspots && statistics.hotspots.hotspots.length > 0 ? (
                                        <div className="about-hotspots-map-container">
                                            <MapContainer 
                                                center={mapCenter} 
                                                zoom={10} 
                                                style={{ height: '100%', width: '100%', borderRadius: '8px', margin: 0 }}
                                                zoomControl={true}
                                                attributionControl={true}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution="&copy; OpenStreetMap contributors"
                                                />
                                                
                                                {statistics.hotspots.hotspots.map((hotspot, index) => {
                                                    if (!hotspot.center || hotspot.center.length !== 2 || hotspot.radius <= 0) {
                                                        return null;
                                                    }
                                                    
                                                    const position = [hotspot.center[1], hotspot.center[0]];
                                                    
                                                    return (
                                                        <Circle
                                                            key={index}
                                                            center={position}
                                                            radius={hotspot.radius * 1000} 
                                                            pathOptions={{
                                                                fillColor: COLORS[index % COLORS.length],
                                                                fillOpacity: 0.5,
                                                                color: COLORS[index % COLORS.length],
                                                                weight: 1
                                                            }}
                                                        >
                                                            <Tooltip direction="top" permanent>
                                                                <div>
                                                                    <strong>Area {index + 1}</strong><br />
                                                                    {hotspot.event_count} alerts<br />
                                                                    {hotspot.radius.toFixed(2)} km radius
                                                                </div>
                                                            </Tooltip>
                                                        </Circle>
                                                    );
                                                })}
                                            </MapContainer>
                                        </div>
                                    ) : (
                                        <div className="about-no-data-message">No hotspots detected yet</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default About;