import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { Search, Filter, Map as MapIcon, List, ThumbsUp, MapPin, Calendar } from 'lucide-react';

const IssueCard = ({ issue, getStatusColor, onLike }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
            {/* Image Section */}
            <div className="h-48 bg-gray-100 relative overflow-hidden">
                {issue.image_url ? (
                    <img
                        src={issue.image_url}
                        alt={issue.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        <span className="text-sm">No image available</span>
                    </div>
                )}
                <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getStatusColor(issue.status)}`}>
            {issue.status.replace('_', ' ')}
          </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {issue.title}
                </h3>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                    {issue.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-400 text-xs">
                        <MapPin size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate">
               {issue.address ? issue.address : `Lat: ${issue.latitude.toFixed(4)}, Lng: ${issue.longitude.toFixed(4)}`}
            </span>
                    </div>
                    <div className="flex items-center text-gray-400 text-xs">
                        <Calendar size={14} className="mr-2 flex-shrink-0" />
                        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <button
                        onClick={() => onLike(issue.id)}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors group/btn"
                    >
                        <div className="p-1.5 rounded-full group-hover/btn:bg-red-50 transition-colors">
                            <ThumbsUp size={16} />
                        </div>
                        <span className="text-xs font-medium">{issue.likes_count || 0}</span>
                    </button>
                    <span className="text-xs text-gray-400 font-medium">
                By {issue.reporter_name}
            </span>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const res = await axios.get('/api/issues');
            setIssues(res.data);
        } catch (err) {
            console.error("API failed, using mock data", err);
            // Mock data logic removed for production, but could keep as fallback
            setIssues([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (id) => {
        try {
            await axios.post(`/api/issues/${id}/like`);
            // Optimistic update or refetch
            // For simplicity, refetching mostly, or updating state manually
            // Updating state manually is smoother
            setIssues(issues.map(issue => {
                if (issue.id === id) {
                    // We don't know if we liked or unliked easily without return data
                    // But usually we just want to see the count change.
                    // Ideally the API returns the new count or we fetch it.
                    // Let's refetch for correctness or assume increment for now.
                    // Actually, let's just refetch to be safe.
                    return issue;
                }
                return issue;
            }));
            fetchIssues(); // Simplest way to ensure correct count
        } catch (err) {
            console.error("Failed to like issue", err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-red-100 text-red-700';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700';
            case 'RESOLVED': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getMarkerIcon = (status) => {
        const colors = {
            OPEN: '#ef4444',
            IN_PROGRESS: '#f59e0b',
            RESOLVED: '#10b981',
            DEFAULT: '#3b82f6'
        };
        const color = colors[status] || colors.DEFAULT;

        return divIcon({
            className: 'bg-transparent',
            html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full filter drop-shadow-md">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="white"></circle>
      </svg>
    `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Community Issues</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Found {filteredIssues.length} reports in your area
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search issues..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 w-full sm:w-64 transition-all"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative w-full sm:w-auto">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-auto pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            <option value="ALL">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <MapIcon size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIssues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} getStatusColor={getStatusColor} onLike={handleLike} />
                    ))}
                    {filteredIssues.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={24} />
                            </div>
                            <p>No issues found matching your criteria.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 z-0">
                    <MapContainer center={[45.7489, 21.2087]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {filteredIssues.map((issue) => (
                            <Marker
                                key={issue.id}
                                position={[issue.latitude, issue.longitude]}
                                icon={getMarkerIcon(issue.status)}
                            >
                                <Popup>
                                    <div className="min-w-[200px]">
                                        <h3 className="font-bold text-gray-900 mb-1">{issue.title}</h3>
                                        {issue.address && <p className="text-xs text-gray-500 mb-1 flex items-center"><MapPin size={10} className="mr-1"/>{issue.address}</p>}
                                        <p className="text-sm text-gray-600 mb-2">{issue.description.substring(0, 50)}...</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
