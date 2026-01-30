import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaFileAlt, FaPlus, FaDownload } from 'react-icons/fa';

const SOPManagement = () => {
    const [sops, setSops] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        type: 'General',
        content: '',
        fileUrl: ''
    });
    const [status, setStatus] = useState('');

    const fetchSOPs = async () => {
        try {
            const { data } = await api.get('/sops');
            setSops(data);
        } catch (err) {
            console.error('Failed to fetch SOPs');
        }
    };

    useEffect(() => {
        fetchSOPs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sops', formData);
            setStatus('SOP Uploaded Successfully!');
            setFormData({ title: '', type: 'General', content: '', fileUrl: '' });
            fetchSOPs();
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            setStatus('Failed to upload SOP');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto text-white">
            <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                <FaFileAlt className="text-blue-500" /> SOP Management
            </h1>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Upload Form */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-blue-200">Upload New Protocol</h2>

                    {status && (
                        <div className={`p-4 mb-6 rounded-xl ${status.includes('Success') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-400 uppercase">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 transition-all outline-none"
                                placeholder="e.g., Fire Evacuation Plan 2024"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-400 uppercase">Category</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 transition-all outline-none"
                            >
                                <option value="General">General Safety</option>
                                <option value="Fire">Fire Safety</option>
                                <option value="Flood">Flood / Water</option>
                                <option value="Earthquake">Earthquake</option>
                                <option value="Medical">Medical Emergency</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-400 uppercase">Content / Procedures</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 transition-all outline-none h-40"
                                placeholder="Step 1: Sound the alarm..."
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaPlus /> Upload Protocol
                        </button>
                    </form>
                </div>

                {/* SOP List */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-green-200">Existing Protocols</h2>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {sops.map(sop => (
                            <div key={sop._id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="mb-2">
                                            <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300 uppercase tracking-wider">
                                                {sop.type}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg text-white mb-2">{sop.title}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-2">{sop.content}</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-white p-2">
                                        <FaDownload />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {sops.length === 0 && <p className="text-gray-500 text-center py-10">No SOPs uploaded yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SOPManagement;
