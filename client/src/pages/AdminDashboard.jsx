import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaBullhorn, FaCheckCircle, FaExclamationCircle, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        severity: 'info',
        targetInstitutionId: user?.institutionId || ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const fetchAlerts = async () => {
        try {
            const { data } = await api.get('/alerts');
            setAlerts(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/alerts', formData);
            setStatus({ type: 'success', msg: 'Alert Broadcasted Successfully!' });
            setFormData({ ...formData, title: '', description: '' }); // Reset form
            fetchAlerts(); // Refresh list
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to broadcast alert' });
        }
    };

    const deactivateAlert = async (id) => {
        if (!window.confirm("Are you sure you want to end this alert?")) return;
        try {
            await api.put(`/alerts/${id}`, { active: false });
            fetchAlerts();
        } catch (err) {
            alert('Failed to deactivate');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto text-white">
            <h1 className="text-5xl font-extrabold mb-10 flex items-center gap-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                <FaBullhorn className="text-white" /> Admin Control Center
            </h1>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Create Alert Section - Glass Effect */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

                    <h2 className="text-3xl font-bold mb-6 text-blue-200">Broadcast Alert</h2>

                    {status.msg && (
                        <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/30' : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}>
                            {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                            {status.msg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Alert Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 focus:bg-black/50 transition-all outline-none text-lg placeholder-gray-500"
                                placeholder="e.g., FIRE ALARM SENSOR 3 TRIGGERED"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Severity Level</label>
                            <div className="relative">
                                <select
                                    name="severity"
                                    value={formData.severity}
                                    onChange={handleChange}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 focus:bg-black/50 transition-all outline-none appearance-none"
                                >
                                    <option value="info">🔵 Info / General Announcement</option>
                                    <option value="warning">🟠 Warning / Caution Required</option>
                                    <option value="emergency">🔴 EMERGENCY / IMMEDIATE ACTION</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Instructions</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 focus:bg-black/50 transition-all outline-none h-40 resize-none text-lg placeholder-gray-500"
                                placeholder="Write clear, step-by-step instructions..."
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-red-900/40 flex items-center justify-center gap-3 text-lg tracking-wide uppercase"
                        >
                            <FaBullhorn className="animate-pulse" /> Broadcast Now
                        </button>
                    </form>
                </div>

                {/* Active Alerts List - Glass Effect */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

                    <h2 className="text-3xl font-bold mb-8 text-green-200 flex items-center justify-between">
                        Live Feed
                        <span className="text-sm font-normal bg-white/10 px-3 py-1 rounded-full text-white/60">
                            {alerts.filter(a => a.active).length} Active
                        </span>
                    </h2>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {alerts.filter(a => a.active).length === 0 ? (
                            <div className="text-center py-20 opacity-50 border-2 border-dashed border-white/10 rounded-2xl">
                                <FaCheckCircle className="text-5xl mx-auto mb-4 text-gray-600" />
                                <p className="text-xl">No Active Threats</p>
                                <p className="text-sm mt-2">System is monitoring normally.</p>
                            </div>
                        ) : (
                            alerts.filter(a => a.active).map(alert => (
                                <div key={alert._id} className={`p-6 rounded-2xl border transition-all hover:scale-[1.01] ${alert.severity === 'emergency' ? 'bg-gradient-to-br from-red-900/40 to-red-800/20 border-red-500/50 shadow-red-900/20' :
                                        alert.severity === 'warning' ? 'bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-orange-500/50' :
                                            'bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-500/50'
                                    } shadow-lg`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {alert.severity === 'emergency' && <FaExclamationCircle className="text-red-400 text-xl animate-pulse" />}
                                                <span className={`text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider ${alert.severity === 'emergency' ? 'bg-red-500 text-white' :
                                                        alert.severity === 'warning' ? 'bg-orange-500 text-white' :
                                                            'bg-blue-500 text-white'
                                                    }`}>
                                                    {alert.severity}
                                                </span>
                                                <span className="text-xs text-white/40 font-mono">
                                                    {new Date(alert.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-xl text-white mb-2">{alert.title}</h3>
                                            <p className="text-gray-300 leading-relaxed">{alert.description}</p>
                                        </div>

                                        <button
                                            onClick={() => deactivateAlert(alert._id)}
                                            className="ml-4 bg-black/20 hover:bg-red-600/80 text-white/60 hover:text-white p-3 rounded-lg transition-colors border border-white/5"
                                            title="End Alert"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/10">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Recent History</h3>
                        <div className="space-y-3 opacity-60">
                            {alerts.filter(a => !a.active).slice(0, 3).map(alert => (
                                <div key={alert._id} className="p-3 bg-black/20 rounded-lg flex justify-between items-center text-sm border border-white/5 hover:bg-black/40 transition">
                                    <span className="font-medium text-gray-300 truncate w-2/3">{alert.title}</span>
                                    <span className="text-gray-500 font-mono text-xs">{new Date(alert.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
