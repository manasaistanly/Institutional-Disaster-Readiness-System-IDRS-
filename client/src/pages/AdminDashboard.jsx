import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaBullhorn, FaCheckCircle, FaExclamationCircle, FaTrash, FaShieldAlt, FaUsers, FaHistory, FaSignal } from 'react-icons/fa';
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
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
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

    // calculate stats
    const activeCount = alerts.filter(a => a.active).length;
    const totalCount = alerts.length;
    const emergencyCount = alerts.filter(a => a.active && a.severity === 'emergency').length;

    return (
        <div className="min-h-screen pt-4 pb-8 px-4 container mx-auto text-white">

            {/* 1. Header & Stats Section */}
            <div className="mb-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
                    <div>
                        <h6 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-1">Command Center</h6>
                        <h1 className="text-2xl font-extrabold text-white">Dashboard Overview</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Stat Card 1 */}
                    <div className="bg-[#1f2937]/50 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-blue-500/30 transition-all group">
                        <div>
                            <p className="text-gray-400 text-xs font-medium uppercase">Active Alerts</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{activeCount}</h3>
                        </div>
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <FaSignal className="text-lg" />
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-[#1f2937]/50 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-red-500/30 transition-all group">
                        <div>
                            <p className="text-gray-400 text-xs font-medium uppercase">Emergency Status</p>
                            <h3 className={`text-2xl font-bold mt-1 ${emergencyCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {emergencyCount > 0 ? 'CRITICAL' : 'STABLE'}
                            </h3>
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${emergencyCount > 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                            <FaShieldAlt className="text-lg" />
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-[#1f2937]/50 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-purple-500/30 transition-all group">
                        <div>
                            <p className="text-gray-400 text-xs font-medium uppercase">Total History</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{totalCount}</h3>
                        </div>
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <FaHistory className="text-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="grid lg:grid-cols-12 gap-6 h-full">

                {/* LEFT: Broadcast Form (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#1f2937] border border-white/5 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                                <FaBullhorn className="text-sm" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Broadcast New Alert</h2>
                        </div>

                        {status.msg && (
                            <div className={`p-3 mb-5 rounded-xl flex items-center gap-3 text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                {status.msg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alert Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-sm placeholder-gray-600"
                                        placeholder="e.g. Fire Drill in Block A"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Severity</label>
                                    <select
                                        name="severity"
                                        value={formData.severity}
                                        onChange={handleChange}
                                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-sm"
                                    >
                                        <option value="info">Info</option>
                                        <option value="warning">Warning</option>
                                        <option value="emergency">Critical Emergency</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Detailed Instructions</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none h-24 resize-none leading-relaxed text-sm placeholder-gray-600"
                                    placeholder="Enter detailed safety protocols or instructions..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                <FaBullhorn /> Publish Broadcast
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Live Feed (5 cols) */}
                <div className="lg:col-span-5 h-full">
                    <div className="bg-[#1f2937] border border-white/5 rounded-3xl p-8 shadow-xl h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Live Dispatches</h2>
                            <span className="bg-white/5 text-xs font-bold px-2 py-1 rounded text-gray-400 border border-white/5">Real-time</span>
                        </div>

                        <div className="overflow-y-auto custom-scrollbar flex-1 -mr-2 pr-2 space-y-3">
                            {activeCount === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 min-h-[200px]">
                                    <FaCheckCircle className="text-4xl mb-3" />
                                    <p>All systems normal</p>
                                </div>
                            ) : (
                                alerts.filter(a => a.active).map(alert => (
                                    <div key={alert._id} className="relative pl-6 py-2 group">
                                        {/* Timeline Line */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${alert.severity === 'emergency' ? 'bg-red-500' :
                                            alert.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                                            }`}></div>

                                        <div className="bg-[#111827] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${alert.severity === 'emergency' ? 'bg-red-500/20 text-red-400' :
                                                    alert.severity === 'warning' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {alert.severity}
                                                </span>
                                                <button onClick={() => deactivateAlert(alert._id)} className="text-gray-600 hover:text-red-400 transition-colors">
                                                    <FaTrash className="text-xs" />
                                                </button>
                                            </div>
                                            <h4 className="font-bold text-white text-sm mb-1">{alert.title}</h4>
                                            <p className="text-gray-400 text-xs line-clamp-2">{alert.description}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
