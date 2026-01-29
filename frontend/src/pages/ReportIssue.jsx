import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Upload } from 'lucide-react';

const LocationMarker = ({ setPosition, position }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}/>
    );
};

const ReportIssue = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [position, setPosition] = useState(null);
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchAddress = async () => {
            if (position) {
                try {
                    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
                    if (res.data && res.data.display_name) {
                        // Extract street name and number if possible, otherwise full address
                        const addr = res.data.address;
                        const street = addr.road || addr.pedestrian || addr.street || res.data.display_name.split(',')[0];
                        const number = addr.house_number || '';
                        const city = addr.city || addr.town || addr.village;

                        let locationPart = street;
                        if (locationPart && number) {
                            locationPart = `${street}, ${number}`;
                        }

                        const formatted = city ? `${locationPart}, ${city}` : locationPart;
                        setAddress(formatted || res.data.display_name);
                    }
                } catch (err) {
                    console.error("Failed to fetch address", err);
                    setAddress('');
                }
            }
        };
        fetchAddress();
    }, [position]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!position) {
            setError('Please select a location on the map');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('latitude', position.lat);
        formData.append('longitude', position.lng);
        formData.append('address', address);
        if (image) {
            formData.append('image', image);
        }

        try {
            setLoading(true);
            await axios.post('/api/issues', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
                <p className="text-gray-500 mt-2">Help improve your community by reporting infrastructure issues</p>
            </div>

            {error && <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-lg border border-red-200">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Issue Details Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        Issue Details
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">Provide a clear title and detailed description of the issue</p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="e.g., Pothole on Main Street"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px]"
                                placeholder="Describe the issue in detail. Include any relevant information such as size, severity, and how long it has been there..."
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Location Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        Location
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">Click on the map to select the issue location</p>

                    <div className="h-80 rounded-lg overflow-hidden border border-gray-200 relative">
                        <MapContainer center={[45.7489, 21.2087]} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker setPosition={setPosition} position={position} />
                        </MapContainer>

                        {!position && (
                            <div className="absolute inset-0 bg-black/5 pointer-events-none flex items-center justify-center">
                                <span className="bg-white px-3 py-1 rounded shadow text-xs font-medium text-gray-600">Click to place pin</span>
                            </div>
                        )}
                    </div>
                    {position && (
                        <div className="mt-3 flex flex-col gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                            <div>
                                <span className="font-medium text-blue-600">Coordinates:</span> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                            </div>
                            {address && (
                                <div>
                                    <span className="font-medium text-blue-600">Address:</span> {address}
                                </div>
                            )}
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Confirm or edit address"
                                className="w-full border border-gray-300 px-2 py-1 rounded text-sm mt-1"
                            />
                        </div>
                    )}
                </div>

                {/* Photo Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        Photo (Optional)
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">Upload a photo to help illustrate the issue</p>

                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-10 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-500 group-hover:text-blue-600 transition-colors">
                            <Upload size={32} />
                            <span className="font-medium">
                            {image ? image.name : "Click to upload an image (max 5MB)"}
                        </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 pb-12 gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 px-6 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ReportIssue;
