import { useState, useEffect } from 'react';
import { FaGlobeAmericas, FaExclamationTriangle, FaClock, FaMapMarkerAlt, FaFire, FaBolt, FaWater, FaMountain } from 'react-icons/fa';

const DisasterFeed = () => {
    const [disasters, setDisasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDisasters();
        // Refresh every 10 minutes
        const interval = setInterval(fetchDisasters, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchDisasters = async () => {
        try {
            // Fetch from NASA EONET - Multiple disaster types
            const eonetResponse = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=20&status=open');
            const eonetData = await eonetResponse.json();

            // Process events
            const events = eonetData.events
                .map(event => {
                    const category = event.categories[0]?.title || 'Unknown';
                    const coords = event.geometry[0]?.coordinates || [0, 0];
                    const magnitude = event.geometry[0]?.magnitudeValue || null;

                    return {
                        id: event.id,
                        title: event.title,
                        category: category,
                        magnitude: magnitude,
                        source: event.sources[0]?.id || 'NASA',
                        time: new Date(event.geometry[0]?.date || event.updated),
                        coords: coords,
                        url: event.sources[0]?.url || `https://eonet.gsfc.nasa.gov/api/v3/events/${event.id}`,
                        type: getCategoryType(category)
                    };
                })
                .sort((a, b) => b.time - a.time)
                .slice(0, 15); // Show top 15

            setDisasters(events);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch disasters:', err);
            setError('Unable to load disaster feed');
            setLoading(false);
        }
    };

    const getCategoryType = (category) => {
        const lower = category.toLowerCase();
        if (lower.includes('wildfire') || lower.includes('fire')) return 'wildfire';
        if (lower.includes('storm') || lower.includes('cyclone') || lower.includes('hurricane')) return 'storm';
        if (lower.includes('flood')) return 'flood';
        if (lower.includes('volcano')) return 'volcano';
        if (lower.includes('earthquake')) return 'earthquake';
        return 'other';
    };

    const getDisasterIcon = (type) => {
        switch (type) {
            case 'wildfire': return <FaFire className="text-orange-500" />;
            case 'storm': return <FaBolt className="text-yellow-500" />;
            case 'flood': return <FaWater className="text-blue-500" />;
            case 'volcano': return <FaMountain className="text-red-500" />;
            case 'earthquake': return <FaExclamationTriangle className="text-red-500" />;
            default: return <FaExclamationTriangle className="text-gray-500" />;
        }
    };

    const getDisasterColor = (type) => {
        switch (type) {
            case 'wildfire': return 'border-orange-500/30 bg-orange-500/10';
            case 'storm': return 'border-yellow-500/30 bg-yellow-500/10';
            case 'flood': return 'border-blue-500/30 bg-blue-500/10';
            case 'volcano': return 'border-red-500/30 bg-red-500/10';
            case 'earthquake': return 'border-red-600/30 bg-red-600/10';
            default: return 'border-gray-500/30 bg-gray-500/10';
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);

        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return `${Math.floor(seconds / 604800)}w ago`;
    };

    const getDisasterDescription = (type, title) => {
        const lowerTitle = title.toLowerCase();

        // Extract magnitude for earthquakes
        const magMatch = title.match(/M\s*(\d+\.\d+)/);
        const magnitude = magMatch ? parseFloat(magMatch[1]) : null;

        switch (type) {
            case 'wildfire':
                return 'Active wildfire burning vegetation. Monitor air quality, stay indoors if nearby, and follow evacuation orders.';
            case 'storm':
                return 'Severe weather system with potential for high winds, heavy rainfall, and flooding. Stay indoors and secure loose objects.';
            case 'flood':
                return 'Rising water levels threatening communities. Avoid flood-prone areas and low-lying regions. Do not drive through flooded roads.';
            case 'volcano':
                return 'Volcanic activity detected. Potential for ash fall, lava flows, and air quality issues. Follow official evacuation warnings.';
            case 'earthquake':
                if (magnitude) {
                    if (magnitude >= 7.0) return `Major earthquake (M${magnitude}) - Expect severe damage and widespread destruction. Seek immediate shelter.`;
                    if (magnitude >= 6.0) return `Strong earthquake (M${magnitude}) - Potential for significant damage in populated areas. Drop, cover, and hold on.`;
                    if (magnitude >= 5.0) return `Moderate earthquake (M${magnitude}) - May cause damage to buildings and infrastructure. Be prepared for aftershocks.`;
                    return `Light earthquake (M${magnitude}) - Generally felt but causes minimal damage. Stay alert for aftershocks.`;
                }
                return 'Seismic activity reported. Stay away from damaged structures and be prepared for aftershocks.';
            default:
                return 'Natural disaster event in progress. Monitor official channels and follow safety protocols.';
        }
    };

    if (loading) {
        return (
            <div className="h-full bg-[#0d0d0d] border-l border-white/5 p-4 flex items-center justify-center">
                <div className="text-gray-500 text-sm">Loading feed...</div>
            </div>
        );
    }

    return (
        <div className="h-full bg-[#0d0d0d] border-l border-white/5 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <FaGlobeAmericas className="text-blue-400" />
                    <h3 className="font-bold text-white text-sm">Live Disaster Feed</h3>
                </div>
                <p className="text-xs text-gray-500">Real-time natural disasters worldwide �</p>
            </div>

            {/* Feed List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {error ? (
                    <div className="p-4 text-center text-red-400 text-xs">{error}</div>
                ) : disasters.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-xs">No active disasters</div>
                ) : (
                    <div className="space-y-2 p-3">
                        {disasters.map((event) => (
                            <div
                                key={event.id}
                                className="bg-[#171717] border border-white/5 rounded-xl p-3 hover:bg-[#1f1f1f] transition-colors cursor-pointer group"
                                onClick={() => window.open(event.url, '_blank')}
                            >
                                {/* Category Badge */}
                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold border mb-2 ${getDisasterColor(event.type)}`}>
                                    {getDisasterIcon(event.type)}
                                    <span className="capitalize">{event.category}</span>
                                </div>

                                {/* Title/Location */}
                                <div className="flex items-start gap-2 mb-2">
                                    <FaMapMarkerAlt className="text-gray-500 text-xs mt-0.5 flex-shrink-0" />
                                    <p className="text-white text-xs font-medium leading-tight group-hover:text-blue-300 transition-colors line-clamp-2">
                                        {event.title}
                                    </p>
                                </div>

                                {/* Description Box */}
                                <div className="bg-white/5 rounded-lg p-2.5 mb-2 border border-white/5">
                                    <p className="text-[10px] text-gray-300 leading-relaxed">
                                        {getDisasterDescription(event.type, event.title)}
                                    </p>
                                </div>

                                {/* Time & Source */}
                                <div className="flex items-center justify-between text-[10px] text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <FaClock />
                                        <span>{getTimeAgo(event.time)}</span>
                                    </div>
                                    <span className="text-gray-600">{event.source}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/5">
                <div className="text-[10px] text-gray-600 text-center">
                    Data: NASA EONET
                </div>
            </div>
        </div>
    );
};

export default DisasterFeed;
