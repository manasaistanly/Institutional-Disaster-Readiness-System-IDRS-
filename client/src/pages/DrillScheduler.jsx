import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

const DrillScheduler = () => {
    const [drills, setDrills] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: ''
    });
    const [status, setStatus] = useState('');

    const fetchDrills = async () => {
        try {
            const { data } = await api.get('/drills');
            setDrills(data);
        } catch (err) {
            console.error('Failed to fetch drills');
        }
    };

    useEffect(() => {
        fetchDrills();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/drills', formData);
            setStatus('Drill Scheduled Successfully!');
            setFormData({ title: '', description: '', date: '' });
            fetchDrills();
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            setStatus('Failed to schedule drill');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto text-white">
            <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                <FaCalendarAlt className="text-green-500" /> Drill Scheduler
            </h1>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Schedule Form */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-green-200">Schedule New Drill</h2>

                    {status && (
                        <div className={`p-4 mb-6 rounded-xl ${status.includes('Success') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-400 uppercase">Drill Name</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-green-500 transition-all outline-none"
                                placeholder="e.g., Campus-wide Earthquake Simulation"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-400 uppercase">Date & Time</label>
                            <input
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-green-500 transition-all outline-none calendar-dark"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-400 uppercase">Objectives / Plan</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-green-500 transition-all outline-none h-32"
                                placeholder="Describe the drill scenario..."
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <FaClock /> Schedule Event
                        </button>
                    </form>
                </div>

                {/* Drill Timeline */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-blue-200">Upcoming Timeline</h2>

                    <div className="relative border-l-2 border-white/10 ml-3 space-y-8 pl-8 py-2">
                        {drills.map((drill, idx) => (
                            <div key={drill._id} className="relative group">
                                <span className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-[#111827] ${new Date(drill.date) < new Date() ? 'bg-gray-500' : 'bg-green-500 animate-pulse'
                                    }`}></span>

                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-white">{drill.title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${drill.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                                            }`}>
                                            {drill.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                                        <FaCalendarAlt />
                                        {new Date(drill.date).toLocaleString()}
                                    </div>
                                    <p className="text-gray-400 text-sm">{drill.description}</p>
                                </div>
                            </div>
                        ))}
                        {drills.length === 0 && <p className="text-gray-500 ml-2">No drills scheduled.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrillScheduler;
