import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Clock, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [issuesRes, statsRes] = await Promise.all([
                axios.get('/api/admin/issues'),
                axios.get('/api/admin/stats')
            ]);
            setIssues(issuesRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.patch(`/api/admin/issues/${id}/status`, { status: newStatus });
            fetchData(); // Refresh data
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-red-100 text-red-700 border border-red-200';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
            case 'RESOLVED': return 'bg-green-100 text-green-700 border border-green-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Helper to get stats safely
    const getStat = (status) => {
        const stat = stats.find(s => s.status === status);
        return stat ? stat.count : 0;
    }

    // Calculate chart data from issues
    const getChartData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        const data = last7Days.map(date => {
            const dateStr = date.toLocaleDateString();
            const count = issues.filter(issue =>
                new Date(issue.created_at).toLocaleDateString() === dateStr
            ).length;
            return {
                date: date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }), // e.g. "Mon 12"
                count
            };
        });

        const maxCount = Math.max(...data.map(d => d.count));

        return data.map(d => ({
            ...d,
            height: maxCount > 0 ? (d.count / maxCount) * 100 : 0
        }));
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Issue Reports', 14, 15);

        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

        const tableColumn = ["Title", "Description", "Location", "Reporter", "Status", "Date"];
        const tableRows = issues.map(issue => [
            issue.title,
            issue.description,
            issue.address || "N/A",
            issue.reporter_name,
            issue.status,
            new Date(issue.created_at).toLocaleDateString()
        ]);

        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
            body: tableRows,
        });

        doc.save('reports.pdf');
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[500px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="py-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of system activity and reports</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                    <Shield size={16} />
                    <span>Admin Access</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Pending Reports</p>
                        <h3 className="text-3xl font-bold text-gray-900">{getStat('OPEN')}</h3>
                        <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                            <AlertCircle size={12} /> Requires attention
                        </p>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <AlertCircle size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">In Progress</p>
                        <h3 className="text-3xl font-bold text-gray-900">{getStat('IN_PROGRESS')}</h3>
                        <p className="text-xs text-yellow-600 mt-2 font-medium flex items-center gap-1">
                            <Clock size={12} /> Currently handling
                        </p>
                    </div>
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                        <Clock size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Resolved Issues</p>
                        <h3 className="text-3xl font-bold text-gray-900">{getStat('RESOLVED')}</h3>
                        <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                            <CheckCircle size={12} /> Completed
                        </p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <CheckCircle size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Simulation (CSS Based) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                    <h3 className="font-bold text-gray-900 mb-6">Reports Overview (Last 7 Days)</h3>
                    <div className="h-64 flex items-end justify-around gap-2 px-4 pb-4 border-b border-gray-100">
                        {getChartData().map((item, i) => (
                            <div key={i} className="w-full h-full flex flex-col justify-end group cursor-pointer">
                                <div
                                    style={{ height: `${item.height}%` }}
                                    className="bg-blue-100 hover:bg-blue-600 rounded-t-lg transition-all duration-300 relative"
                                >
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.count}
                                </span>
                                </div>
                                <span className="text-[10px] text-gray-400 text-center mt-2 truncate w-full">{item.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {issues.slice(0, 5).map(issue => (
                            <div key={issue.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                    issue.status === 'OPEN' ? 'bg-red-500' :
                                        issue.status === 'IN_PROGRESS' ? 'bg-yellow-500' : 'bg-green-500'
                                }`} />
                                <div>
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{issue.title}</p>
                                    <p className="text-xs text-gray-500">
                                        Reported by <span className="text-gray-700">{issue.reporter_name}</span>
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(issue.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                        {issues.length === 0 && <p className="text-sm text-gray-500">No recent activity.</p>}
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">All Reports</h3>
                    <button
                        onClick={generatePDF}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Download size={16} />
                        Download PDF
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reporter</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {issues.map((issue) => (
                            <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{issue.description}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <span className="line-clamp-2">{issue.address || "N/A"}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {issue.reporter_name}
                                </td>
                                <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                                {issue.status}
                            </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(issue.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <select
                                        value={issue.status}
                                        onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                                        className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-1"
                                    >
                                        <option value="OPEN">Open</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="RESOLVED">Resolved</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
