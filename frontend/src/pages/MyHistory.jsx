import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, ThumbsUp } from 'lucide-react';

const MyHistory = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyIssues = async () => {
            try {
                const res = await axios.get('/api/issues/my-issues');
                setIssues(res.data);
            } catch (err) {
                console.error("Failed to fetch user issues", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyIssues();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-red-50 text-red-700 border-red-200';
            case 'IN_PROGRESS': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'RESOLVED': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
                <p className="text-gray-500 mt-2">History of the issues you have reported to the community</p>
            </div>

            {issues.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No reports yet</h3>
                    <p className="text-gray-500">You haven't reported any issues. Help improve your city by reporting infrastructure problems.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {issues.map(issue => (
                        <div key={issue.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                            {/* Image Thumbnail */}
                            <div className="md:w-48 h-48 md:h-auto bg-gray-100 flex-shrink-0">
                                {issue.image_url ? (
                                    <img src={issue.image_url} alt={issue.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-sm">No photo</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{issue.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(issue.status)}`}>
                                        {issue.status.replace('_', ' ')}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 flex-1">{issue.description}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span className="truncate">{issue.address || 'Location provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:col-span-2">
                                        <ThumbsUp size={16} className={issue.likes_count > 0 ? "text-blue-500" : "text-gray-400"} />
                                        <span>{issue.likes_count || 0} community members support this</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyHistory;
